---
id: 10
title: fix-auth-token-retrieval
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix authentication token retrieval"
labels: ["authentication", "cookies", "security"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Authentication Token Retrieval

## Prompt Text
User still experiencing "Failed to add todo: 401 Unauthorized" error after authentication fix.

## Response Text
Identified that the client-side code was not retrieving the authentication token using the correct cookie name. The main application stores the token in a cookie named 'auth_token', but the MCP socket context was looking for various names. Updated the getAuthToken function to specifically look for the 'auth_token' cookie that matches the main application's implementation.

## Files Modified
- src/contexts/mcp-socket-context.tsx

## Outcome
Client now retrieves the correct authentication token.

## Evaluation
The 'auth_token' cookie should now be properly retrieved and sent with API requests.