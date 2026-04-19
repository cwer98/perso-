@echo off
echo Lancement de MuscleTrack...
echo Fermeture de l'ancien serveur si actif...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
cd /d "%~dp0backend"
start "" "http://localhost:3000"
node server.js
pause
