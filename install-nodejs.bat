@echo off
echo Installing Node.js for the Data Annotation Platform...

REM Check if Node.js is already installed
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Node.js is already installed.
    node -v
    pause
    exit /b 0
)

REM Download Node.js installer
echo Downloading Node.js installer...
powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi' -OutFile 'node-installer.msi'}"

if not exist node-installer.msi (
    echo Failed to download Node.js installer.
    echo Please download and install Node.js manually from https://nodejs.org/
    pause
    exit /b 1
)

REM Install Node.js
echo Installing Node.js...
start /wait msiexec /i node-installer.msi /qn

REM Clean up
del node-installer.msi

echo Node.js installation complete.
echo Please run quick-start.bat to continue with the project setup.
pause 