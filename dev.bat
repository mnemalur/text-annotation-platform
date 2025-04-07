@echo off
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set NEXT_SKIP_CHECKS=1

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Starting development server with optimizations...
npm run dev -- --turbo 