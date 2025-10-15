#!/bin/bash

# Start script for the Generative Art Therapy application

echo "🎨 Starting Generative Art Therapy Application..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys before running again."
    echo "   Required: GOOGLE_API_KEY, OPENAI_API_KEY"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$GOOGLE_API_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Missing required API keys in .env file"
    echo "   Please set GOOGLE_API_KEY and OPENAI_API_KEY"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "../frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd ../frontend && npm install && cd ../backend
fi

# Build frontend
echo "🔨 Building frontend..."
cd ../frontend && npm run build && cd ../backend

# Start the application
echo "🚀 Starting server..."
npm start
