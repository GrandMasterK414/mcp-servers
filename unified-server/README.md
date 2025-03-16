# Unified MCP Server with Enhanced Tools

A powerful, all-in-one Model Context Protocol (MCP) server that provides multiple specialized tools to enhance Cursor IDE's coding capabilities.

## Features

- **10+ Specialized Tools**: A comprehensive suite of tools for software development
- **Modular Design**: Enable/disable specific tools as needed
- **Docker Integration**: Easy deployment via Docker
- **Smithery Ready**: Designed for seamless deployment on Smithery

## Included Tools

### 1. Filesystem Tool
Access and manage files directly from Cursor IDE.

### 2. GitHub Integration Tool
Work with GitHub repositories, PRs, issues, and code all from your IDE.
- Repository browsing and management
- Pull request creation and review
- Issue tracking
- File exploration

### 3. API Testing Tool
Test and debug APIs right from your editor.
- Send requests (GET, POST, PUT, DELETE)
- Save request templates
- View formatted responses
- Test API workflows

### 4. Database Explorer Tool
Connect to databases and run queries.
- Support for MySQL, PostgreSQL, MongoDB
- Query execution and result visualization
- Connection management
- Query history

### 5. Code Quality Tool
Lint and format your code.
- Integrate with ESLint, Prettier
- Fix code issues with a single click
- Quality metrics and reporting
- Customizable configurations

### 6. Documentation Generator
Auto-generate documentation from your code.
- Support for JSDoc, PyDoc
- Multiple output formats (Markdown, HTML)
- Customizable templates
- Documentation history

### 7. Code Translation Tool
Translate code between programming languages.
- Support for multiple languages (JS, TS, Python, Java, C++, etc.)
- Maintain comments and structure
- Compare original and translated code
- Translation history

### 8. Dependency Manager
Analyze and update project dependencies.
- Identify outdated packages
- Vulnerability scanning
- Package updates
- Dependency analysis

### 9. Performance Profiler
Profile your code to identify bottlenecks.
- JavaScript and Python profiling
- Time measurement and statistics
- Detailed performance reports
- Optimization suggestions

### 10. AI Code Explainer
Leverage AI to understand and improve your code.
- Line-by-line explanations
- Different detail levels (brief, detailed, comprehensive)
- Code quality analysis
- Improvement suggestions

## Usage

### Installation

```bash
# Clone the repository
git clone https://github.com/GrandMasterK414/mcp-servers.git
cd mcp-servers/unified-server

# Install dependencies
npm install

# Start the server
npm start
```

### Docker

```bash
# Build the Docker image
docker build -t unified-mcp-server .

# Run with default configuration
docker run -p 3000:3000 unified-mcp-server

# Run with specific tools enabled
docker run -p 3000:3000 \
  -e ENABLED_TOOLS=filesystem,github,codeexplainer \
  -e GITHUB_TOKEN=your_github_token \
  -e EXPLAINER_API_KEY=your_openai_api_key \
  unified-mcp-server
```

## Configuration

Configure the server through environment variables:

```bash
# Core configuration
PORT=3000
ENABLED_TOOLS=filesystem,github,apitester,codeexplainer

# Tool-specific configuration
GITHUB_TOKEN=your_github_token
EXPLAINER_API_KEY=your_openai_api_key
FS_DIRECTORIES=/data,/projects,/documents
```

See the `config.js` file for all available configuration options.

## Extending

Add your own tools by:

1. Creating a new directory under `tools/`
2. Implementing a tool with a `register` function
3. Adding configuration to `config.js` and `smithery.yaml`
4. Adding the tool to the `enabledTools` list

## License

MIT