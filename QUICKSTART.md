# Quick Start Guide: Smithery CLI Integration

This guide shows you the fastest way to set up your MCP servers using the Smithery CLI.

## Prerequisites

1. Install the Smithery CLI:
   ```
   npm install -g @smithery/cli
   ```

2. Have the GitHub repository cloned (optional):
   ```
   git clone https://github.com/GrandMasterK414/mcp-servers.git
   ```

## One-Command Setup

### FileSystem Server

```bash
# Direct from GitHub
smithery run GrandMasterK414/mcp-servers/filesystem-server --config '{"directories":["C:/Users/YourUsername/Documents"]}'

# OR in Cursor mcp.json
{
  "name": "FileSystem Tool",
  "command": "smithery",
  "args": [
    "run",
    "GrandMasterK414/mcp-servers/filesystem-server",
    "--config",
    "{\"directories\":[\"C:/Users/YourUsername/Documents\"]}"
  ]
}
```

### Memory Server

```bash
# Direct from GitHub
smithery run GrandMasterK414/mcp-servers/memory-server --config '{"debug":false}'

# OR in Cursor mcp.json
{
  "name": "Memory Tool",
  "command": "smithery",
  "args": [
    "run",
    "GrandMasterK414/mcp-servers/memory-server",
    "--config",
    "{\"debug\":false}"
  ]
}
```

### Brave Search Server

```bash
# Direct from GitHub
smithery run GrandMasterK414/mcp-servers/brave-search-server --config '{"braveApiKey":"your-api-key-here"}'

# OR in Cursor mcp.json
{
  "name": "Brave Search",
  "command": "smithery",
  "args": [
    "run",
    "GrandMasterK414/mcp-servers/brave-search-server",
    "--config",
    "{\"braveApiKey\":\"your-api-key-here\"}"
  ]
}
```

## Setting Up in Cursor

1. Open Cursor IDE
2. Go to Settings → Features → MCP Servers
3. Click "Add New MCP Server"
4. Use the JSON configurations provided above
5. Save and restart Cursor

## Verification

To verify your Smithery CLI installation and connection:

```bash
smithery --version
```

To test running a server without Cursor:

```bash
smithery run GrandMasterK414/mcp-servers/memory-server --config '{"debug":true}'
```

You should see output indicating the server has started successfully.

## Update Your mcp.json

For the fastest setup, directly edit your Cursor MCP configuration file with the provided JSON blocks:

```
C:\Users\YourUsername\.cursor\mcp.json
```

## Troubleshooting

- If the Smithery CLI can't connect, check your internet connection
- If you see "Package not found" errors, the repository path might be incorrect
- Run with `--debug` flag for more verbose output: `smithery run ... --debug`