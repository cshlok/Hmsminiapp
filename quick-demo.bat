@echo off
REM 🏥 Clinic Management PWA - Quick Demo Script for Windows
REM This script provides instant access to the working Progressive Web App

echo 🏥 Clinic Management PWA - Quick Demo Setup
echo ==============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies (this may take a minute^)...
    npm install --legacy-peer-deps --silent
    if %errorlevel% neq 0 (
        echo ❌ Dependency installation failed. Trying alternative approach...
        npm install --legacy-peer-deps
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔧 Building production version...
npm run build --silent

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ Build completed successfully
echo.
echo 🚀 Starting PWA demo server...
echo.
echo ┌─────────────────────────────────────────────────────────────┐
echo │  🎉 CLINIC MANAGEMENT PWA IS NOW RUNNING!                  │
echo │                                                             │
echo │  📱 Demo URL: http://localhost:4173                        │
echo │                                                             │
echo │  ✨ PWA Features Available:                                │
echo │    • Install as native app (browser will prompt^)          │
echo │    • Offline functionality (disconnect internet to test^)  │
echo │    • Mobile-optimized touch interface                     │
echo │    • Biometric authentication (on supported devices^)      │
echo │    • Push notifications (when enabled^)                    │
echo │                                                             │
echo │  🏥 Healthcare Features:                                   │
echo │    • Patient management system                             │
echo │    • Appointment scheduling                                │
echo │    • Billing and invoicing                                 │
echo │    • Medical service catalog                               │
echo │                                                             │
echo │  📱 Mobile Testing:                                        │
echo │    • Open in mobile browser                                │
echo │    • Look for 'Add to Home Screen' prompt                 │
echo │    • Install and test as native app                       │
echo │                                                             │
echo │  🛑 To stop: Press Ctrl+C                                 │
echo └─────────────────────────────────────────────────────────────┘
echo.

REM Start the preview server
npm run preview

echo.
echo Demo session ended. Thank you for testing the Clinic Management PWA!
echo.
echo 📚 For more information:
echo    • Repository: https://github.com/cshlok/Hmsminiapp
echo    • Documentation: See README.md and LIVE_DEMO_ACCESS.md
echo    • Issues: https://github.com/cshlok/Hmsminiapp/issues
pause
