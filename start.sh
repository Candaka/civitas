#!/bin/bash

echo "🚀 Starting Civitas..."
echo "======================"

# Check if DFX is running
if ! dfx ping &> /dev/null; then
    echo "🔄 Starting local Internet Computer..."
    dfx start --background
    sleep 5
fi

# Deploy backend
echo "📦 Deploying backend canister..."
dfx deploy civitas_backend

# Start frontend
echo "🌐 Starting frontend..."
cd src/civitas_frontend
npm start 