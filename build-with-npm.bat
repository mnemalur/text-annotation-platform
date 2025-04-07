@echo off
echo Building the Data Annotation Platform with npm...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please run install-nodejs.bat first.
    pause
    exit /b 1
)

REM Build the project
echo Building the project...
call npm run build

echo Build complete.
pause 