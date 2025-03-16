# Task Manager MCP Server

A powerful task management server that integrates with the Model Context Protocol (MCP) to provide contextual task management capabilities within Cursor IDE.

## Features

- **Deep Code Context Awareness**: Tracks tasks with full context of the associated codebase
- **Automated Progress Tracking**: Monitors task completion status and progress
- **Version Control Integration**: Associates tasks with specific commits and branches
- **Persistent Context**: Maintains context across coding sessions
- **Task Dependencies**: Supports task relationships and dependencies
- **Priority Management**: Intelligent task prioritization based on code context
- **Team Collaboration**: Supports multi-user environments with task assignment

## Architecture

The Task Manager MCP Server is built with a modular architecture:

- **Data Model**: MongoDB-based data model for tasks, contexts, and relationships
- **RESTful API**: Express.js endpoints for task management
- **MCP Schema Handlers**: Integration with Cursor IDE via Model Context Protocol
- **Context Engine**: Analyzes code to maintain contextual awareness
- **Docker & Smithery**: Containerized deployment for easy integration

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mcp-servers.git
cd mcp-servers/task-manager-server

# Install dependencies
npm install

# Start the server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
GITHUB_TOKEN=your_github_token
DEBUG=task-manager:*
```

## API Usage

### Creating a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement feature X","description":"Details about feature X","priority":"high","context":{"repository":"my-repo","branch":"feature/x","files":["src/component.js"]}'
```

### Getting Tasks

```bash
curl http://localhost:3000/api/tasks
```

## Cursor Integration

In your Cursor settings, add the following MCP configuration:

```json
{
  "mcp": {
    "taskmanager": {
      "url": "http://localhost:3000",
      "enabled": true
    }
  }
}
```

## License

MIT
