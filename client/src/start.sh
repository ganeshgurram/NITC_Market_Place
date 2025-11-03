#!/bin/bash

# NITC Marketplace - Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting NITC Marketplace..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  - On macOS/Linux: mongod"
    echo "  - Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    read -p "Press Enter once MongoDB is running, or Ctrl+C to exit..."
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration!"
fi

# Start backend in background
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) - Logs: backend.log"
echo "   Backend running on: http://localhost:5000"

# Return to root
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
fi

echo "✅ Frontend starting..."
echo "   Frontend will run on: http://localhost:5173"
echo ""
echo "=================================================="
echo "🎉 NITC Marketplace is starting!"
echo "=================================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Admin Login:"
echo "  Email: admin@nitc.ac.in"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================================="
echo ""

# Start frontend (this will run in foreground)
npm run dev

# Cleanup when script is terminated
echo ""
echo "🛑 Shutting down servers..."
kill $BACKEND_PID 2>/dev/null
echo "✅ Servers stopped"
