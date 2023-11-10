#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Get latest changes
echo "Pulling latest changes from git"
git pull

# Cleanup old build files
echo "Cleaning up old build files"
rm -rf $SCRIPT_DIR/frontend/public/build
rm -rf $SCRIPT_DIR/frontend/dist

# Ensure frontend dependencies all exist
echo "Installing frontend dependencies"
cd frontend
npm install
cd ..

# Ensure backend dependencies all exist
echo "Installing backend dependencies"
cd backend
poetry install
cd ..

# Build frontend
echo "Building frontend"
cd frontend
npm run build
cd ..

# Restart the application
echo "Restarting application"
pm2 restart NeuraViz