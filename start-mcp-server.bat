@echo off
echo Starting MCP Server...

REM Navigate to mcp-server directory
cd /d "%~dp0mcp-server"

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the server
echo Building MCP Server...
npm run build

REM Start the server
echo Starting MCP Server on port 7860...
npm run start