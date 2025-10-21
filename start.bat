@echo off
echo Starting KYNW Financial Forms Application...
echo.
echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)
echo.
echo Starting development server...
echo The application will open in your browser automatically.
echo.
echo To stop the server, press Ctrl+C
echo.
npm run dev
pause