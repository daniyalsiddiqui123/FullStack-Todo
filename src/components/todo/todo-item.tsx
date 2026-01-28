'use client';

import { useState } from 'react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [completed, setCompleted] = useState(todo.completed);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTodo = { ...todo, completed: !completed, updatedAt: new Date() };
        setCompleted(!completed);
        onUpdate(updatedTodo);
      } else {
        setError(data.error || 'Failed to update todo');
      }
    } catch (err) {
      setError('An error occurred while updating the todo');
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, completed }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedTodo = { ...todo, title, description, completed, updatedAt: new Date() };
        onUpdate(updatedTodo);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update todo');
      }
    } catch (err) {
      setError('An error occurred while updating the todo');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/todos/${todo.id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          onDelete(todo.id);
        } else {
          setError(data.error || 'Failed to delete task');
        }
      } catch (err) {
        setError('An error occurred while deleting the task');
        console.error(err);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3">
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
          )}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring text-base text-foreground bg-background"
              placeholder="Task title..."
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring text-foreground bg-background"
              rows={2}
              placeholder="Add description..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`completed-${todo.id}`}
                checked={completed}
                onChange={() => setCompleted(!completed)}
                className="h-5 w-5 text-primary focus:ring-ring border-input rounded"
              />
              <label htmlFor={`completed-${todo.id}`} className="ml-2 block text-sm text-foreground">
                {completed ? 'Mark as pending' : 'Mark as completed'}
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setTitle(todo.title);
                  setDescription(todo.description || '');
                  setCompleted(todo.completed);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${completed ? 'border-green-500/30' : 'border-border'}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5 mt-0.5">
          <input
            id={`completed-${todo.id}`}
            type="checkbox"
            checked={completed}
            onChange={handleToggle}
            className="h-5 w-5 text-primary focus:ring-ring border-input rounded bg-background"
          />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-base font-medium ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {todo.title}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          {todo.description && (
            <p className={`mt-1 text-sm ${completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>Created: {formatDate(todo.createdAt)}</span>
            {new Date(todo.updatedAt).getTime() !== new Date(todo.createdAt).getTime() && (
              <>
                <span className="mx-2">•</span>
                <span>Updated: {formatDate(todo.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}