# MCP Servers

A collection of Model Context Protocol (MCP) servers configured for optimal integration with Cursor IDE.

## What are MCP Servers?

Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI applications (like Cursor IDE) to extend their capabilities by connecting to external tools, data, and automation workflows. MCP lets a language model securely access resources through a client-server architecture.

## Servers in this Repository

This repository contains configurations for the following MCP servers:

1. **FileSystem Server** - Provides file system access capabilities
2. **Memory Server** - Provides memory/storage for AI sessions
3. **Brave Search Server** - Enables web search capabilities
4. **Fetch Server** - Allows retrieving web content

## How to Use

### Local Development

Each server directory contains:
- `Dockerfile` - For building a containerized version of the server
- `smithery.yaml` - Configuration for Smithery deployment
- `package.json` or `requirements.txt` - Dependencies

To run a server locally, navigate to its directory and follow the instructions in its README.

### Deployment on Smithery

These servers are configured for easy deployment on [Smithery](https://smithery.ai), a registry for MCP servers. 

1. Fork this repository
2. Configure your Smithery account
3. Connect your repository to Smithery
4. Deploy the servers

### Integration with Cursor IDE

To use these servers with Cursor IDE:

1. Open Cursor IDE
2. Go to Settings → Features → MCP Servers
3. Add each server with the appropriate configuration

See each server's directory for specific configuration details.

## Server Status and Troubleshooting

If servers don't show a green status dot in Cursor IDE:

1. Check if the server is running correctly
2. Verify environment variables are set properly
3. Check for port conflicts
4. Restart Cursor IDE

## License

MIT