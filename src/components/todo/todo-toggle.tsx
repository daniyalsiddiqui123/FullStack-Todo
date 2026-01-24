'use client';

import { useState } from 'react';

interface TodoToggleProps {
  todoId: string;
  completed: boolean;
  onToggle: (updatedTodo: any) => void;
}

export default function TodoToggle({ todoId, completed, onToggle }: TodoToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/todos/${todoId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        onToggle(data.data);
      } else {
        console.error('Failed to toggle todo:', data.error);
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        completed ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          completed ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}