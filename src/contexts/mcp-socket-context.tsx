import { createContext, useContext, useEffect, useState } from 'react';

interface MCPSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendCommand: (command: string, userId: string) => Promise<any>;
}

const MCPSocketContext = createContext<MCPSocketContextType | undefined>(undefined);

export const useMCPSocket = (): MCPSocketContextType => {
  const context = useContext(MCPSocketContext);
  if (!context) {
    throw new Error('useMCPSocket must be used within an MCPSocketProvider');
  }
  return context;
};

interface MCPSocketProviderProps {
  children: React.ReactNode;
}

export const MCPSocketProvider: React.FC<MCPSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use environment variable for server URL, fallback to localhost for development
    const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'ws://localhost:7860';

    // Log the server URL being used for debugging
    console.log('Attempting to connect to MCP server:', serverUrl);

    // Create WebSocket connection with retry logic
    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
      console.log('Connected to MCP server');
      setIsConnected(true);

      // Send initialize message
      const initMessage = {
        jsonrpc: '2.0',
        method: 'initialize',
        id: 'init',
        params: {}
      };
      ws.send(JSON.stringify(initMessage));
    };

    ws.onclose = (event) => {
      console.log('Disconnected from MCP server:', event.reason);
      setIsConnected(false);

      // Attempt to reconnect after a delay (but not in this implementation to avoid infinite loops)
      // In a production app, you might want to implement a reconnection strategy
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('Failed to connect to MCP server at:', serverUrl);
      console.error('Please ensure the MCP server is running and accessible');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendCommand = (command: string, userId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to MCP server'));
        return;
      }

      // Get the auth token from localStorage (since auth_token cookie is httpOnly)
      const getAuthToken = () => {
        if (typeof window !== 'undefined') {
          // Try to get token from localStorage where it might have been stored during login
          const token = localStorage.getItem('auth-token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
          return token;
        }

        return null;
      };

      const authToken = getAuthToken();

      const messageId = Date.now().toString();
      const message = {
        jsonrpc: '2.0',
        method: 'chat/process',
        id: messageId,
        params: {
          command,
          userId,
          authToken  // Include the auth token
        }
      };

      // Set up listener for the response
      const handleMessage = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.id === messageId) {
          socket.removeEventListener('message', handleMessage);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        }
      };

      socket.addEventListener('message', handleMessage);
      socket.send(JSON.stringify(message));

      // Set timeout to reject if no response received
      setTimeout(() => {
        socket.removeEventListener('message', handleMessage);
        reject(new Error('Timeout waiting for response'));
      }, 10000);
    });
  };

  const value = {
    socket,
    isConnected,
    sendCommand
  };

  return (
    <MCPSocketContext.Provider value={value}>
      {children}
    </MCPSocketContext.Provider>
  );
};