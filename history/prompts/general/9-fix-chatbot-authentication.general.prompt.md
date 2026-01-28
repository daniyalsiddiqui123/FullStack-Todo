---
id: 9
title: fix-chatbot-authentication
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix chatbot authentication issue"
labels: ["authentication", "api", "security"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Chatbot Authentication Issue

## Prompt Text
User reported that the chatbot was showing "Failed to add todo: 401 Unauthorized" even when they were authorized.

## Response Text
Fixed the authentication issue by updating both the client-side and server-side code:

1. **Client-Side (MCP Socket Context)**: Modified the sendCommand function to extract and send the authentication token from browser storage (localStorage/cookies) along with each request.

2. **Server-Side (MCP Server)**:
   - Updated the WebSocket message handler to receive and pass the authentication token
   - Modified all API service methods to accept and use the authentication token
   - Updated all TodoMCPService methods to forward the token to the API service

The changes ensure that authentication tokens are properly transmitted from the chatbot through the MCP server to the main application's API endpoints.

## Files Modified
- src/contexts/mcp-socket-context.tsx
- mcp-server/server.ts

## Outcome
Chatbot can now make authenticated API calls and successfully create todos.

## Evaluation
The "401 Unauthorized" error should be resolved.