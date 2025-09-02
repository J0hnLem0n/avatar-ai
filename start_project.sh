#!/bin/bash

echo "Starting SadTalker Avatar Generator Project..."
echo ""

# Проверяем, что Python установлен
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 not found. Please install Python 3.8+ and try again."
    exit 1
fi

# Проверяем, что Node.js установлен
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found. Please install Node.js 16+ and try again."
    exit 1
fi

# Проверяем, что npm установлен
if ! command -v npm &> /dev/null; then
    echo "Error: npm not found. Please install npm and try again."
    exit 1
fi

echo "Starting API Server..."
cd api
python3 app.py &
API_PID=$!
cd ..

echo "Waiting for API server to start..."
sleep 5

echo "Starting UI..."
cd ui
npm start &
UI_PID=$!
cd ..

echo ""
echo "Project started successfully!"
echo "API Server: http://localhost:5000"
echo "UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services..."

# Функция для остановки всех процессов
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $API_PID 2>/dev/null
    kill $UI_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Перехватываем сигнал прерывания
trap cleanup SIGINT

# Ждем завершения
wait
