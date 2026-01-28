---
id: 1
title: fix-mcp-connection
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix mcp server connection issue in todo chatbot"
labels: ["bug-fix", "mcp-server", "websocket", "configuration"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix MCP Server Connection Issue

## Prompt Text
The user reported that the todo chatbot was showing "Sorry, I encountered an error: Not connected to MCP server".

## Response Text
Identified and fixed the MCP server connection issue by ensuring both the client and server use the same port (3001). Updated the following:

- Updated the websocket connection in `src/contexts/mcp-socket-context.tsx` to connect to port 3001
- Configured the MCP server to run on port 3001 by updating `mcp-server/.env`
- Added cross-env dependency and updated npm scripts in `mcp-server/package.json`
- Updated `start-mcp-server.bat` to use the correct port configuration
- Successfully started the MCP server on port 3001

## Files Modified
- src/contexts/mcp-socket-context.tsx
- mcp-server/.env
- mcp-server/.env.example
- mcp-server/package.json
- start-mcp-server.bat
- MCP_SERVER_README.md

## Outcome
The todo chatbot now successfully connects to the MCP server and can process natural language commands.

## Evaluation
The connection issue has been resolved and the chatbot should now function properly.