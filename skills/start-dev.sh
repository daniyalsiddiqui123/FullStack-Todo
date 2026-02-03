#!/bin/bash
# Skill: Start Development Servers
# Description: Start both frontend and MCP servers for development

echo "🚀 Starting development servers..."

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port 3000 is in use. Frontend might already be running."
else
    echo "🌐 Starting Next.js development server on port 3000..."
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend server started with PID: $FRONTEND_PID"
fi

# Check if MCP server port is available
if lsof -Pi :7860 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port 7860 is in use. MCP server might already be running."
else
    echo "🤖 Starting MCP server on port 7860..."
    MCP_SERVER_PORT=7860 npx tsx server.ts > mcp-server.log 2>&1 &
    MCP_PID=$!
    echo "MCP server started with PID: $MCP_PID"
fi

echo "✅ Development servers started!"
echo "Frontend: http://localhost:3000"
echo "MCP Server: http://localhost:7860"
echo ""
echo "Server logs are available in:"
echo "- frontend.log"
echo "- mcp-server.log"