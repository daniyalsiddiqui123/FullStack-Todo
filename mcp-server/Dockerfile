FROM node:20-alpine
WORKDIR /app

# Install Python and pip
RUN apk add --no-cache python3 py3-pip py3-virtualenv

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install Python dependencies in the virtual environment
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript

# Copy application files
COPY . .

# Set environment variables
# Use PORT from Hugging Face, default to 7860 if not set
ENV PORT=${PORT:-7860}
ENV MCP_SERVER_PORT=${PORT:-7860}

# Expose the port
EXPOSE $PORT

# Start the HTTP server
CMD ["sh", "-c", "ts-node http-server.ts"]