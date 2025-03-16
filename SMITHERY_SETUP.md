# Easy Smithery Integration Guide

This guide walks you through setting up your MCP servers on Smithery quickly and easily.

## What is Smithery?

[Smithery](https://smithery.ai) is a registry service for MCP servers that allows you to deploy, manage, and share your MCP servers with others.

## Prerequisites

1. A [Smithery](https://smithery.ai) account
2. This GitHub repository connected to your Smithery account

## Step-by-Step Setup

### 1. Connect Your GitHub Repository to Smithery

1. Log in to [Smithery](https://smithery.ai)
2. Navigate to "Servers" in the dashboard
3. Click "Add Server" or "New Server"
4. Select "GitHub" as the source
5. Choose this repository (`mcp-servers`)
6. Select the server you want to deploy (filesystem-server, memory-server, etc.)
7. Click "Connect" or "Import"

### 2. Configure Server Settings

For each server, you'll need to:

1. Provide a server name (e.g., "My FileSystem Server")
2. Set the base directory (e.g., `filesystem-server` for the FileSystem server)
3. Configure any required parameters:
   - For FileSystem server: Set `directories` array
   - For Brave Search server: Set `braveApiKey`
   - For Memory server: Optionally enable `debug` mode
   - For Fetch server: Optionally set `maxLength` and `debug`

### 3. Deploy Your Server

1. Review your configuration
2. Click "Deploy" or "Create Server"
3. Wait for the deployment to complete (usually 1-2 minutes)

### 4. Integrate with Cursor IDE

Once deployed, you can integrate with Cursor IDE:

1. In Smithery, navigate to your deployed server
2. Look for the "Cursor" integration button/section
3. Copy the configuration snippet
4. Open Cursor IDE, go to Settings → Features → MCP Servers
5. Add a new server using the copied configuration

## Server-Specific Instructions

### FileSystem Server

```json
{
  "name": "Smithery FileSystem",
  "command": "smithery",
  "args": [
    "run",
    "your-username/mcp-servers",
    "--config",
    "{\"directories\":[\"/path/to/directory\"]}"
  ]
}
```

### Memory Server

```json
{
  "name": "Smithery Memory",
  "command": "smithery",
  "args": [
    "run",
    "your-username/mcp-servers",
    "--config",
    "{\"debug\":false}"
  ]
}
```

### Brave Search Server

```json
{
  "name": "Smithery Brave Search",
  "command": "smithery",
  "args": [
    "run",
    "your-username/mcp-servers",
    "--config",
    "{\"braveApiKey\":\"your-api-key-here\"}"
  ]
}
```

### Fetch Server

```json
{
  "name": "Smithery Fetch",
  "command": "smithery",
  "args": [
    "run",
    "your-username/mcp-servers",
    "--config",
    "{\"maxLength\":100000,\"debug\":false}"
  ]
}
```

## Troubleshooting

- **Server not starting**: Check the server logs in Smithery dashboard
- **Configuration errors**: Verify that your JSON configuration is valid
- **Connection issues**: Ensure Cursor can reach Smithery (no firewall blocks)
- **Green dot not appearing**: Restart Cursor IDE and check environment variables

## Next Steps

- Set up automated deployments from GitHub (via GitHub Actions)
- Create multiple configurations for different use cases
- Share your servers with others via Smithery's public sharing feature