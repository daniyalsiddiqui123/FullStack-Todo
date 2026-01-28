@echo off
REM Script to start the MCP server for the todo chatbot

echo Starting Todo MCP Server on port 3001...

REM Navigate to the mcp-server directory
cd /d "%~dp0mcp-server"

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the TypeScript code
echo Building TypeScript code...
npm run build

REM Start the server with custom port
echo Starting the server on port 3001...
npm run start:port

pause