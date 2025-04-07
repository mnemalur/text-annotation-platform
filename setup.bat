@echo off

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js 18 or later.
    exit /b 1
)

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing pnpm...
    npm install -g pnpm
)

REM Install dependencies
echo Installing dependencies...
call pnpm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please update the .env file with your configuration values.
)

REM Generate Prisma client
echo Generating Prisma client...
call pnpm prisma generate

REM Create database and run migrations
echo Setting up database...
call pnpm prisma db push

REM Build the project
echo Building the project...
call pnpm build

echo Setup complete! You can now start the development server with: pnpm dev 