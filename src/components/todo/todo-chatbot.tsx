'use client';

import { useState, useRef, useEffect } from 'react';
import { useMCPSocket } from '@/contexts/mcp-socket-context';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  result?: any;
}

const TodoChatbot = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendCommand, isConnected } = useMCPSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const commandResponse = await sendCommand(inputValue, userId);

      // Handle the command returned by the MCP server
      if (commandResponse.action) {
        // Execute the appropriate API call based on the command
        let apiResponse;
        switch (commandResponse.action) {
          case 'add_todo':
            apiResponse = await fetch('/api/todos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Include credentials to use authentication cookies
              },
              credentials: 'include',
              body: JSON.stringify(commandResponse.data)
            });
            break;

          case 'list_todos':
            apiResponse = await fetch('/api/todos', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            });
            break;

          case 'update_todo':
            // For updates, we need to find the todo first, then update it
            // This is a simplified approach - in a full implementation, we'd have a specific update endpoint
            const todosResponse = await fetch('/api/todos', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            });
            const todosResult = await todosResponse.json();
            if (todosResult.success) {
              const todos = todosResult.data;
              const identifier = commandResponse.data.identifier;

              // Handle special identifiers like "all", "all tasks", etc.
              if (identifier && (identifier.toLowerCase().includes('all') || identifier.toLowerCase().includes('all tasks'))) {
                // Update all todos - iterate through all todos and update them
                for (const todo of todos) {
                  await fetch(`/api/todos/${todo.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(commandResponse.data.updates)
                  });
                }
                // Return a successful response for the last update
                apiResponse = { ok: true, json: async () => ({ success: true, message: `Updated all todos` }) };
              } else {
                // Find specific todo with more flexible matching
                // Remove common prefixes like "the task" to improve matching
                let searchIdentifier = identifier.toLowerCase();

                // Remove common phrases that might not be in the actual todo title
                searchIdentifier = searchIdentifier
                  .replace(/^the task\s*/, '')  // Remove "the task" prefix
                  .replace(/^task\s*/, '')     // Remove "task" prefix
                  .replace(/\s*task$/, '')     // Remove "task" suffix
                  .replace(/^todo\s*/, '')     // Remove "todo" prefix
                  .replace(/\s*todo$/, '')     // Remove "todo" suffix
                  .replace(/^the\s*/, '')      // Remove "the" prefix
                  .replace(/\bto\s+/g, '')     // Remove "to" for phrases like "complete the task to buy eggs"
                  .trim();

                // First try exact ID match
                let matchingTodo = todos.find((todo: any) => todo.id === identifier);

                // If no exact ID match, try title matching with various strategies
                if (!matchingTodo) {
                  // Try direct inclusion match (original approach)
                  matchingTodo = todos.find((todo: any) =>
                    todo.title.toLowerCase().includes(searchIdentifier) ||
                    searchIdentifier.includes(todo.title.toLowerCase())
                  );
                }

                // If still no match, try more sophisticated matching
                if (!matchingTodo) {
                  // Split the search identifier and todo titles into words for better matching
                  const searchWords = searchIdentifier.split(/\s+/).filter(word => word.length > 0);

                  // Look for todos where most words match (fuzzy matching)
                  matchingTodo = todos.find((todo: any) => {
                    const todoLower = todo.title.toLowerCase();
                    const todoWords = todoLower.split(/\s+/).filter(word => word.length > 0);

                    // Count how many words from searchIdentifier appear in the todo title
                    const matchedWords = searchWords.filter(word =>
                      todoLower.includes(word) || todoWords.some(todoWord =>
                        todoWord.startsWith(word) || word.startsWith(todoWord)
                      )
                    );

                    // Match if at least half of the search words are found in the todo title
                    return matchedWords.length >= Math.ceil(searchWords.length / 2);
                  });
                }

                // If still no match, try with even more relaxed matching
                if (!matchingTodo) {
                  // Try removing articles and common words from both sides
                  const cleanSearch = searchIdentifier.replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '').replace(/\s+/g, ' ').trim();

                  matchingTodo = todos.find((todo: any) => {
                    const cleanTodo = todo.title.toLowerCase().replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '').replace(/\s+/g, ' ').trim();
                    return cleanTodo.includes(cleanSearch) || cleanSearch.includes(cleanTodo);
                  });
                }

                if (matchingTodo) {
                  // Update the specific todo
                  apiResponse = await fetch(`/api/todos/${matchingTodo.id}`, {
                    method: 'PUT', // or PATCH if the API supports it
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(commandResponse.data.updates)
                  });
                } else {
                  // Try again with original identifier in case our preprocessing was too aggressive
                  const fallbackMatchingTodo = todos.find((todo: any) =>
                    todo.id === identifier || todo.title.toLowerCase().includes(identifier.toLowerCase())
                  );

                  if (fallbackMatchingTodo) {
                    apiResponse = await fetch(`/api/todos/${fallbackMatchingTodo.id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify(commandResponse.data.updates)
                    });
                  } else {
                    throw new Error(`Could not find todo matching "${identifier}".`);
                  }
                }
              }
            } else {
              throw new Error('Failed to get todos to update');
            }
            break;

          case 'delete_todo':
            // For deletion, we need to find the todo first, then delete it
            const deleteTodosResponse = await fetch('/api/todos', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            });
            const deleteTodosResult = await deleteTodosResponse.json();
            if (deleteTodosResult.success) {
              const todos = deleteTodosResult.data;
              const identifier = commandResponse.data.identifier;

              // Handle special identifiers like "all", "all tasks", etc.
              if (identifier && (identifier.toLowerCase().includes('all') || identifier.toLowerCase().includes('all tasks'))) {
                // Delete all todos - iterate through all todos and delete them
                for (const todo of todos) {
                  await fetch(`/api/todos/${todo.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                  });
                }
                // Return a successful response for the operation
                apiResponse = { ok: true, json: async () => ({ success: true, message: `Deleted all todos` }) };
              } else {
                // Find specific todo with more flexible matching
                // Remove common prefixes like "the task" to improve matching
                let searchIdentifier = identifier.toLowerCase();

                // Remove common phrases that might not be in the actual todo title
                searchIdentifier = searchIdentifier
                  .replace(/^the task\s*/, '')  // Remove "the task" prefix
                  .replace(/^task\s*/, '')     // Remove "task" prefix
                  .replace(/\s*task$/, '')     // Remove "task" suffix
                  .replace(/^todo\s*/, '')     // Remove "todo" prefix
                  .replace(/\s*todo$/, '')     // Remove "todo" suffix
                  .replace(/^the\s*/, '')      // Remove "the" prefix
                  .replace(/\bto\s+/g, '')     // Remove "to" for phrases like "complete the task to buy eggs"
                  .trim();

                // First try exact ID match
                let matchingTodo = todos.find((todo: any) => todo.id === identifier);

                // If no exact ID match, try title matching with various strategies
                if (!matchingTodo) {
                  // Try direct inclusion match (original approach)
                  matchingTodo = todos.find((todo: any) =>
                    todo.title.toLowerCase().includes(searchIdentifier) ||
                    searchIdentifier.includes(todo.title.toLowerCase())
                  );
                }

                // If still no match, try more sophisticated matching
                if (!matchingTodo) {
                  // Split the search identifier and todo titles into words for better matching
                  const searchWords = searchIdentifier.split(/\s+/).filter(word => word.length > 0);

                  // Look for todos where most words match (fuzzy matching)
                  matchingTodo = todos.find((todo: any) => {
                    const todoLower = todo.title.toLowerCase();
                    const todoWords = todoLower.split(/\s+/).filter(word => word.length > 0);

                    // Count how many words from searchIdentifier appear in the todo title
                    const matchedWords = searchWords.filter(word =>
                      todoLower.includes(word) || todoWords.some(todoWord =>
                        todoWord.startsWith(word) || word.startsWith(todoWord)
                      )
                    );

                    // Match if at least half of the search words are found in the todo title
                    return matchedWords.length >= Math.ceil(searchWords.length / 2);
                  });
                }

                // If still no match, try with even more relaxed matching
                if (!matchingTodo) {
                  // Try removing articles and common words from both sides
                  const cleanSearch = searchIdentifier.replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '').replace(/\s+/g, ' ').trim();

                  matchingTodo = todos.find((todo: any) => {
                    const cleanTodo = todo.title.toLowerCase().replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '').replace(/\s+/g, ' ').trim();
                    return cleanTodo.includes(cleanSearch) || cleanSearch.includes(cleanTodo);
                  });
                }

                if (matchingTodo) {
                  // Delete the specific todo
                  apiResponse = await fetch(`/api/todos/${matchingTodo.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                  });
                } else {
                  // Try again with original identifier in case our preprocessing was too aggressive
                  const fallbackMatchingTodo = todos.find((todo: any) =>
                    todo.id === identifier || todo.title.toLowerCase().includes(identifier.toLowerCase())
                  );

                  if (fallbackMatchingTodo) {
                    apiResponse = await fetch(`/api/todos/${fallbackMatchingTodo.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include'
                    });
                  } else {
                    throw new Error(`Could not find todo matching "${identifier}".`);
                  }
                }
              }
            } else {
              throw new Error('Failed to get todos to delete');
            }
            break;

          case 'help':
            // Help command doesn't need API call, just return the message
            apiResponse = { ok: true, json: async () => ({ success: true, message: commandResponse.message }) };
            break;

          case 'greet':
          case 'answer_question':
            // Greeting and question commands don't need API calls, just return the message
            apiResponse = { ok: true, json: async () => ({ success: true, message: commandResponse.message }) };
            break;

          default:
            throw new Error(`Unknown command action: ${commandResponse.action}`);
        }

        // Process the API response
        if (apiResponse.ok) {
          const result = await apiResponse.json();

          // Create a bot message with the result
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: result.message || `Successfully executed command: ${commandResponse.action}`,
            sender: 'bot',
            timestamp: new Date(),
            result: result
          };

          setMessages(prev => [...prev, botMessage]);

          // Refresh the todo list after successful operations
          if (result.success) {
            window.dispatchEvent(new CustomEvent('todosUpdated', { detail: result }));
          }
        } else {
          // Handle API error
          const errorText = await apiResponse.text();
          throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
        }
      } else {
        // Fallback for legacy responses
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: commandResponse?.message || 'I processed your request.',
          sender: 'bot',
          timestamp: new Date(),
          result: commandResponse
        };

        setMessages(prev => [...prev, botMessage]);

        // Refresh the todo list after successful operations
        if (commandResponse?.success) {
          window.dispatchEvent(new CustomEvent('todosUpdated', { detail: commandResponse }));
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${(error as Error).message}`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`p-4 ${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Todo Assistant</h2>
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <p className="text-green-200 text-sm">Chat with me to manage your todos!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ height: '400px' }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-center">Start chatting to manage your todos!</p>
            <div className="mt-4 text-left max-w-md">
              <p className="font-medium mb-2">Try these commands:</p>
              <ul className="text-sm space-y-1">
                <li>• "Add buy groceries"</li>
                <li>• "Complete todo 1"</li>
                <li>• "List all todos"</li>
                <li>• "Delete buy groceries"</li>
                <li>• "Show completed todos"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a command to manage your todos..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim() || !isConnected}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Examples: "Add buy milk", "Complete todo 1", "List all todos"
        </div>
      </div>
    </div>
  );
};

export default TodoChatbot;