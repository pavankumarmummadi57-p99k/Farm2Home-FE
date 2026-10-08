@echo off
title Build Farm2Home Angular Frontend
cd /d "%~dp0"

if not exist node_modules (
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

call npm run build:prod
echo.
echo Build output: dist\farm2home-frontend
pause
