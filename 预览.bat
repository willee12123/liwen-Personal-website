@echo off
chcp 65001 >nul
title Liwen Personal Website

echo ========================================
echo   Liwen Personal Website - Local Preview
echo ========================================
echo.

REM Get the directory where this bat file is located
cd /d "%~dp0"

echo Serving from: %cd%\dist
echo.
echo Open this in your browser:
echo.
echo     http://localhost:8888
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Try Python first, fallback to npx serve
python -m http.server 8888 -d "dist" 2>nul || npx serve dist -l 8888