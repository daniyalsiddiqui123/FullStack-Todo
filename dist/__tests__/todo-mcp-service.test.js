"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../mcp-server/server");
describe('TodoMCPService', () => {
    let service;
    const mockUserId = 'test-user-id';
    beforeEach(() => {
        service = new server_1.TodoMCPService();
    });
    test('should add a new todo', async () => {
        const command = 'add Buy groceries';
        const result = await service.processNaturalLanguageCommand(mockUserId, command);
        expect(result.success).toBe(true);
        expect(result.message).toContain('Added new todo');
        expect(result.todo).toBeDefined();
        expect(result.todo.title).toBe('Buy groceries');
    });
    test('should list all todos', async () => {
        await service.processNaturalLanguageCommand(mockUserId, 'add Buy groceries');
        const result = await service.processNaturalLanguageCommand(mockUserId, 'list todos');
        expect(result.success).toBe(true);
        expect(result.message).toContain('todo(s)');
        expect(Array.isArray(result.todos)).toBe(true);
    });
    test('should complete a todo', async () => {
        const addResult = await service.processNaturalLanguageCommand(mockUserId, 'add Buy groceries');
        const todoId = addResult.todo.id;
        const result = await service.processNaturalLanguageCommand(mockUserId, `complete ${todoId}`);
        expect(result.success).toBe(true);
        expect(result.message).toContain('as completed');
        expect(result.todo.completed).toBe(true);
    });
    test('should delete a todo', async () => {
        const addResult = await service.processNaturalLanguageCommand(mockUserId, 'add Buy groceries');
        const todoId = addResult.todo.id;
        const result = await service.processNaturalLanguageCommand(mockUserId, `delete ${todoId}`);
        expect(result.success).toBe(true);
        expect(result.message).toContain('Deleted todo');
    });
    test('should show help message', async () => {
        const result = await service.processNaturalLanguageCommand(mockUserId, 'help');
        expect(result.success).toBe(true);
        expect(result.message).toContain('commands you can use');
    });
});
//# sourceMappingURL=todo-mcp-service.test.js.map