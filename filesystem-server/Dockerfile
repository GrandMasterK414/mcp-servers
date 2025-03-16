FROM node:18-alpine

WORKDIR /app

# Create data directory
RUN mkdir -p /data && chmod 777 /data

# Install the MCP filesystem server globally
RUN npm install -g @modelcontextprotocol/server-filesystem

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# The entrypoint provides default behavior, can be overridden by smithery.yaml
ENTRYPOINT ["/app/entrypoint.sh"]