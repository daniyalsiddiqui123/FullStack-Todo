import prisma from './prisma';
import { Todo } from '@/types/todo.types';

export async function createTodo(userId: string, title: string, description?: string, completed = false): Promise<Todo> {
  const todo = await prisma.todo.create({
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

export async function getUserTodos(userId: string): Promise<Todo[]> {
  const todos = await prisma.todo.findMany({
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

export async function getTodoById(id: string, userId: string): Promise<Todo | null> {
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId, // Ensure the todo belongs to the user
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

export async function updateTodo(id: string, userId: string, data: Partial<Todo>): Promise<Todo | null> {
  // First, check if the todo exists and belongs to the user
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingTodo) {
    return null; // Todo doesn't exist or doesn't belong to user
  }

  const updatedTodo = await prisma.todo.update({
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

export async function deleteTodo(id: string, userId: string): Promise<boolean> {
  // Use deleteMany to ensure the todo belongs to the user
  const result = await prisma.todo.deleteMany({
    where: {
      id,
      userId,
    },
  });

  // Return true if a todo was deleted, false otherwise
  return result.count > 0;
}

export async function toggleTodoCompletion(id: string, userId: string): Promise<Todo | null> {
  // First, check if the todo exists and belongs to the user
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingTodo) {
    return null; // Todo doesn't exist or doesn't belong to user
  }

  const updatedTodo = await prisma.todo.update({
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