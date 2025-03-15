# Memory MCP Server

This directory contains the configuration for the Memory MCP server.

## Description

The Memory server provides persistent storage for AI sessions. It's built using the `@modelcontextprotocol/server-memory` package.

## Configuration

### Local Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the server:
   ```
   npx -y @modelcontextprotocol/server-memory
   ```

### Cursor IDE Configuration

In Cursor IDE, add a new MCP server with:

- **Name**: Memory Tool
- **Type**: Command (stdio)
- **Command**: `npx -y @modelcontextprotocol/server-memory`

### Smithery Deployment

Use the provided Dockerfile and smithery.yaml for deployment on Smithery.

## Usage Tips

- The memory server stores data in-memory by default
- Use for sharing information between different AI requests
- Consider adding persistence if needed for production use