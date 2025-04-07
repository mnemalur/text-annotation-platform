@echo off
echo Quick Start for the Data Annotation Platform...

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

REM Install dependencies
echo Installing dependencies...
call pnpm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please update the .env file with your configuration.
)

REM Generate Prisma client and set up the database
echo Setting up the database...
call pnpm prisma generate
call pnpm prisma db push

REM Start the development server
echo Starting development server...
call pnpm dev 