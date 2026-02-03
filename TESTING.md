# Test the MCP Server Locally

To test your MCP server locally before deploying to Hugging Face Spaces:

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Run the server: `npm run dev` or `ts-node server.ts`
4. The server will start on port 7860 (or as configured in MCP_SERVER_PORT)

The server implements the Model Context Protocol (MCP) and accepts WebSocket connections with JSON-RPC 2.0 messages.