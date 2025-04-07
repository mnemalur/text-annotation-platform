@echo off
echo Building the Data Annotation Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please run install-node.bat first.
    pause
    exit /b 1
)

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo pnpm is not installed. Installing pnpm...
    call npm install -g pnpm
    if %ERRORLEVEL% neq 0 (
        echo Failed to install pnpm. Please install it manually: npm install -g pnpm
        pause
        exit /b 1
    )
)

REM Build the project
echo Building the project...
call pnpm build

echo Build complete.
pause 