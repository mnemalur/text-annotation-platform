@echo off
echo Setting up the database with npm...

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

REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate

REM Push database schema
echo Pushing database schema...
call npx prisma db push

echo Database setup complete.
pause 