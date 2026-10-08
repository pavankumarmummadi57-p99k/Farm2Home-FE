@echo off
title Farm2Home Angular Frontend
cd /d "%~dp0"

echo ============================================
echo Farm2Home Angular Frontend
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or is not in PATH.
  echo Install a compatible Node.js version and run this file again.
  pause
  exit /b 1
)

echo Node:
node --version
echo NPM:
npm --version
echo.

if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo.
echo Make sure Spring Boot is running at http://localhost:8080
echo Starting Angular at http://localhost:4200
echo.
call npm start
pause
