# AI-Powered Todo Chatbot with MCP Server

This project implements an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture.

## Architecture Overview

The system consists of:

1. **MCP Server** - A WebSocket-based server that processes natural language commands
2. **Frontend Chatbot Component** - A React component that provides the chat interface
3. **Database Integration** - Connects to the existing PostgreSQL database via Prisma

## Setup Instructions

### 1. Start the MCP Server

Run the MCP server using the batch script:

```bash
# On Windows
start-mcp-server.bat
```

Or manually from the `mcp-server` directory:

```bash
cd mcp-server
npm install
npm run build
npm run start
```

#### Environment Variables

You can customize the server configuration using environment variables. Copy `.env.example` to `.env` and modify as needed:

- `MCP_SERVER_PORT`: Port for the MCP server to listen on (default: 3001)

### 2. Run the Main Application

In the main project directory:

```bash
npm install
npm run dev
```

## Natural Language Commands

The chatbot supports the following commands:

- `add buy groceries` - Add a new todo
- `complete buy groceries` - Mark a todo as completed
- `delete buy groceries` - Delete a todo
- `list todos` - Show all your todos
- `list completed` - Show completed todos
- `list active` - Show active todos
- `update buy groceries to buy milk` - Update a todo's title
- `help` - Show help message

## Technical Details

### MCP Server
- Runs on port 3001 by default (to match the frontend configuration)
- Uses WebSocket protocol for real-time communication
- Implements the MCP (Model Context Protocol) specification
- Connects to the existing Prisma database
- Processes natural language commands using regex-based parsing
- Supports custom port configuration via MCP_SERVER_PORT environment variable

### Frontend Integration
- Located in `src/components/todo/todo-chatbot.tsx`
- Communicates with the MCP server via WebSocket
- Integrated into the dashboard page
- Updates the todo list automatically after operations

### Database Integration
- Uses the existing Prisma schema and models
- Maintains user isolation for multi-user support
- Reuses existing authentication mechanisms

## Files Added

- `mcp-server/` - MCP server implementation
  - `server.ts` - Main MCP server with database integration
  - `package.json` - Server dependencies
  - `tsconfig.json` - TypeScript configuration
- `src/components/todo/todo-chatbot.tsx` - Frontend chatbot component
- `src/contexts/mcp-socket-context.tsx` - WebSocket context provider
- `start-mcp-server.bat` - Windows startup script

## Future Enhancements

- Integrate with an actual AI/NLP service for better command parsing
- Add more sophisticated natural language understanding
- Implement voice input/output capabilities
- Add advanced features like due dates, priorities, and categories