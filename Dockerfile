FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript
COPY . .
ENV MCP_SERVER_PORT=3001
EXPOSE 3001
CMD ["ts-node", "server.ts"]
