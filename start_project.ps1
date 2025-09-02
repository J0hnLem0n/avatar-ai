Write-Host "Starting SadTalker Avatar Generator Project..." -ForegroundColor Green
Write-Host ""

# Проверяем, что Python установлен
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python not found. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Проверяем, что Node.js установлен
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js not found. Please install Node.js 16+ and try again." -ForegroundColor Red
    exit 1
}

# Проверяем, что npm установлен
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm not found. Please install npm and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Starting API Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\api'; python app.py" -WindowStyle Normal

Write-Host "Waiting for API server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting UI..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ui'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Project started successfully!" -ForegroundColor Green
Write-Host "API Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "UI: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
