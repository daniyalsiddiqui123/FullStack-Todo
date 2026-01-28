FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV MCP_SERVER_PORT=3001
EXPOSE 3001

CMD ["node", "dist/server.js"]
