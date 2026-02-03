---
title: Todo MCP Server
emoji: ✅
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
short_description: AI-Powered Todo Management via Model Context Protocol
---

# Todo MCP Server

This is an AI-powered todo management server that implements the Model Context Protocol (MCP). It allows AI assistants to interact with your todo list using natural language commands.

## Features

- Natural language processing for todo commands using AI (GPT-4o-mini or equivalent)
- WebSocket-based communication following the MCP specification
- Support for various todo operations (add, list, complete, delete)
- Fallback parsing when AI is unavailable
- JSON-RPC 2.0 compliant messaging

## How to Use

The server accepts natural language commands through the MCP protocol. Examples include:
- "Add buy groceries" - Add a new todo
- "Complete buy groceries" - Mark a todo as completed
- "Delete buy groceries" - Delete a todo
- "List todos" - Show all your todos
- "List completed" - Show completed todos
- "List active" - Show active todos
- "Help" - Show available commands

## Environment Variables

To use the AI-powered features, you need to set one of the following environment variables:
- `OPENROUTER_API_KEY`: API key for OpenRouter
- `OPENAI_API_KEY`: API key for OpenAI
- `OPENROUTER_MODEL`: Model to use (optional, defaults to 'openai/gpt-4o-mini')

## Architecture

The server is built with:
- TypeScript/Node.js
- WebSocket for real-time communication
- OpenAI API for natural language processing
- Prisma ORM for database operations

## Docker Configuration

This Space uses Docker to containerize the application. The server runs on port 7860 inside the container.

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference
