import os
import sys
import json
import time
import threading
import subprocess

from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import tempfile
import shutil

# Путь к SadTalker
sadtalker_path = os.path.join(os.path.dirname(__file__), '..', 'SadTalker')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Настройка CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Настройка Socket.IO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Глобальные переменные для отслеживания состояния
generation_tasks = {}
task_counter = 0

class SadTalkerProcessor:
    def __init__(self):
        self.sadtalker_path = sadtalker_path
        self.output_path = os.path.join(os.path.dirname(__file__), 'output')
        os.makedirs(self.output_path, exist_ok=True)
        
    def process_generation(self, task_id, image_path, audio_path, settings):
        """Обрабатывает генерацию аватара через SadTalker"""
        try:
            print(f"=== Starting generation for task {task_id} ===")
            print(f"Image path: {image_path}")
            print(f"Audio path: {audio_path}")
            print(f"Settings: {settings}")
            
            # Создаем уникальную папку для результата
            timestamp = datetime.now().strftime("%Y_%m_%d_%H.%M.%S")
            result_dir = os.path.join(self.output_path, f"task_{task_id}_{timestamp}")
            os.makedirs(result_dir, exist_ok=True)
            print(f"Result directory created: {result_dir}")
            
            # Формируем команду для запуска SadTalker через его виртуальное окружение
            sadtalker_venv_python = os.path.join(self.sadtalker_path, '.venv', 'Scripts', 'python.exe')
            
            # Проверяем существование Python в виртуальном окружении SadTalker
            if not os.path.exists(sadtalker_venv_python):
                raise Exception(f"Python not found in SadTalker venv: {sadtalker_venv_python}")
            
            # Формируем аргументы для inference.py
            cmd_args = [
                sadtalker_venv_python,
                'inference.py',
                '--driven_audio', audio_path,
                '--source_image', image_path,
                '--result_dir', result_dir,
                '--size', str(settings.get('size', 256)),
                '--preprocess', settings.get('preprocess', 'crop'),
                '--pose_style', str(settings.get('pose_style', 0)),
                '--expression_scale', str(settings.get('expression_scale', 1.0)),
                '--batch_size', str(settings.get('batch_size', 2))
            ]
            
            # Добавляем опциональные параметры
            if settings.get('enhancer'):
                cmd_args.extend(['--enhancer', settings['enhancer']])
            if settings.get('background_enhancer'):
                cmd_args.extend(['--background_enhancer', settings['background_enhancer']])
            if settings.get('still_mode'):
                cmd_args.append('--still')
            if settings.get('face3dvis'):
                cmd_args.append('--face3dvis')
            if settings.get('verbose'):
                cmd_args.append('--verbose')
            
            print(f"Executing SadTalker with command: {cmd_args}")
            print(f"Working directory: {self.sadtalker_path}")
            
            # Отправляем событие о начале генерации
            socketio.emit('generation_started', {'task_id': task_id})
            
            # Запускаем SadTalker через subprocess
            import subprocess
            process = subprocess.Popen(
                cmd_args,
                cwd=self.sadtalker_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Ждем завершения процесса
            stdout, stderr = process.communicate()
            
            print(f"SadTalker stdout: {stdout}")
            if stderr:
                print(f"SadTalker stderr: {stderr}")
            
            # Проверяем успешность выполнения
            if process.returncode == 0:
                print("SadTalker execution completed successfully")
                
                # Ищем сгенерированное видео
                video_files = []
                for root, dirs, files in os.walk(result_dir):
                    for file in files:
                        if file.endswith('.mp4'):
                            video_files.append(os.path.join(root, file))
                
                print(f"Found video files: {video_files}")
                
                if video_files:
                    # Берем первый найденный MP4 файл
                    video_path = video_files[0]
                    video_filename = os.path.basename(video_path)
                    
                    # Проверяем размер файла
                    file_size = os.path.getsize(video_path)
                    print(f"Video file size: {file_size} bytes")
                    
                    if file_size == 0:
                        raise Exception("Video file is empty")
                    
                    # Копируем видео в основную папку output для доступа через API
                    final_video_path = os.path.join(self.output_path, video_filename)
                    import shutil
                    shutil.copy2(video_path, final_video_path)
                    print(f"Copied video to: {final_video_path}")
                    
                    # Проверяем скопированный файл
                    copied_size = os.path.getsize(final_video_path)
                    print(f"Copied file size: {copied_size} bytes")
                    
                    if copied_size != file_size:
                        raise Exception(f"File copy failed: original {file_size}, copied {copied_size}")
                    
                    video_url = f"http://localhost:5000/output/{video_filename}"
                    
                    # Отправляем событие о завершении
                    result_data = {
                        'task_id': task_id,
                        'video_url': video_url,
                        'video_path': final_video_path,
                        'result_dir': result_dir,
                        'status': 'completed'
                    }
                    
                    socketio.emit('generation_completed', result_data)
                    
                    # Обновляем статус задачи
                    if task_id in generation_tasks:
                        generation_tasks[task_id]['status'] = 'completed'
                        generation_tasks[task_id]['result'] = result_data
                else:
                    # Выводим содержимое папки для отладки
                    print(f"Contents of result_dir {result_dir}:")
                    for root, dirs, files in os.walk(result_dir):
                        print(f"  {root}: {dirs} {files}")
                    raise Exception("No video file generated")
            else:
                error_msg = stderr if stderr else "Unknown error occurred"
                raise Exception(f"SadTalker process failed with return code {process.returncode}: {error_msg}")
                
        except Exception as e:
            error_data = {
                'task_id': task_id,
                'error': str(e),
                'status': 'error'
            }
            
            socketio.emit('generation_error', error_data)
            
            # Обновляем статус задачи
            if task_id in generation_tasks:
                generation_tasks[task_id]['status'] = 'error'
                generation_tasks[task_id]['error'] = str(e)
            
            print(f"Error in task {task_id}: {e}")

# Инициализируем процессор
processor = SadTalkerProcessor()

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка состояния API"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'sadtalker_path': sadtalker_path,
        'active_tasks': len([t for t in generation_tasks.values() if t['status'] == 'generating'])
    })

@app.route('/upload', methods=['POST'])
def upload_files():
    """Загрузка файлов через HTTP POST"""
    try:
        print("=== Upload request received ===")
        print(f"Files in request: {list(request.files.keys())}")
        print(f"Form data: {list(request.form.keys())}")
        
        if 'image' not in request.files or 'audio' not in request.files:
            print("Missing image or audio file")
            return jsonify({'error': 'Missing image or audio file'}), 400
        
        image_file = request.files['image']
        audio_file = request.files['audio']
        
        print(f"Image file: {image_file.filename}, size: {len(image_file.read())}")
        image_file.seek(0)  # Сбрасываем позицию чтения
        print(f"Audio file: {audio_file.filename}, size: {len(audio_file.read())}")
        audio_file.seek(0)  # Сбрасываем позицию чтения
        
        # Создаем временную папку
        temp_dir = tempfile.mkdtemp()
        
        # Сохраняем файлы с правильными расширениями
        image_ext = os.path.splitext(image_file.filename)[1] if image_file.filename else '.jpg'
        audio_ext = os.path.splitext(audio_file.filename)[1] if audio_file.filename else '.wav'
        
        image_path = os.path.join(temp_dir, f'source_image{image_ext}')
        audio_path = os.path.join(temp_dir, f'driven_audio{audio_ext}')
        
        image_file.save(image_path)
        audio_file.save(audio_path)
        
        # Извлекаем настройки
        settings = {}
        for key in request.form:
            if key not in ['image', 'audio']:
                value = request.form[key]
                try:
                    if value.lower() in ['true', 'false']:
                        settings[key] = value.lower() == 'true'
                    elif value.isdigit():
                        settings[key] = int(value)
                    elif value.replace('.', '').isdigit():
                        settings[key] = float(value)
                    else:
                        settings[key] = value
                except:
                    settings[key] = value
        
        # Создаем задачу
        global task_counter
        task_id = f"task_{task_counter}_{int(time.time())}"
        task_counter += 1
        
        print(f"Created task: {task_id}")
        
        generation_tasks[task_id] = {
            'id': task_id,
            'status': 'generating',
            'start_time': datetime.now(),
            'settings': settings,
            'temp_dir': temp_dir,
            'image_path': image_path,
            'audio_path': audio_path
        }
        
        print(f"Starting generation thread for task {task_id}")
        
        # Запускаем генерацию в отдельном потоке
        thread = threading.Thread(
            target=processor.process_generation,
            args=(task_id, image_path, audio_path, settings)
        )
        thread.daemon = True
        thread.start()
        
        print(f"Generation thread started for task {task_id}")
        
        return jsonify({
            'task_id': task_id,
            'status': 'started',
            'message': 'Generation started successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/output/<filename>', methods=['GET', 'HEAD'])
def serve_output(filename):
    """Сервис для раздачи сгенерированных файлов"""
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    file_path = os.path.join(output_dir, filename)
    
    if os.path.exists(file_path):
        # Для HEAD запросов возвращаем только заголовки
        if request.method == 'HEAD':
            response = make_response('', 200)
            response.headers['Content-Type'] = 'video/mp4'
            response.headers['Content-Length'] = str(os.path.getsize(file_path))
            response.headers['Accept-Ranges'] = 'bytes'
            response.headers['Cache-Control'] = 'no-cache'
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Range'
            return response
        
        # Для GET запросов возвращаем файл
        response = send_file(
            file_path, 
            mimetype='video/mp4',
            as_attachment=False
        )
        
        # Добавляем заголовки для правильного воспроизведения
        response.headers['Accept-Ranges'] = 'bytes'
        response.headers['Cache-Control'] = 'no-cache'
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Range'
        
        return response
    else:
        return jsonify({'error': 'File not found'}), 404

@socketio.on('connect')
def handle_connect():
    """Обработка подключения клиента"""
    print(f"Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to SadTalker API'})

@socketio.on('disconnect')
def handle_disconnect():
    """Обработка отключения клиента"""
    print(f"Client disconnected: {request.sid}")

@socketio.on('generation_started')
def handle_generation_started(data):
    """Обработка уведомления о начале генерации через WebSocket"""
    try:
        # Получаем task_id из данных
        task_id = data.get('task_id')
        
        if not task_id:
            emit('generation_error', {
                'error': 'Missing task_id',
                'status': 'error'
            })
            return
        
        # Проверяем существование задачи
        if task_id not in generation_tasks:
            emit('generation_error', {
                'error': 'Task not found',
                'status': 'error'
            })
            return
        
        # Отправляем подтверждение о начале генерации
        emit('generation_started', {'task_id': task_id})
        
        # Подписываем клиента на события для этой задачи
        socketio.emit('task_created', {'task_id': task_id}, room=request.sid)
        
    except Exception as e:
        emit('generation_error', {
            'error': f'Failed to start generation: {str(e)}',
            'status': 'error'
        })

@socketio.on('get_task_status')
def handle_get_task_status(data):
    """Получение статуса задачи"""
    task_id = data.get('task_id')
    
    if task_id in generation_tasks:
        task = generation_tasks[task_id]
        emit('task_status', {
            'task_id': task_id,
            'status': task['status'],
            'result': task.get('result'),
            'error': task.get('error')
        })
    else:
        emit('task_status', {
            'task_id': task_id,
            'status': 'not_found'
        })

@socketio.on('join_task_room')
def handle_join_task_room(data):
    """Присоединение к комнате задачи для получения уведомлений"""
    task_id = data.get('task_id')
    if task_id:
        socketio.emit('joined_task_room', {'task_id': task_id}, room=request.sid)

@socketio.on('get_generation_status')
def handle_get_generation_status():
    """Получение текущего статуса генерации"""
    active_tasks = [t for t in generation_tasks.values() if t['status'] == 'generating']
    emit('generation_status_update', {
        'active_tasks': len(active_tasks),
        'total_tasks': len(generation_tasks)
    })

if __name__ == '__main__':
    print("Starting SadTalker API Server...")
    print(f"SadTalker path: {sadtalker_path}")
    print(f"Output path: {os.path.join(os.path.dirname(__file__), 'output')}")
    
    # Запускаем сервер
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
