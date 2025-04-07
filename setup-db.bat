@echo off
echo Setting up the database for the Data Annotation Platform...

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

REM Generate Prisma client
echo Generating Prisma client...
call pnpm prisma generate

REM Push database schema
echo Pushing database schema...
call pnpm prisma db push

echo Database setup complete.
pause 