#!/bin/bash

# Get latest changes
git checkout main
git pull

# Cleanup old build files
rm -rf ./src/frontend/public/build
rm -rf ./src/frontend/dist

# Ensure frontend dependencies all exist
cd frontend
npm install
cd ..

cd backend
poetry install
cd ..

# Build frontend
cd frontend
npm run build
cd ..

# Restart the application
pm2 restart MSE_Capstone