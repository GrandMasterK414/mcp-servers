# FileSystem MCP Server

This directory contains the configuration for the FileSystem MCP server.

## Description

The FileSystem server provides controlled file system access to AI tools. It's built using the `@modelcontextprotocol/server-filesystem` package.

## Configuration

### Local Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the server:
   ```
   npx -y @modelcontextprotocol/server-filesystem "C:\path\to\allowed\directory"
   ```

### Cursor IDE Configuration

In Cursor IDE, add a new MCP server with:

- **Name**: FileSystem Tool
- **Type**: Command (stdio)
- **Command**: `npx -y @modelcontextprotocol/server-filesystem "C:\Users\YourUsername\Documents"`

### Smithery Deployment

Use the provided Dockerfile and smithery.yaml for deployment on Smithery.

## Security Notes

- Always specify which directories are allowed to be accessed
- Consider read-only access for sensitive directories
- Monitor file operations for unexpected behavior