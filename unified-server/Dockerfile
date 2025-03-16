FROM node:18-alpine

WORKDIR /app

# Create necessary directories
RUN mkdir -p /data /app/temp && chmod 777 /data /app/temp

# Install system dependencies
RUN apk add --no-cache python3 bash

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Create entrypoint script
RUN echo '#!/bin/sh\nexec node server.js "$@"' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Entrypoint provides default behavior
ENTRYPOINT ["/app/entrypoint.sh"]