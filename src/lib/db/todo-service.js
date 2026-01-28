"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = createTodo;
exports.getUserTodos = getUserTodos;
exports.getTodoById = getTodoById;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
exports.toggleTodoCompletion = toggleTodoCompletion;
const prisma_1 = __importDefault(require("./prisma"));
async function createTodo(userId, title, description, completed = false) {
    const todo = await prisma_1.default.todo.create({
        data: {
            title,
            description,
            completed,
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
        },
    });
    return todo;
}
async function getUserTodos(userId) {
    const todos = await prisma_1.default.todo.findMany({
        where: {
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
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return todos;
}
async function getTodoById(id, userId) {
    const todo = await prisma_1.default.todo.findFirst({
        where: {
            id,
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
        },
    });
    return todo;
}
async function updateTodo(id, userId, data) {
    const existingTodo = await prisma_1.default.todo.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingTodo) {
        return null;
    }
    const updatedTodo = await prisma_1.default.todo.update({
        where: {
            id,
        },
        data: {
            title: data.title,
            description: data.description,
            completed: data.completed,
        },
        select: {
            id: true,
            title: true,
            description: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
        },
    });
    return updatedTodo;
}
async function deleteTodo(id, userId) {
    const result = await prisma_1.default.todo.deleteMany({
        where: {
            id,
            userId,
        },
    });
    return result.count > 0;
}
async function toggleTodoCompletion(id, userId) {
    const existingTodo = await prisma_1.default.todo.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingTodo) {
        return null;
    }
    const updatedTodo = await prisma_1.default.todo.update({
        where: {
            id,
        },
        data: {
            completed: !existingTodo.completed,
        },
        select: {
            id: true,
            title: true,
            description: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
        },
    });
    return updatedTodo;
}
//# sourceMappingURL=todo-service.js.map