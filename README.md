# Model Context Protocol (MCP) Servers

This repository contains a collection of Model Context Protocol (MCP) servers configured for integration with Cursor IDE.

## What are MCP Servers?

MCP (Model Context Protocol) servers allow AI coding assistants in Cursor IDE to interact with external tools and services. They extend the capabilities of the AI by providing access to additional context, data, and functionality.

## Available Servers

This repository includes the following MCP servers:

### FileSystem Server

Provides access to the local file system, allowing AI assistants to read, write, and manage files and directories.

### Memory Server

Enables persistent memory storage across coding sessions, allowing the AI to remember context and preferences.

### Brave Search Server

Integrates with Brave Search API to enable web search capabilities for the AI assistant.

### Fetch Server

Allows the AI assistant to fetch data from external APIs and websites.

### Task Manager Server

Provides task management with contextual code awareness and progress tracking, helping developers maintain focus and context across coding sessions.

## Local Development

To develop and run these servers locally:

1. Clone this repository
2. Navigate to the specific server directory
3. Install dependencies: `npm install`
4. Start the server: `npm start`

Each server directory contains its own README with specific setup instructions.

## Deployment on Smithery

These servers can be easily deployed using Smithery. See [SMITHERY_SETUP.md](SMITHERY_SETUP.md) for detailed instructions.

## Integration with Cursor IDE

To use these servers with Cursor IDE:

1. Open Cursor IDE
2. Go to Settings > Extensions > MCP
3. Add the server configuration (examples provided in each server's README)
4. Save and restart Cursor

See [DIRECT_SETUP.md](DIRECT_SETUP.md) for quick setup instructions.

## Troubleshooting

If you encounter issues:

1. Check the server logs
2. Verify your server is running and accessible
3. Ensure your Cursor configuration is correct
4. Restart Cursor IDE

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
