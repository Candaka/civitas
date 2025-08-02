#!/bin/bash

echo "🚀 Setting up Civitas - Decentralized Social Media Platform"
echo "=========================================================="

# Check if DFX is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX CLI not found. Installing DFX..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
    echo "✅ DFX installed successfully!"
else
    echo "✅ DFX CLI already installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js already installed"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
else
    echo "✅ npm already installed"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd src/civitas_frontend
npm install
cd ../..

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the local Internet Computer: dfx start --background"
echo "2. Deploy the backend: dfx deploy civitas_backend"
echo "3. Start the frontend: cd src/civitas_frontend && npm start"
echo ""
echo "🌐 The application will be available at http://localhost:3000" 