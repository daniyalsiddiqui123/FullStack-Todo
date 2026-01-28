'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './todo-form';
import TodoItem from './todo-item';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Update parent stats if callback is provided
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dispatch custom event to update dashboard stats
      window.dispatchEvent(new CustomEvent('todosUpdated', {
        detail: {
          total: todos.length,
          completed: todos.filter(todo => todo.completed).length,
          active: todos.length - todos.filter(todo => todo.completed).length,
          fromTodoList: true // Indicate this event is from TodoList to prevent infinite loop
        }
      }));
    }
  }, [todos]);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Check if the response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        setError(`Failed to fetch todos: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setTodos(data.data.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        })));
      } else {
        setError(data.error || 'Failed to fetch todos');
      }
    } catch (err) {
      setError('An error occurred while fetching todos');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const handleTodosUpdated = (event: Event) => {
      // Type guard to ensure it's a CustomEvent with detail
      if ('detail' in event) {
        // Prevent the event dispatched by this component from triggering a refresh
        // Only refresh if it's an event from outside this component (like chatbot)
        if (!(event as CustomEvent).detail?.fromTodoList) {
          fetchTodos(); // Refresh todos when the event is fired from chatbot
        }
      } else {
        // If it doesn't have detail, treat it as an external event and refresh
        fetchTodos();
      }
    };

    window.addEventListener('todosUpdated', handleTodosUpdated);

    return () => {
      window.removeEventListener('todosUpdated', handleTodosUpdated);
    };
  }, [fetchTodos]);

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos(todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const handleTodoDeleted = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">Error</h3>
            <div className="mt-2 text-sm text-destructive/80">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Count stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <div className="bg-card shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-foreground">My Tasks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your tasks efficiently
            </p>
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-foreground">
              All: {totalTodos}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              Active: {activeTodos}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              Completed: {completedTodos}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <TodoForm onTodoAdded={handleTodoAdded} />

        {/* Filter buttons */}
        <div className="mt-6 flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'active'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'completed'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Todo list */}
        <div className="mt-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-foreground">No tasks</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filter === 'completed'
                  ? "You haven't completed any tasks yet."
                  : "Get started by creating a new task."}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdated}
                  onDelete={handleTodoDeleted}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}