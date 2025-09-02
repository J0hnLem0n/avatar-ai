@echo off
echo Starting SadTalker Avatar Generator Project...
echo.

echo Starting API Server...
start "API Server" cmd /k "cd api && python app.py"

echo Waiting for API server to start...
timeout /t 5 /nobreak > nul

echo Starting UI...
start "UI" cmd /k "cd ui && npm start"

echo.
echo Project started successfully!
echo API Server: http://localhost:5000
echo UI: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
