---
id: 8
title: fix-chatbot-db-connection
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix chatbot not saving tasks to database and update UI colors"
labels: ["database", "api-integration", "ui", "mcp-server"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Chatbot Database Connection and UI Issues

## Prompt Text
User reported that chatbot tasks weren't showing in the My Tasks list and wanted the text color in the prompt box changed to black.

## Response Text
Fixed two main issues:

1. **Database Connection Issue**: The MCP server was using a mock in-memory store instead of connecting to the real database. Updated the server to call the main application's API endpoints instead of trying to connect directly to the database, which resolves the Prisma client initialization issues.

2. **UI Color Issue**: Updated the chatbot input field to use the 'text-black' Tailwind class to make the text black.

The changes ensure that chatbot-created tasks are saved to the same database as manually created tasks, making them visible in the My Tasks list.

## Files Modified
- mcp-server/server.ts
- src/components/todo/todo-chatbot.tsx

## Outcome
Chatbot tasks now appear in the My Tasks list and input text color is black.

## Evaluation
The MCP server now properly integrates with the main application's API.