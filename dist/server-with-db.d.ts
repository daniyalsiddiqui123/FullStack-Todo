declare class TodoMCPService {
    processNaturalLanguageCommand(userId: string, command: string): Promise<any>;
    addTodo(userId: string, title: string, description?: string): Promise<any>;
    completeTodo(userId: string, identifier: string): Promise<any>;
    deleteTodo(userId: string, identifier: string): Promise<any>;
    updateTodo(userId: string, identifier: string, newTitle: string): Promise<any>;
    listAllTodos(userId: string): Promise<any>;
    listActiveTodos(userId: string): Promise<any>;
    listCompletedTodos(userId: string): Promise<any>;
    showHelp(): any;
}
declare class MCPServer {
    private wss;
    private service;
    constructor(port?: number);
    close(): void;
}
export { MCPServer, TodoMCPService };
//# sourceMappingURL=server-with-db.d.ts.map