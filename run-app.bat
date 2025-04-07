@echo off
echo Starting the Data Annotation Platform...

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

REM Check if .env file exists
if not exist .env (
    echo .env file not found. Creating from template...
    copy .env.example .env
    echo Please update the .env file with your configuration.
)

REM Check if database is set up
if not exist prisma\dev.db (
    echo Database not found. Setting up database...
    call pnpm prisma generate
    call pnpm prisma db push
)

REM Start the development server
echo Starting development server...
call pnpm dev 