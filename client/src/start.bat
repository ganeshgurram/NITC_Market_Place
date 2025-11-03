@echo off
REM NITC Marketplace - Startup Script for Windows
REM This script starts both the backend and frontend servers

echo.
echo ======================================================
echo    Starting NITC Marketplace
echo ======================================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo.
    echo WARNING: MongoDB does not appear to be running!
    echo Please start MongoDB first:
    echo   - Install MongoDB and run: mongod
    echo   - Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest
    echo.
    pause
)

REM Start backend
echo.
echo Starting backend server...
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo WARNING: Please update .env with your configuration!
    echo.
)

REM Start backend in background
start "NITC Backend" cmd /c "npm run dev > ../backend.log 2>&1"
echo Backend started - Logs: backend.log
echo Backend running on: http://localhost:5000

REM Return to root
cd ..

REM Wait for backend to be ready
echo.
echo Waiting for backend to be ready...
timeout /t 3 /nobreak > nul

REM Start frontend
echo.
echo Starting frontend server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo Creating frontend .env file...
    echo VITE_API_URL=http://localhost:5000/api > .env
)

echo.
echo ======================================================
echo    NITC Marketplace is starting!
echo ======================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Admin Login:
echo   Email: admin@nitc.ac.in
echo   Password: admin123
echo.
echo Press Ctrl+C to stop the frontend server
echo (Backend will continue running in separate window)
echo ======================================================
echo.

REM Start frontend
call npm run dev
