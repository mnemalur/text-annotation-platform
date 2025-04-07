@echo off
echo Running the Data Annotation Platform with npm...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please run install-nodejs.bat first.
    pause
    exit /b 1
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
    call npx prisma generate
    call npx prisma db push
)

REM Start the development server
echo Starting development server...
call npm run dev 