import { createContext, useContext, useEffect, useState } from 'react';

interface MCPServerContextType {
  isConnected: boolean;
  sendCommand: (command: string, userId: string) => Promise<any>;
}

const MCPServerContext = createContext<MCPServerContextType | undefined>(undefined);

export const useMCPSocket = (): MCPServerContextType => {
  const context = useContext(MCPServerContext);
  if (!context) {
    throw new Error('useMCPSocket must be used within an MCPSocketProvider');
  }
  return context;
};

interface MCPSocketProviderProps {
  children: React.ReactNode;
}

export const MCPSocketProvider: React.FC<MCPSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check server availability by making a simple request to the health endpoint
    const checkServer = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL?.replace('ws://', 'http://').replace('wss://', 'https://') || 'http://localhost:7860';
        const response = await fetch(`${serverUrl}/`);

        if (response.ok) {
          setIsConnected(true);
          console.log('Connected to HTTP MCP server');

          // Initialize the server
          try {
            await fetch(`${serverUrl}/api/initialize`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'initialize',
                id: 'init',
                params: {}
              })
            });
          } catch (initError) {
            console.error('Error initializing MCP server:', initError);
          }
        } else {
          setIsConnected(false);
          console.error('Failed to connect to HTTP MCP server');
        }
      } catch (error) {
        console.error('Error checking HTTP MCP server:', error);
        setIsConnected(false);
      }
    };

    checkServer();

    // Poll for server status every 30 seconds
    const interval = setInterval(checkServer, 30000);

    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (command: string, userId: string): Promise<any> => {
    if (!isConnected) {
      throw new Error('Not connected to MCP server');
    }

    try {
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

      // Convert WebSocket-style URL to HTTP
      const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL?.replace('ws://', 'http://').replace('wss://', 'https://') || 'http://localhost:7860';

      // Remove trailing slashes
      const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;

      const response = await fetch(`${baseUrl}/api/chat/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          userId,
          authToken  // Include the auth token
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error sending command to HTTP MCP server:', error);
      throw error;
    }
  };

  const value = {
    isConnected,
    sendCommand
  };

  return (
    <MCPServerContext.Provider value={value}>
      {children}
    </MCPServerContext.Provider>
  );
};