@echo off
echo Quick Start for the Data Annotation Platform with npm...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please run install-nodejs.bat first.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please update the .env file with your configuration.
)

REM Generate Prisma client and set up the database
echo Setting up the database...
call npx prisma generate
call npx prisma db push

REM Start the development server
echo Starting development server...
call npm run dev 