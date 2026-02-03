@echo off
REM Skill: Start Development Servers
REM Description: Start both frontend and MCP servers for development

echo 🚀 Starting development servers...

REM Check if ports are in use and kill them if needed
echo Killing any processes on ports 3000 and 7860...
npx kill-port 3000 7860

REM Start MCP server in background
echo 🤖 Starting MCP server on port 7860...
set MCP_SERVER_PORT=7860
start /min cmd /c "npx tsx server.ts ^> mcp-server.log 2^>^&1"

REM Start Next.js development server
echo 🌐 Starting Next.js development server on port 3000...
start /min cmd /c "npm run dev ^> frontend.log 2^>^&1"

echo ✅ Development servers started!
echo Frontend: http://localhost:3000
echo MCP Server: http://localhost:7860
echo.
echo Server logs are available in:
echo - frontend.log
echo - mcp-server.log
echo.
echo Press any key to continue...
pause >nul