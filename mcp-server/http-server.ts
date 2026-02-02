import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { TodoMCPService } from './services';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

interface MCPServerConfig {
  port?: number;
}

class HTTPMCPServer {
  private app: express.Application;
  private server: any;
  private service: TodoMCPService;

  constructor(config: MCPServerConfig = {}) {
    const port = config.port || parseInt(process.env.PORT || process.env.MCP_SERVER_PORT || '7860');

    this.app = express();
    this.service = new TodoMCPService();

    // Middleware
    this.app.use(cors({
      origin: [
        'https://full-stack-todo.vercel.app',  // Deployed frontend
        'http://localhost:3000',              // Local development
        'http://localhost:3001',              // Alternative local dev
        'https://daniyalsiddiqui1-todo.hf.space', // Hugging Face Space itself
        'https://DaniyalSiddiqui1-Todo.hf.space'  // Alternative Hugging Face Space URL
      ],
      credentials: true
    }));
    this.app.use(express.json());

    // Routes
    this.setupRoutes();

    // Start server
    this.server = createServer(this.app);
    this.server.listen(port, '0.0.0.0', () => {
      console.log(`HTTP MCP Server listening on port ${port}`);
      console.log(`Server is accessible at: http://localhost:${port}`);
    });
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/', (req, res) => {
      res.json({
        status: 'ok',
        message: 'HTTP MCP Server is running',
        timestamp: new Date().toISOString(),
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
          name: 'Todo Chatbot HTTP MCP Server',
          version: '1.0.0'
        }
      });
    });

    // Process natural language commands
    this.app.post('/api/chat/process', async (req, res) => {
      try {
        const { command, userId, authToken } = req.body;

        if (!command) {
          res.status(400).json({
            error: {
              code: -32602,
              message: 'Missing command parameter'
            }
          });
          return; // Explicitly return to satisfy TypeScript
        }

        // Process the command using the existing service
        const result = await this.service.processNaturalLanguageCommand(
          userId || 'default-user',
          command,
          authToken
        );

        res.json({
          jsonrpc: '2.0',
          result: result
        });
      } catch (error) {
        console.error('Error processing command:', error);
        res.status(500).json({
          error: {
            code: -32603,
            message: 'Internal error processing command'
          }
        });
      }
    });

    // Initialize endpoint (equivalent to WebSocket initialize)
    this.app.post('/api/initialize', (req, res) => {
      res.json({
        jsonrpc: '2.0',
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
            name: 'Todo Chatbot HTTP MCP Server',
            version: '1.0.0'
          }
        }
      });
    });

    // Help endpoint
    this.app.get('/api/help', (req, res) => {
      const helpResult = this.service.showHelp();
      res.json({
        jsonrpc: '2.0',
        result: helpResult
      });
    });
  }

  close(): void {
    this.server.close();
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || process.env.MCP_SERVER_PORT || '7860');
  const server = new HTTPMCPServer({ port });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close();
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.close();
  });
}

export { HTTPMCPServer };