# Direct MCP Server Setup (No Smithery Required)

If you're having issues with Smithery or prefer a direct setup, here's how to configure your MCP servers without it.

## Prerequisites

1. Node.js (v18 or later)
2. Python 3.10+ (for Fetch server)
3. MCP servers installed:
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   npm install -g @modelcontextprotocol/server-memory
   npm install -g @modelcontextprotocol/server-brave-search
   pip install mcp-server-fetch
   ```

## Cursor Configuration

The fastest way to set up your MCP servers is to directly edit Cursor's configuration file:

1. Copy the `cursor-config.json` file from this repository
2. Open your Cursor MCP configuration file:
   ```
   %USERPROFILE%\.cursor\mcp.json
   ```
   (Typically `C:\Users\YourUsername\.cursor\mcp.json`)
3. Replace or merge the content with `cursor-config.json`
4. Save and restart Cursor

## Manual Setup

If you prefer to set up each server manually through Cursor IDE:

1. Open Cursor IDE
2. Go to Settings → Features → MCP Servers
3. Add each server with these configurations:

### FileSystem Server
- **Name**: FileSystem Tool
- **Type**: Command (stdio)
- **Command**: `cmd`
- **Args**: 
  - `/c`
  - `npx`
  - `-y`
  - `@modelcontextprotocol/server-filesystem`
  - `C:\Users\YourUsername\Documents`

### Memory Server
- **Name**: Memory Tool
- **Type**: Command (stdio)
- **Command**: `cmd`
- **Args**: 
  - `/c`
  - `npx`
  - `-y`
  - `@modelcontextprotocol/server-memory`

### Brave Search Server
- **Name**: Brave Search
- **Type**: Command (stdio)
- **Command**: `cmd`
- **Args**: 
  - `/c`
  - `npx`
  - `-y`
  - `@modelcontextprotocol/server-brave-search`

Remember to set `BRAVE_API_KEY` environment variable before starting Cursor.

### Web Fetch Server
- **Name**: Web Fetch
- **Type**: Command (stdio)
- **Command**: `cmd`
- **Args**: 
  - `/c`
  - `python`
  - `-m`
  - `mcp_server_fetch`

## Troubleshooting

- **Error: Cannot find module**: Make sure all packages are installed globally
- **Command not found**: Use full paths or make sure the tools are in your PATH
- **Green dot not appearing**: Try using `cmd /c` prefix as shown above
- **Permission issues**: Run Cursor as administrator