# Uploading Your MCP Server to Hugging Face Spaces

Your AI-powered Todo MCP (Model Context Protocol) Server is ready to be deployed to Hugging Face Spaces. Follow these steps to upload and deploy your application:

## Overview

Your application is a WebSocket-based MCP server written in TypeScript/Node.js that enables AI assistants to interact with a todo list using natural language commands. It supports both AI-powered and fallback command parsing.

## Required Files for Upload

The following files are essential for your Hugging Face Spaces deployment:

- `server.ts` - Main MCP server implementation
- `package.json` - Node.js dependencies
- `package-lock.json` - Locked dependency versions
- `Dockerfile` - Containerization instructions (updated for Hugging Face)
- `requirements.txt` - Python dependencies for MCP protocol
- `README.md` - Updated with Hugging Face Spaces configuration
- `.env.example` - Example environment variables
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Properly configured for deployment

## Step-by-Step Instructions

### 1. Create a Hugging Face Account
- Go to https://huggingface.co/
- Sign up or log in to your account

### 2. Create a New Space
- Click on your profile icon and select "New Space"
- Fill in the space details:
  - Name: Choose a unique name for your space (e.g., "your-username/todo-mcp-server")
  - License: Select an appropriate license
  - SDK: Docker (already configured in your project)
  - Hardware: Choose CPU for this application
  - Visibility: Public or Private as per your preference

### 3. Prepare Your Local Repository
Make sure all files are committed to your local git repository:

```bash
git add .
git commit -m "Prepare for Hugging Face Spaces deployment"
```

### 4. Connect Your Local Repository to Hugging Face
After creating the space, Hugging Face will provide you with git commands. They will look something like this:

```bash
git remote add hf https://huggingface.co/spaces/[YOUR_USERNAME]/[SPACE_NAME]
git push hf main
```

### 5. Configure Environment Variables (After Deployment)
Once deployed, you can configure the following environment variables in your Space settings:
- `OPENROUTER_API_KEY` - API key for OpenRouter (optional, for AI features)
- `OPENAI_API_KEY` - API key for OpenAI (optional, for AI features)
- `OPENROUTER_MODEL` - Model to use (optional, defaults to 'openai/gpt-4o-mini')

These are optional - the server will use fallback parsing if no API keys are provided.

### 6. Monitor the Deployment
- Visit your Space URL to monitor the build logs
- Wait for the build to complete (it may take a few minutes)
- Once deployed, your MCP server will be accessible via WebSocket

## Using Your Deployed MCP Server

Once deployed, your MCP server will accept WebSocket connections and process natural language commands via the Model Context Protocol. Clients can connect and send commands like:
- "Add buy groceries"
- "Complete buy groceries"
- "List all todos"
- "Delete buy groceries"

## Troubleshooting

If you encounter issues:
1. Check the build logs in your Space dashboard
2. Verify that your Dockerfile is properly configured
3. Ensure all dependencies in package.json and requirements.txt are correct
4. Make sure your server listens on the port specified by the PORT environment variable (7860 in your case)

## Customization

Feel free to customize the appearance and behavior of your Space by modifying:
- The README.md for documentation
- The emoji and color scheme in the README frontmatter
- The server.ts file for additional functionality

Your MCP server is now ready for deployment to Hugging Face Spaces!