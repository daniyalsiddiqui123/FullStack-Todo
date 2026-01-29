FROM node:20
WORKDIR /app

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript

# Copy application files
COPY . .

# Set environment variables
# Use PORT from Hugging Face, default to 3001 if not set
ENV MCP_SERVER_PORT=${PORT:-3001}

# Expose the port
EXPOSE ${PORT:-3001}

# Start the server
CMD ["sh", "-c", "ts-node server.ts"]
