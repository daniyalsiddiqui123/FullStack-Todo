declare class TodoMCPService {
    private aiCommandService;
    processNaturalLanguageCommand(userId: string, command: string, authToken?: string): Promise<any>;
    showHelp(): any;
}
declare class MCPServer {
    private wss;
    private service;
    constructor(port?: number);
    close(): void;
}
export { MCPServer, TodoMCPService };
//# sourceMappingURL=server.d.ts.map