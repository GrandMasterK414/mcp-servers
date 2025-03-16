# Unified MCP Server

A modular Model Context Protocol (MCP) server that provides multiple tools for Cursor IDE.

## Features

- **Modular Architecture**: Load multiple tools in a single server instance
- **Configurable**: Enable/disable tools and customize their behavior
- **Docker Support**: Easy deployment via Docker
- **Smithery Integration**: Designed for seamless deployment on Smithery

## Included Tools

The server includes the following tools out of the box:

### 1. Filesystem Tool

Access files and directories on the server.

- Configure which directories to expose
- Browse, read, and write files
- Inherited from the existing filesystem-server

### 2. Web Search Tool

Search the web directly from Cursor.

- Configurable API key and search provider
- Proxy support for enhanced privacy
- Return structured search results

### 3. Code Runner Tool

Execute code snippets in various languages.

- Support for JavaScript, Python, and Bash
- Configurable execution timeouts
- Sandboxed execution environment

### 4. Personal Assistant Tool

Custom personal productivity tools.

- Save and retrieve notes
- Run custom commands
- Extend with your own functionality

## Usage

### Local Development

1. Clone the repository
2. Navigate to the unified-server directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Docker

Build and run using Docker:

```bash
# Build the image
docker build -t unified-mcp-server .

# Run with default configuration
docker run -p 3000:3000 unified-mcp-server

# Run with custom environment variables
docker run -p 3000:3000 \
  -e ENABLED_TOOLS=filesystem,websearch \
  -e FS_DIRECTORIES=/data,/home/user/documents \
  -v /path/to/local/dir:/data \
  unified-mcp-server
```

### Smithery Deployment

The server is pre-configured for Smithery deployment. You can customize the enabled tools and their configuration in the Smithery web interface.

## Configuration

The server can be configured through environment variables or the Smithery configuration:

- `PORT`: Port to run the server on (default: 3000)
- `ENABLED_TOOLS`: Comma-separated list of tools to enable (default: all)
- `FS_DIRECTORIES`: Comma-separated list of directories for the filesystem tool
- `SEARCH_API_KEY`: API key for the web search tool
- `USE_PROXY`: Whether to use a proxy for web searches (true/false)
- `CODE_TIMEOUT`: Timeout for code execution in milliseconds
- `ALLOWED_LANGUAGES`: Comma-separated list of languages allowed for code execution
- `CUSTOM_COMMANDS`: JSON string of custom commands for the personal assistant

## Extending

To add your own tools:

1. Create a new directory under `tools/`
2. Implement the tool with a `register` function
3. Add the tool to the enabled tools list

## License

MIT