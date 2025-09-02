# SadTalker Avatar Generator UI

Современный веб-интерфейс для генерации цифровых аватаров с помощью SadTalker AI. Проект включает в себя React UI с Material Design и Python API сервер.

## 🚀 Возможности

- **Современный UI**: Темная тема с Material Design компонентами
- **Drag & Drop**: Удобная загрузка изображений и аудио файлов
- **Настройки генерации**: Полный контроль над параметрами SadTalker
- **Real-time обновления**: WebSocket уведомления о статусе генерации
- **Видеоплеер**: Встроенный плеер с временной шкалой и контролами
- **Адаптивный дизайн**: Работает на всех устройствах

## 🏗️ Архитектура

```
├── ui/                    # React UI приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── contexts/     # React контексты
│   │   └── App.js        # Главный компонент
│   └── package.json      # Зависимости UI
├── api/                   # Python API сервер
│   ├── app.py            # Flask + Socket.IO сервер
│   └── requirements.txt  # Python зависимости
└── SadTalker/            # SadTalker AI модель
```

## 🛠️ Технологии

### Frontend (UI)
- **React 18** - Современная библиотека для UI
- **Material-UI (MUI)** - Компоненты Material Design
- **Styled Components** - CSS-in-JS стилизация
- **Socket.IO Client** - Real-time коммуникация
- **React Dropzone** - Drag & Drop загрузка файлов

### Backend (API)
- **Flask** - Python веб-фреймворк
- **Flask-SocketIO** - WebSocket поддержка
- **Flask-CORS** - Cross-origin запросы
- **Subprocess** - Интеграция с SadTalker

## 📋 Требования

- **Python 3.8+** с установленными зависимостями SadTalker
- **Node.js 16+** и npm/yarn
- **SadTalker** с загруженными моделями

## 🚀 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd avatar
```

### 2. Настройка API сервера

```bash
cd api
pip install -r requirements.txt
```

### 3. Настройка UI

```bash
cd ui
npm install
```

### 4. Запуск

#### Запуск API сервера (в папке api):
```bash
python app.py
```

#### Запуск UI (в папке ui):
```bash
npm start
```

## 🔧 Конфигурация

### Настройки API сервера

В файле `api/app.py` можно изменить:
- Порт сервера (по умолчанию 5000)
- Максимальный размер файла (по умолчанию 100MB)
- Путь к SadTalker

### Настройки UI

В файле `ui/src/contexts/SocketContext.js` можно изменить:
- URL API сервера (по умолчанию localhost:5000)

## 📱 Использование

1. **Загрузка файлов**: Перетащите изображение и аудио файл в соответствующие зоны
2. **Настройка параметров**: Откройте настройки и настройте параметры генерации
3. **Запуск генерации**: Нажмите "Generate Avatar" для начала процесса
4. **Мониторинг**: Следите за прогрессом через WebSocket уведомления
5. **Просмотр результата**: После завершения видео автоматически отобразится в плеере

## ⚙️ Параметры генерации

### Обработка изображения
- **Preprocessing**: crop, extcrop, resize, full, extfull
- **Image Size**: 128px, 256px, 512px
- **Still Mode**: Полнотелая анимация

### Анимация
- **Pose Style**: 0-45 (различные стили поз)
- **Expression Scale**: 0.1-2.0 (интенсивность выражений)
- **Batch Size**: 1-4 (размер пакета обработки)

### Улучшения
- **Face Enhancer**: GFPGAN, RestoreFormer
- **Background Enhancer**: Real-ESRGAN
- **3D Visualization**: Генерация 3D лица
- **Verbose Output**: Сохранение промежуточных результатов

## 🔌 API Endpoints

### HTTP Endpoints
- `GET /health` - Проверка состояния сервера
- `GET /output/<filename>` - Скачивание сгенерированных файлов

### WebSocket Events
- `connect` - Подключение клиента
- `start_generation` - Запуск генерации
- `generation_started` - Генерация началась
- `generation_completed` - Генерация завершена
- `generation_error` - Ошибка генерации

## 🐛 Устранение неполадок

### Проблемы с подключением
1. Проверьте, что API сервер запущен на порту 5000
2. Убедитесь, что CORS настроен правильно
3. Проверьте консоль браузера на ошибки

### Проблемы с генерацией
1. Убедитесь, что SadTalker установлен и настроен
2. Проверьте логи API сервера
3. Убедитесь, что модели SadTalker загружены

### Проблемы с UI
1. Проверьте версии Node.js и npm
2. Очистите кэш npm: `npm cache clean --force`
3. Удалите node_modules и переустановите зависимости

## 📈 Производительность

- **Время генерации**: Зависит от длины аудио и выбранных настроек
- **Память**: Требует достаточно RAM для работы SadTalker
- **GPU**: Рекомендуется CUDA для ускорения

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Проект использует лицензию SadTalker. См. файл LICENSE в папке SadTalker.

## 🙏 Благодарности

- [SadTalker](https://github.com/OpenTalker/SadTalker) - AI модель для генерации аватаров
- [Material-UI](https://mui.com/) - Компоненты Material Design
- [React](https://reactjs.org/) - JavaScript библиотека для UI
- [Flask](https://flask.palletsprojects.com/) - Python веб-фреймворк
