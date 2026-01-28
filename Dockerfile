# Use Node 20 (or any LTS)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Set the MCP server port as an environment variable
ENV MCP_SERVER_PORT=3001
EXPOSE 3001

# Start the server directly (no cross-env needed)
CMD ["node", "dist/server.js"]
