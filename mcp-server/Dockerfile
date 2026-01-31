FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port (using the same port as specified in the server)
EXPOSE 7860

# Start the application
CMD ["npm", "run", "start:port"]