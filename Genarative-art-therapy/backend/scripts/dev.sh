#!/bin/bash

# Development script for the Generative Art Therapy application

echo "🎨 Starting Generative Art Therapy Application in Development Mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys before running again."
    echo "   Required: GOOGLE_API_KEY, OPENAI_API_KEY"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Start backend in development mode
echo "🚀 Starting backend server in development mode..."
npm run dev &

# Wait a moment for backend to start
sleep 3

# Start frontend in development mode
echo "🎨 Starting frontend in development mode..."
cd ../frontend && npm start
