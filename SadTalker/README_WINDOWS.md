# SadTalker - Установка моделей в Windows

## 🚫 Проблема
Скрипт `bash scripts/download_models.sh` не работает в Windows, так как это bash-скрипт для Linux/Mac.

## ✅ Решение для Windows

### Способ 1: Batch файл (рекомендуется)
1. **Запустите** `download_models_windows.bat` двойным кликом
2. **Дождитесь** завершения загрузки всех моделей
3. **Проверьте** папки `checkpoints` и `gfpgan\weights`

### Способ 2: PowerShell скрипт
1. **Откройте PowerShell** от имени администратора
2. **Перейдите** в папку SadTalker: `cd "путь\к\SadTalker"`
3. **Запустите**: `.\download_models_windows.ps1`
4. **Дождитесь** завершения загрузки

### Способ 3: Ручная загрузка
Если скрипты не работают, скачайте модели вручную:

#### Основные модели (папка `checkpoints`):
- [mapping_00109-model.pth.tar](https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00109-model.pth.tar)
- [mapping_00229-model.pth.tar](https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/mapping_00229-model.pth.tar)
- [SadTalker_V0.0.2_256.safetensors](https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_256.safetensors)
- [SadTalker_V0.0.2_512.safetensors](https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc/SadTalker_V0.0.2_512.safetensors)

#### Модели улучшения качества (папка `gfpgan\weights`):
- [alignment_WFLW_4HG.pth](https://github.com/xinntao/facexlib/releases/download/v0.1.0/alignment_WFLW_4HG.pth)
- [detection_Resnet50_Final.pth](https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth)
- [GFPGANv1.4.pth](https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth)
- [parsing_parsenet.pth](https://github.com/xinntao/facexlib/releases/download/v0.2.2/parsing_parsenet.pth)

## 📁 Структура папок после загрузки

```
SadTalker/
├── checkpoints/
│   ├── mapping_00109-model.pth.tar
│   ├── mapping_00229-model.pth.tar
│   ├── SadTalker_V0.0.2_256.safetensors
│   └── SadTalker_V0.0.2_512.safetensors
└── gfpgan/
    └── weights/
        ├── alignment_WFLW_4HG.pth
        ├── detection_Resnet50_Final.pth
        ├── GFPGANv1.4.pth
        └── parsing_parsenet.pth
```

## ⚠️ Важные замечания

1. **Размер моделей**: Общий размер ~2-3 GB
2. **Время загрузки**: Зависит от скорости интернета
3. **Права доступа**: Убедитесь, что у вас есть права на запись в папку
4. **Антивирус**: Может блокировать загрузку - добавьте папку в исключения

## 🔧 Устранение проблем

### Ошибка "curl не является внутренней или внешней командой"
- **Решение**: Установите [curl для Windows](https://curl.se/windows/) или используйте PowerShell скрипт

### Ошибка "Access Denied"
- **Решение**: Запустите командную строку/PowerShell от имени администратора

### Медленная загрузка
- **Решение**: Используйте VPN или попробуйте в другое время

### Неполная загрузка
- **Решение**: Удалите неполные файлы и запустите скрипт заново

## ✅ Проверка установки

После загрузки проверьте:
1. Все файлы присутствуют в нужных папках
2. Размеры файлов соответствуют ожидаемым
3. SadTalker запускается без ошибок о missing models

## 🚀 Запуск SadTalker

После установки моделей запустите:
```bash
python inference.py --driven_audio input/speech.wav --source_image input/photo.jpg --result_dir output
```
