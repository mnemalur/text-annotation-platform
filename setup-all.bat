@echo off
echo Setting up the Data Annotation Platform...

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

REM Install additional dependencies for development
echo Installing development dependencies...
call pnpm add -D @types/node @types/react @types/react-dom typescript @types/bcrypt

REM Install authentication dependencies
echo Installing authentication dependencies...
call pnpm add next-auth @auth/prisma-adapter bcrypt

REM Install UI dependencies
echo Installing UI dependencies...
call pnpm add @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

REM Install form dependencies
echo Installing form dependencies...
call pnpm add react-hook-form @hookform/resolvers zod

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

REM Build the project
echo Building the project...
call pnpm build

echo Setup complete! You can now start the development server with: pnpm dev
pause 