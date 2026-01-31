# Hugging Face Spaces Deployment Guide for Todo MCP Server

## Issue: Chatbot Showing as Offline

If your deployed chatbot is showing as offline, follow these steps to fix the WebSocket connection:

## 1. Redeploy the MCP Server with Dockerfile

The most common issue is that the Hugging Face Space doesn't have the proper Docker configuration. You need to:

1. Make sure your Hugging Face Space is using the **Docker** SDK (not Gradio or Streamlit)
2. Copy all files from the `mcp-server/` directory to your Hugging Face Space repository
3. Ensure the `Dockerfile` is in the root of your Hugging Face Space repository

## 2. Proper Hugging Face Space Setup

When creating or updating your Hugging Face Space:

1. Go to your Hugging Face account and create a new Space or edit existing
2. Choose **Docker** as the SDK
3. Choose appropriate hardware (CPU is sufficient)
4. Set visibility as needed

## 3. Repository Structure for Hugging Face Space

Your Hugging Face Space repository should contain:

```
.
├── Dockerfile
├── server.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── requirements.txt
├── README.md
└── .env.example
```

## 4. Environment Variables

In your Hugging Face Space settings, add these environment variables:

- `OPENROUTER_API_KEY` - (Optional) Your OpenRouter API key
- `OPENAI_API_KEY` - (Optional) Your OpenAI API key
- `OPENROUTER_MODEL` - (Optional) Model to use (defaults to 'openai/gpt-4o-mini')

## 5. Frontend Configuration

Make sure your frontend application has the correct WebSocket URL configured:

```bash
NEXT_PUBLIC_MCP_SERVER_URL=wss://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

## 6. Troubleshooting Steps

1. **Check Hugging Face Space Logs**: Look at the Space logs to see if the server started properly
2. **Verify Port**: Ensure the server listens on the correct port (7860)
3. **WebSocket Path**: Some setups might need a specific path like `/ws` - adjust if needed
4. **CORS Issues**: The server should allow connections from any origin for Hugging Face compatibility

## 7. Testing the Connection

After deploying:

1. Wait for the Hugging Face Space to fully build and start
2. Check the Space logs for successful startup messages
3. Verify the WebSocket endpoint is accessible
4. Test the frontend connection

## 8. Common Issues

- **Server Not Starting**: Check that the Dockerfile builds correctly and the start command is valid
- **Port Mismatch**: Ensure the server listens on the port that Hugging Face expects
- **WebSocket Not Connecting**: Verify the URL format and proxy configuration
- **Build Failures**: Make sure all dependencies in package.json are available

## 9. Verification

Once deployed, you should see these messages in your Hugging Face Space logs:
- "MCP Server listening on port [PORT]"
- "WebSocket server listening and ready to accept connections"
- "WebSocket connection attempt from: [origin]"

If you still have issues, check the browser's developer console for WebSocket connection errors.