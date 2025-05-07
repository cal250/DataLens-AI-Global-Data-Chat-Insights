#!/bin/bash

# Create necessary directories
mkdir -p frontend/src/components
mkdir -p backend/src/routes

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd ../backend
npm install

# Create .env files
echo "Creating environment files..."
cd ../backend
cp .env.example .env
echo "Please update the .env file with your actual credentials"

# Build the project
echo "Building the project..."
cd ../frontend
npm run build
cd ../backend
npm run build

echo "Setup complete! To start the development servers:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev" 