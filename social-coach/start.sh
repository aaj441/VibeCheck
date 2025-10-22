#!/bin/bash

# Social Coach Startup Script

echo "🚀 Starting Social Coach for Neurodivergent Users..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your database credentials"
    exit 1
fi

# Check if node_modules exists
if [ ! -d backend/node_modules ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start the backend
echo "🔧 Starting backend server..."
cd backend && npm run dev