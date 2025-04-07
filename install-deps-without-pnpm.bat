@echo off
echo Installing dependencies without pnpm...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please run install-nodejs.bat first.
    pause
    exit /b 1
)

REM Install dependencies using npm
echo Installing project dependencies...
call npm install

REM Install additional dependencies for development
echo Installing development dependencies...
call npm install --save-dev @types/node @types/react @types/react-dom typescript @types/bcrypt

REM Install authentication dependencies
echo Installing authentication dependencies...
call npm install next-auth @auth/prisma-adapter bcrypt

REM Install UI dependencies
echo Installing UI dependencies...
call npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

REM Install form dependencies
echo Installing form dependencies...
call npm install react-hook-form @hookform/resolvers zod

echo Dependencies installation complete.
pause 