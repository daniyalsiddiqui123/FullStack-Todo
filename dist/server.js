"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoMCPService = exports.MCPServer = void 0;
const http_1 = require("http");
const ws_1 = require("ws");
const readline_1 = require("readline");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const openai_1 = __importDefault(require("openai"));
class TodoAICommandService {
    constructor() {
    }
    async processNaturalLanguageCommand(userId, command) {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        const hasApiKey = !!apiKey;
        if (!hasApiKey) {
            console.warn('Warning: OPENROUTER_API_KEY or OPENAI_API_KEY not set. Using fallback parsing.');
            return this.fallbackParseCommand(command);
        }
        try {
            const openai = new openai_1.default({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: apiKey,
                defaultHeaders: {
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Todo Chatbot',
                },
            });
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
                temperature: 0.1,
                response_format: { type: 'json_object' },
            });
            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from AI model');
            }
            const parsedResponse = JSON.parse(response);
            return {
                action: parsedResponse.action,
                data: parsedResponse.data,
                success: parsedResponse.success ?? true,
                message: parsedResponse.message
            };
        }
        catch (error) {
            console.error('Error processing command with AI:', error);
            return this.fallbackParseCommand(command);
        }
    }
    fallbackParseCommand(command) {
        const normalizedCommand = command.toLowerCase().trim();
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
        }
        else if (normalizedCommand.includes('complete') || normalizedCommand.includes('finish') || normalizedCommand.includes('done')) {
            const idMatch = command.match(/(?:complete|finish|done)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);
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
        }
        else if (normalizedCommand.includes('delete') || normalizedCommand.includes('remove')) {
            const idMatch = command.match(/(?:delete|remove)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);
            if (idMatch) {
                return {
                    action: 'delete_todo',
                    data: { identifier: idMatch[1].trim() },
                    success: true,
                    message: `Deleting todo: ${idMatch[1].trim()}`
                };
            }
        }
        else if (normalizedCommand.includes('list') || normalizedCommand.includes('show') || normalizedCommand.includes('view')) {
            let filter = 'all';
            if (normalizedCommand.includes('completed')) {
                filter = 'completed';
            }
            else if (normalizedCommand.includes('active') || normalizedCommand.includes('pending') || normalizedCommand.includes('incomplete')) {
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
    constructor() {
        this.aiCommandService = new TodoAICommandService();
    }
    async processNaturalLanguageCommand(userId, command, authToken) {
        try {
            return await this.aiCommandService.processNaturalLanguageCommand(userId, command);
        }
        catch (error) {
            console.error('Error processing command:', error);
            return {
                success: false,
                message: `An error occurred: ${error.message}`
            };
        }
    }
    showHelp() {
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
exports.TodoMCPService = TodoMCPService;
class MCPServer {
    constructor(port = 3001) {
        this.service = new TodoMCPService();
        const server = (0, http_1.createServer)();
        this.wss = new ws_1.WebSocketServer({ server });
        this.wss.on('connection', (ws) => {
            console.log('Client connected');
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    if (message.method === 'initialize') {
                        const response = {
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
                    }
                    else if (message.method === 'textDocument/didOpen' || message.method === 'chat/process') {
                        const params = message.params;
                        const userId = params?.userId || 'default-user';
                        const command = params?.command;
                        const authToken = params?.authToken;
                        if (!command) {
                            const errorResponse = {
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
                        const result = await this.service.processNaturalLanguageCommand(userId, command, authToken);
                        const response = {
                            jsonrpc: '2.0',
                            id: message.id,
                            result: result
                        };
                        ws.send(JSON.stringify(response));
                    }
                    else {
                        const response = {
                            jsonrpc: '2.0',
                            id: message.id,
                            error: {
                                code: -32601,
                                message: 'Method not found'
                            }
                        };
                        ws.send(JSON.stringify(response));
                    }
                }
                catch (error) {
                    console.error('Error processing message:', error);
                    const response = {
                        jsonrpc: '2.0',
                        id: undefined,
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
        server.listen(port, () => {
            console.log(`MCP Server listening on port ${port}`);
        });
    }
    close() {
        this.wss.close();
    }
}
exports.MCPServer = MCPServer;
if (require.main === module) {
    const readline = (0, readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout
    });
    const port = parseInt(process.env.MCP_SERVER_PORT || '8080');
    const server = new MCPServer(port);
    readline.question('Press Enter to stop the server...', () => {
        server.close();
        readline.close();
    });
}
//# sourceMappingURL=server.js.map