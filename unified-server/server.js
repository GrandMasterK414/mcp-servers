const config = require('./config');
const fs = require('fs');
const path = require('path');
const { MCPServer } = require('@modelcontextprotocol/server');

// Create MCP server instance
const server = new MCPServer();

// Load enabled tools from configuration
async function loadTools() {
  const enabledTools = config.enabledTools || [];
  
  for (const toolName of enabledTools) {
    try {
      const toolPath = path.join(__dirname, 'tools', toolName);
      
      if (fs.existsSync(toolPath)) {
        const tool = require(toolPath);
        const toolConfig = config.tools[toolName] || {};
        
        await tool.register(server, toolConfig);
        console.log(`Loaded tool: ${toolName}`);
      } else {
        console.warn(`Tool not found: ${toolName}`);
      }
    } catch (error) {
      console.error(`Error loading tool ${toolName}:`, error);
    }
  }
}

// Start the server
async function startServer() {
  await loadTools();
  
  const port = config.port || 3000;
  server.listen(port, () => {
    console.log(`Unified MCP server listening on port ${port}`);
  });
}

startServer().catch(console.error);