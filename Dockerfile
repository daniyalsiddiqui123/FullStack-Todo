FROM node:20
WORKDIR /app

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

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
# Use PORT from Hugging Face, default to 3001 if not set
ENV PORT=${PORT:-3001}
ENV MCP_SERVER_PORT=${PORT:-3001}

# Expose the port
EXPOSE $PORT

# Start the server
CMD ["sh", "-c", "ts-node server.ts"]
