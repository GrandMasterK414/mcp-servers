# MCP Filesystem Server

A simple filesystem server for the Model Context Protocol (MCP) used by Cursor IDE.

## Features

- Provides file system access via MCP protocol
- Configurable directory access
- Runs in Docker container
- Easily deployable to Smithery

## Usage

### Local Development

1. Clone the repository
2. Navigate to the filesystem-server directory
3. Run `npm install`
4. Start the server with `npm start`

### Docker

Build and run the Docker container:

```bash
# Build the image
docker build -t mcp-filesystem-server .

# Run the container with your local directories mounted
docker run -v /path/to/local/dir:/data mcp-filesystem-server
```

### Smithery Deployment

This server is configured for easy deployment on Smithery. The default configuration gives access to the following directories:

- `/data` (default container directory)
- `./projects`
- `./documents`
- `./code`
- `./assets`
- `./configs`
- `./notebooks`
- `./datasets`
- `./models`
- `./src`
- `./examples`

You can customize the directories in your Smithery configuration.

## Configuration

Modify the list of directories in `smithery.yaml` to change which directories are accessible by default.

For Windows users, use proper Windows paths:

```yaml
default: [
  "C:/Users/YourUsername/Documents",
  "C:/Users/YourUsername/Projects",
  "C:/Dev",
  "C:/Data"
]
```

## License

MIT