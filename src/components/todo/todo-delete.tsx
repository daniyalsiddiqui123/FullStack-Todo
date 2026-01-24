'use client';

import { useState } from 'react';

interface TodoDeleteProps {
  todoId: string;
  onDelete: (id: string) => void;
}

export default function TodoDelete({ todoId, onDelete }: TodoDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/todos/${todoId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          onDelete(todoId);
        } else {
          alert(data.error || 'Failed to delete todo');
        }
      } catch (err) {
        console.error('Error deleting todo:', err);
        alert('An error occurred while deleting the todo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
}