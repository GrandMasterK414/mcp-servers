# Brave Search MCP Server

This directory contains the configuration for the Brave Search MCP server.

## Description

The Brave Search server provides web search capabilities for AI tools. It's built using the `@modelcontextprotocol/server-brave-search` package.

## Configuration

### Prerequisites

- Obtain a Brave Search API key from [https://brave.com/search/api/](https://brave.com/search/api/)

### Local Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set your API key:
   ```
   $env:BRAVE_API_KEY="your-api-key-here"  # PowerShell
   # OR
   set BRAVE_API_KEY=your-api-key-here  # CMD
   ```

3. Run the server:
   ```
   npx -y @modelcontextprotocol/server-brave-search
   ```

### Cursor IDE Configuration

In Cursor IDE, add a new MCP server with:

- **Name**: Brave Search
- **Type**: Command (stdio)
- **Command**: `npx -y @modelcontextprotocol/server-brave-search`

You'll need to set the BRAVE_API_KEY environment variable before starting Cursor IDE.

### Smithery Deployment

Use the provided Dockerfile and smithery.yaml for deployment on Smithery. You'll need to provide your Brave API key in the Smithery configuration.

## Security Notes

- Store your API key securely and never commit it to source control
- Consider rate limiting for shared deployments
- Monitor usage to stay within API limits