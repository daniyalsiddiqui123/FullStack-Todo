import { Todo } from '@/types/todo.types';
export declare function createTodo(userId: string, title: string, description?: string, completed?: boolean): Promise<Todo>;
export declare function getUserTodos(userId: string): Promise<Todo[]>;
export declare function getTodoById(id: string, userId: string): Promise<Todo | null>;
export declare function updateTodo(id: string, userId: string, data: Partial<Todo>): Promise<Todo | null>;
export declare function deleteTodo(id: string, userId: string): Promise<boolean>;
export declare function toggleTodoCompletion(id: string, userId: string): Promise<Todo | null>;
//# sourceMappingURL=todo-service.d.ts.map