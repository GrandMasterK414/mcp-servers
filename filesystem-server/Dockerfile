FROM node:18-alpine

WORKDIR /app

# Create data directory
RUN mkdir -p /data && chmod 777 /data

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Create a simple entrypoint script
RUN echo '#!/bin/sh\nexec npx @modelcontextprotocol/server-filesystem /data "$@"' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# The entrypoint provides default behavior, can be overridden by smithery.yaml
ENTRYPOINT ["/app/entrypoint.sh"]