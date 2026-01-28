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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoMCPService = exports.MCPServer = void 0;
const http_1 = require("http");
const ws_1 = require("ws");
const readline_1 = require("readline");
let prismaInstance = null;
async function getPrismaInstance() {
    if (!prismaInstance) {
        try {
            const { default: prisma } = await Promise.resolve().then(() => __importStar(require('../src/lib/db/prisma')));
            prismaInstance = prisma;
        }
        catch (error) {
            console.error('Failed to import Prisma instance:', error);
            throw error;
        }
    }
    return prismaInstance;
}
class TodoMCPService {
    async processNaturalLanguageCommand(userId, command) {
        const normalizedCommand = command.toLowerCase().trim();
        let title = '';
        let description = '';
        if (normalizedCommand.includes('add') || normalizedCommand.includes('create') || normalizedCommand.includes('new')) {
            const match = command.match(/(?:add|create|new|make)\s+(.+)$/i);
            if (match) {
                title = match[1].trim();
                return this.addTodo(userId, title, description);
            }
        }
        else if (normalizedCommand.includes('complete') || normalizedCommand.includes('finish') || normalizedCommand.includes('done')) {
            const idMatch = command.match(/(?:complete|finish|done)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);
            if (idMatch) {
                const identifier = idMatch[1].trim();
                return this.completeTodo(userId, identifier);
            }
        }
        else if (normalizedCommand.includes('delete') || normalizedCommand.includes('remove')) {
            const idMatch = command.match(/(?:delete|remove)\s+(?:todo\s+)?(\d+|"[^"]+"|[^.!?]+)/i);
            if (idMatch) {
                const identifier = idMatch[1].trim();
                return this.deleteTodo(userId, identifier);
            }
        }
        else if (normalizedCommand.includes('list') || normalizedCommand.includes('show') || normalizedCommand.includes('view')) {
            if (normalizedCommand.includes('completed')) {
                return this.listCompletedTodos(userId);
            }
            else if (normalizedCommand.includes('pending') || normalizedCommand.includes('incomplete') || normalizedCommand.includes('active')) {
                return this.listActiveTodos(userId);
            }
            else {
                return this.listAllTodos(userId);
            }
        }
        else if (normalizedCommand.includes('update') || normalizedCommand.includes('change') || normalizedCommand.includes('modify')) {
            const updateMatch = command.match(/(?:update|change|modify)\s+(?:todo\s+)?(\d+|"[^"]+")\s+to\s+(.+)$/i);
            if (updateMatch) {
                const identifier = updateMatch[1].trim();
                const newTitle = updateMatch[2].trim();
                return this.updateTodo(userId, identifier, newTitle);
            }
        }
        else if (normalizedCommand.includes('help')) {
            return this.showHelp();
        }
        return {
            success: false,
            message: "I couldn't understand your command. Try phrases like 'add buy groceries', 'complete todo 1', 'list todos', or 'delete todo 2'."
        };
    }
    async addTodo(userId, title, description) {
        try {
            const prisma = await getPrismaInstance();
            const newTodo = await prisma.todo.create({
                data: {
                    title,
                    description,
                    completed: false,
                    userId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    completed: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                }
            });
            return {
                success: true,
                message: `Added new todo: "${title}"`,
                todo: newTodo
            };
        }
        catch (error) {
            console.error('Error adding todo:', error);
            return {
                success: false,
                message: `Failed to add todo: ${error.message}`
            };
        }
    }
    async completeTodo(userId, identifier) {
        try {
            const prisma = await getPrismaInstance();
            let todo = await prisma.todo.findFirst({
                where: {
                    userId,
                    OR: [
                        { id: identifier },
                        { title: { contains: identifier, mode: 'insensitive' } }
                    ]
                }
            });
            if (!todo) {
                return {
                    success: false,
                    message: `Could not find todo matching "${identifier}".`
                };
            }
            const updatedTodo = await prisma.todo.update({
                where: { id: todo.id },
                data: { completed: true },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    completed: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                }
            });
            return {
                success: true,
                message: `Marked todo "${updatedTodo.title}" as completed.`,
                todo: updatedTodo
            };
        }
        catch (error) {
            console.error('Error completing todo:', error);
            return {
                success: false,
                message: `Failed to complete todo: ${error.message}`
            };
        }
    }
    async deleteTodo(userId, identifier) {
        try {
            const prisma = await getPrismaInstance();
            let todo = await prisma.todo.findFirst({
                where: {
                    userId,
                    OR: [
                        { id: identifier },
                        { title: { contains: identifier, mode: 'insensitive' } }
                    ]
                }
            });
            if (!todo) {
                return {
                    success: false,
                    message: `Could not find todo matching "${identifier}".`
                };
            }
            await prisma.todo.delete({
                where: { id: todo.id }
            });
            return {
                success: true,
                message: `Deleted todo: "${todo.title}".`,
                todo: { ...todo }
            };
        }
        catch (error) {
            console.error('Error deleting todo:', error);
            return {
                success: false,
                message: `Failed to delete todo: ${error.message}`
            };
        }
    }
    async updateTodo(userId, identifier, newTitle) {
        try {
            const prisma = await getPrismaInstance();
            let todo = await prisma.todo.findFirst({
                where: {
                    userId,
                    OR: [
                        { id: identifier },
                        { title: { contains: identifier, mode: 'insensitive' } }
                    ]
                }
            });
            if (!todo) {
                return {
                    success: false,
                    message: `Could not find todo matching "${identifier}".`
                };
            }
            const updatedTodo = await prisma.todo.update({
                where: { id: todo.id },
                data: { title: newTitle },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    completed: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                }
            });
            return {
                success: true,
                message: `Updated todo to: "${newTitle}".`,
                todo: updatedTodo
            };
        }
        catch (error) {
            console.error('Error updating todo:', error);
            return {
                success: false,
                message: `Failed to update todo: ${error.message}`
            };
        }
    }
    async listAllTodos(userId) {
        try {
            const prisma = await getPrismaInstance();
            const userTodos = await prisma.todo.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            if (userTodos.length === 0) {
                return {
                    success: true,
                    message: "You don't have any todos yet.",
                    todos: []
                };
            }
            return {
                success: true,
                message: `You have ${userTodos.length} todo(s):`,
                todos: userTodos
            };
        }
        catch (error) {
            console.error('Error listing todos:', error);
            return {
                success: false,
                message: `Failed to list todos: ${error.message}`
            };
        }
    }
    async listActiveTodos(userId) {
        try {
            const prisma = await getPrismaInstance();
            const activeTodos = await prisma.todo.findMany({
                where: {
                    userId,
                    completed: false
                },
                orderBy: { createdAt: 'desc' }
            });
            if (activeTodos.length === 0) {
                return {
                    success: true,
                    message: "You don't have any active todos.",
                    todos: []
                };
            }
            return {
                success: true,
                message: `You have ${activeTodos.length} active todo(s):`,
                todos: activeTodos
            };
        }
        catch (error) {
            console.error('Error listing active todos:', error);
            return {
                success: false,
                message: `Failed to list active todos: ${error.message}`
            };
        }
    }
    async listCompletedTodos(userId) {
        try {
            const prisma = await getPrismaInstance();
            const completedTodos = await prisma.todo.findMany({
                where: {
                    userId,
                    completed: true
                },
                orderBy: { createdAt: 'desc' }
            });
            if (completedTodos.length === 0) {
                return {
                    success: true,
                    message: "You don't have any completed todos.",
                    todos: []
                };
            }
            return {
                success: true,
                message: `You have ${completedTodos.length} completed todo(s):`,
                todos: completedTodos
            };
        }
        catch (error) {
            console.error('Error listing completed todos:', error);
            return {
                success: false,
                message: `Failed to list completed todos: ${error.message}`
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
                                            'todo.complete',
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
                        const result = await this.service.processNaturalLanguageCommand(userId, command);
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
                        id: message.id,
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
    const server = new MCPServer(3001);
    readline.question('Press Enter to stop the server...', () => {
        server.close();
        readline.close();
    });
}
//# sourceMappingURL=server-with-db.js.map