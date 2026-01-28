FROM node:20

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm install

# Install ts-node globally so we can run TS files directly
RUN npm install -g ts-node typescript

# Copy all code
COPY . .

# Set MCP server port
ENV MCP_SERVER_PORT=3001
EXPOSE 3001

# Run your TypeScript server
CMD ["ts-node", "server.ts"]
