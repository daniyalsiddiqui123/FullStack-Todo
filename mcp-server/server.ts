import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// Import OpenAI client for advanced natural language processing
import OpenAI from 'openai';

interface Message {
  jsonrpc: string;
  id?: string | number;
  method: string;
  params?: any;
}

interface Response {
  jsonrpc: string;
  id?: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Service to handle advanced natural language command parsing using OpenAI/OpenRouter
class TodoAICommandService {
  constructor() {
    // Constructor doesn't need to initialize OpenAI client immediately
  }

  // Process natural language command using AI
  async processNaturalLanguageCommand(userId: string, command: string): Promise<any> {
    // Check if we have an API key to use AI
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const hasApiKey = !!apiKey;

    if (!hasApiKey) {
      console.warn('Warning: OPENROUTER_API_KEY or OPENAI_API_KEY not set. Using fallback parsing.');
      // If no API key, use fallback parsing
      return this.fallbackParseCommand(command);
    }

    try {
      // Initialize OpenAI client only when needed and with current environment variables
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey!,
        defaultHeaders: {
          'HTTP-Referer': 'https://daniyalsiddiqui1-todo.hf.space', // Optional, for including your app on openrouter.ai rankings.
          'X-Title': 'Todo Chatbot', // Optional. Shows in rankings on openrouter.ai.
        },
      });

      // Create a structured prompt for the AI to understand the intent
      const prompt = `
You are an AI assistant that helps manage todo items and engages in friendly conversation.
Based on the user's natural language command, determine the appropriate action.

User command: "${command}"

Available actions:
- add_todo: Add a new todo item
- list_todos: List todo items (with filters: all, active, completed)
- update_todo: Update a todo item (mark as complete, change title, etc.)
- delete_todo: Delete a todo item
- help: Show available commands
- greet: Respond to greetings and casual conversation
- answer_question: Answer questions about the todo app

For special cases:
- "complete all tasks", "mark all as complete", etc. should use update_todo with identifier "all" and updates { "completed": true }
- "delete all tasks", "remove all", etc. should use delete_todo with identifier "all"
- "list all completed", "show completed", etc. should use list_todos with filter "completed"
- Greetings like "hello", "hi", "hey", "good morning", etc. should use greet action
- Questions about todos, features, etc. should use answer_question action

For task identification, extract just the task name from phrases like:
- "complete the task to buy eggs" -> identifier should be "buy eggs"
- "delete the task buy milk" -> identifier should be "buy milk"
- "complete task buy groceries" -> identifier should be "buy groceries"

Return a JSON object with the following structure:
{
  "action": "add_todo|list_todos|update_todo|delete_todo|help|greet|answer_question",
  "data": {
    // relevant data based on the action
  },
  "success": true,
  "message": "Human-readable message about what will be done or conversational response"
}

Examples:
- "Add buy groceries" -> { "action": "add_todo", "data": { "title": "buy groceries", "description": "" }, "message": "Adding todo: buy groceries" }
- "Complete todo 1" -> { "action": "update_todo", "data": { "identifier": "1", "updates": { "completed": true } }, "message": "Marking todo 1 as completed" }
- "Complete the task to buy eggs" -> { "action": "update_todo", "data": { "identifier": "buy eggs", "updates": { "completed": true } }, "message": "Marking todo 'buy eggs' as completed" }
- "Complete all tasks" -> { "action": "update_todo", "data": { "identifier": "all", "updates": { "completed": true } }, "message": "Marking all todos as completed" }
- "List all todos" -> { "action": "list_todos", "data": { "filter": "all" }, "message": "Listing all todos" }
- "Hi" -> { "action": "greet", "data": {}, "message": "Hello! How can I help you with your todos today?" }
- "What can you do?" -> { "action": "answer_question", "data": {}, "message": "I can help you manage your todos! You can ask me to add, complete, delete, or list your tasks. Try saying 'add buy groceries' or 'list all todos'." }

Keep the response friendly and conversational when appropriate, and focused on the essential information needed to execute todo commands.
`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful todo management assistant. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for more consistent outputs
        response_format: { type: 'json_object' }, // Ensure JSON response
      });

      // Parse the AI response
      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI model');
      }

      const parsedResponse = JSON.parse(response);

      // Ensure the response has the required structure
      return {
        action: parsedResponse.action,
        data: parsedResponse.data,
        success: parsedResponse.success ?? true,
        message: parsedResponse.message
      };
    } catch (error) {
      console.error('Error processing command with AI:', error);
      // Fallback to simple parsing if AI fails
      return this.fallbackParseCommand(command);
    }
  }

  // Fallback command parser in case AI fails
  private fallbackParseCommand(command: string): any {
    const normalizedCommand = command.toLowerCase().trim();

    // Handle greetings and casual conversation
    if (normalizedCommand.includes('hello') ||
        normalizedCommand.includes('hi') ||
        normalizedCommand.includes('hey') ||
        normalizedCommand.includes('good morning') ||
        normalizedCommand.includes('good afternoon') ||
        normalizedCommand.includes('good evening') ||
        normalizedCommand.includes('greetings')) {
      return {
        action: 'greet',
        data: {},
        success: true,
        message: `Hello! 😊 I'm your AI assistant for managing todos. You can ask me to add, complete, delete, or list your tasks. How can I help you today?`
      };
    }

    // Handle common questions
    if (normalizedCommand.includes('how are you') ||
        normalizedCommand.includes('what can you do') ||
        normalizedCommand.includes('help me') ||
        normalizedCommand.includes('what do you do') ||
        normalizedCommand.includes('what are you')) {
      return {
        action: 'answer_question',
        data: {},
        success: true,
        message: `I'm here to help you manage your todos! You can ask me to add, complete, delete, or list your tasks. For example: "add buy groceries", "complete todo 1", "list all todos", or "delete buy groceries". What would you like to do?`
      };
    }

    if (normalizedCommand.includes('add') || normalizedCommand.includes('create') || normalizedCommand.includes('new')) {
      const match = command.match(/(?:add|create|new|make)\s+(.+)$/i);
      if (match) {
        return {
          action: 'add_todo',
          data: {
            title: match[1].trim(),
            description: '',
          },
          success: true,
          message: `Adding todo: ${match[1].trim()}`
        };
      }
    } else if (normalizedCommand.includes('complete') || normalizedCommand.includes('finish') || normalizedCommand.includes('done')) {
      // Handle various patterns like "complete todo 1", "complete the task to buy eggs", "finish buy groceries", etc.
      let idMatch = command.match(/(?:complete|finish|done)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);

      // Also try to match "complete the task to buy eggs" pattern
      if (!idMatch) {
        idMatch = command.match(/(?:complete|finish|done)\s+the\s+task\s+to\s+([^.!?]+)/i);
      }

      // Also try to match "complete the task buy eggs" pattern
      if (!idMatch) {
        idMatch = command.match(/(?:complete|finish|done)\s+the\s+task\s+([^.!?]+)/i);
      }

      // Also try to match "complete task buy eggs" pattern
      if (!idMatch) {
        idMatch = command.match(/(?:complete|finish|done)\s+task\s+([^.!?]+)/i);
      }

      if (idMatch) {
        return {
          action: 'update_todo',
          data: {
            identifier: idMatch[1].trim(),
            updates: { completed: true }
          },
          success: true,
          message: `Completing todo: ${idMatch[1].trim()}`
        };
      }
    } else if (normalizedCommand.includes('delete') || normalizedCommand.includes('remove')) {
      // Handle various patterns like "delete todo 1", "delete the task buy milk", "remove buy groceries", etc.
      let idMatch = command.match(/(?:delete|remove)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);

      // Also try to match "delete the task buy milk" pattern
      if (!idMatch) {
        idMatch = command.match(/(?:delete|remove)\s+the\s+task\s+([^.!?]+)/i);
      }

      // Also try to match "remove the task buy milk" pattern
      if (!idMatch) {
        idMatch = command.match(/(?:delete|remove)\s+task\s+([^.!?]+)/i);
      }

      if (idMatch) {
        return {
          action: 'delete_todo',
          data: { identifier: idMatch[1].trim() },
          success: true,
          message: `Deleting todo: ${idMatch[1].trim()}`
        };
      }
    } else if (normalizedCommand.includes('list') || normalizedCommand.includes('show') || normalizedCommand.includes('view')) {
      let filter = 'all';
      if (normalizedCommand.includes('completed')) {
        filter = 'completed';
      } else if (normalizedCommand.includes('active') || normalizedCommand.includes('pending') || normalizedCommand.includes('incomplete')) {
        filter = 'active';
      }

      return {
        action: 'list_todos',
        data: { filter },
        success: true,
        message: `Listing ${filter} todos`
      };
    }

    return {
      success: false,
      message: "I'm not sure I understood that. You can say hello, ask for help, or try commands like 'add buy groceries', 'complete todo 1', 'list todos', or 'delete todo 2'."
    };
  }
}

class TodoMCPService {
  private aiCommandService = new TodoAICommandService();

  async processNaturalLanguageCommand(userId: string, command: string, authToken?: string): Promise<any> {
    try {
      // Use AI to process the natural language command
      return await this.aiCommandService.processNaturalLanguageCommand(userId, command);
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: `An error occurred: ${(error as Error).message}`
      };
    }
  }

  // Methods have been removed as the server now returns command objects for the client to execute

  showHelp(): any {
    return {
      success: true,
      message: "Here are the commands you can use:\n" +
        "• 'add buy groceries' - Add a new todo\n" +
        "• 'complete buy groceries' - Mark a todo as completed\n" +
        "• 'delete buy groceries' - Delete a todo\n" +
        "• 'list todos' - Show all your todos\n" +
        "• 'list completed' - Show completed todos\n" +
        "• 'list active' - Show active todos\n" +
        "• 'update buy groceries to buy milk' - Update a todo's title\n" +
        "• 'help' - Show this help message"
    };
  }
}

class MCPServer {
  private wss: WebSocketServer;
  private service: TodoMCPService;

  constructor(port: number = 7860) {
    this.service = new TodoMCPService();

    const httpServer = createServer((req, res) => {
      // Handle HTTP health check requests for Hugging Face Spaces
      if (req.url === '/' || req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          message: 'MCP Server is running',
          timestamp: new Date().toISOString()
        }));
      } else {
        // For other routes, return 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });

    // Configure WebSocket server to handle Hugging Face Spaces proxy
    this.wss = new WebSocketServer({
      server: httpServer,
      // Allow all origins and handle potential proxy headers
      verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
        // Log the origin and headers for debugging
        console.log('WebSocket connection attempt from:', info.origin);
        console.log('Request headers:', info.req.headers);
        console.log('Secure connection:', info.secure);

        // For Hugging Face Spaces, we allow connections and log details for debugging
        // The proxy may modify headers, so we log them to understand the connection flow
        return true;
      }
    });

    // Log when WebSocket server is ready
    this.wss.on('listening', () => {
      console.log(`WebSocket server listening and ready to accept connections on port ${port}`);
    });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      ws.on('message', async (data) => {
        try {
          const message: Message = JSON.parse(data.toString());

          if (message.method === 'initialize') {
            const response: Response = {
              jsonrpc: '2.0',
              id: message.id,
              result: {
                capabilities: {
                  executeCommandProvider: {
                    commands: [
                      'todo.add',
                      'todo.delete',
                      'todo.list',
                      'todo.update'
                    ]
                  }
                },
                serverInfo: {
                  name: 'Todo Chatbot MCP Server',
                  version: '1.0.0'
                }
              }
            };

            ws.send(JSON.stringify(response));
          } else if (message.method === 'textDocument/didOpen' || message.method === 'chat/process') {
            // Process natural language command
            const params = message.params;
            const userId = params?.userId || 'default-user';
            const command = params?.command;
            const authToken = params?.authToken; // Get the auth token

            if (!command) {
              const errorResponse: Response = {
                jsonrpc: '2.0',
                id: message.id,
                error: {
                  code: -32602,
                  message: 'Missing command parameter'
                }
              };

              ws.send(JSON.stringify(errorResponse));
              return;
            }

            // Pass the auth token to the service method
            const result = await this.service.processNaturalLanguageCommand(userId, command, authToken);

            const response: Response = {
              jsonrpc: '2.0',
              id: message.id,
              result: result
            };

            ws.send(JSON.stringify(response));
          } else {
            const response: Response = {
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: -32601,
                message: 'Method not found'
              }
            };

            ws.send(JSON.stringify(response));
          }
        } catch (error) {
          console.error('Error processing message:', error);

          // In case of parse error, we may not have a valid message object
          const response: Response = {
            jsonrpc: '2.0',
            id: undefined, // Can't get ID from malformed message
            error: {
              code: -32700,
              message: 'Parse error'
            }
          };

          ws.send(JSON.stringify(response));
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`MCP Server listening on port ${port}`);
    });
  }

  close(): void {
    this.wss.close();
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  // Use port from environment variable or default to 3001
  const port = parseInt(process.env.PORT || process.env.MCP_SERVER_PORT || '7860');
  const server = new MCPServer(port);

  // Export for use in modules if needed
  module.exports = { MCPServer, server };
}

export { MCPServer, TodoMCPService };