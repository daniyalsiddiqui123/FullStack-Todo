# Development Server Start Skill

Start both the frontend and MCP server simultaneously for development.

## Command Definition

```bash
sp.dev-start
```

## Behavior

This skill will:
1. Start the Next.js development server on port 3000
2. Start the MCP server on port 7860
3. Display both server URLs for easy access

## Implementation

```bash
#!/bin/bash
echo "Starting development servers..."

# Start MCP server in background
echo "Starting MCP server on port 7860..."
MCP_SERVER_PORT=7860 npx tsx server.ts > mcp-server.log 2>&1 &

# Start Next.js development server
echo "Starting Next.js development server on port 3000..."
npm run dev

echo "Development servers started!"
echo "Frontend: http://localhost:3000"
echo "MCP Server: http://localhost:7860"
```

## Usage

Run this command when you want to start both servers for development. The MCP server will run in the background while the Next.js server runs in the foreground.