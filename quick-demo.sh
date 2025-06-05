#!/bin/bash

# 🏥 Clinic Management PWA - Quick Demo Script
# This script provides instant access to the working Progressive Web App

echo "🏥 Clinic Management PWA - Quick Demo Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Recommended: 18+"
    echo "   The app will still work, but you may see some warnings."
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if this is a fresh clone or existing installation
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take a minute)..."
    npm install --legacy-peer-deps --silent
    if [ $? -ne 0 ]; then
        echo "❌ Dependency installation failed. Trying alternative approach..."
        npm install --legacy-peer-deps
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔧 Building production version..."
npm run build --silent

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🚀 Starting PWA demo server..."
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  🎉 CLINIC MANAGEMENT PWA IS NOW RUNNING!                  │"
echo "│                                                             │"
echo "│  📱 Demo URL: http://localhost:4173                        │"
echo "│                                                             │"
echo "│  ✨ PWA Features Available:                                │"
echo "│    • Install as native app (browser will prompt)          │"
echo "│    • Offline functionality (disconnect internet to test)  │"
echo "│    • Mobile-optimized touch interface                     │"
echo "│    • Biometric authentication (on supported devices)      │"
echo "│    • Push notifications (when enabled)                    │"
echo "│                                                             │"
echo "│  🏥 Healthcare Features:                                   │"
echo "│    • Patient management system                             │"
echo "│    • Appointment scheduling                                │"
echo "│    • Billing and invoicing                                 │"
echo "│    • Medical service catalog                               │"
echo "│                                                             │"
echo "│  📱 Mobile Testing:                                        │"
echo "│    • Open in mobile browser                                │"
echo "│    • Look for 'Add to Home Screen' prompt                 │"
echo "│    • Install and test as native app                       │"
echo "│                                                             │"
echo "│  🛑 To stop: Press Ctrl+C                                 │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

# Start the preview server
npm run preview

echo ""
echo "Demo session ended. Thank you for testing the Clinic Management PWA!"
echo ""
echo "📚 For more information:"
echo "   • Repository: https://github.com/cshlok/Hmsminiapp"
echo "   • Documentation: See README.md and LIVE_DEMO_ACCESS.md"
echo "   • Issues: https://github.com/cshlok/Hmsminiapp/issues"
