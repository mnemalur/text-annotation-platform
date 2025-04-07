@echo off
echo Checking if Node.js is installed...

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Node.js is already installed.
    node -v
    pause
    exit /b 0
)

echo Node.js is not installed. Downloading Node.js installer...

REM Download Node.js installer
powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi' -OutFile 'node-installer.msi'}"

if not exist node-installer.msi (
    echo Failed to download Node.js installer.
    echo Please download and install Node.js manually from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing Node.js...
start /wait msiexec /i node-installer.msi /qn

echo Node.js installation complete.
echo Please run setup-windows.bat to continue with the project setup.
pause 