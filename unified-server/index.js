const { createServer } = require('@modelcontextprotocol/server');
const path = require('path');
const config = require('./config');

// Import all tools
const filesystemTool = require('./tools/filesystem');
const githubTool = require('./tools/github');
const apiTesterTool = require('./tools/api-tester');
const databaseTool = require('./tools/database');
const codeQualityTool = require('./tools/code-quality');
const docGenTool = require('./tools/documentation');
const codeTranslationTool = require('./tools/code-translation');
const dependencyManagerTool = require('./tools/dependency-manager');
const performanceProfilerTool = require('./tools/performance-profiler');
const codeExplainerTool = require('./tools/code-explainer');

// Get enabled tools from config
const enabledTools = config.enabledTools;

// Start server
async function startServer() {
  try {
    const server = createServer({
      port: config.port,
      host: config.host
    });

    console.log(`Starting unified MCP server on ${config.host}:${config.port}`);
    console.log(`Enabled tools: ${enabledTools.join(', ')}`);
    
    // Register each enabled tool
    if (enabledTools.includes('filesystem')) {
      filesystemTool.register(server, config.filesystem);
      console.log('Filesystem tool registered');
    }
    
    if (enabledTools.includes('github')) {
      githubTool.register(server, config.github);
      console.log('GitHub tool registered');
    }
    
    if (enabledTools.includes('api-tester')) {
      apiTesterTool.register(server, config.apiTester);
      console.log('API Tester tool registered');
    }
    
    if (enabledTools.includes('database')) {
      databaseTool.register(server, config.database);
      console.log('Database Explorer tool registered');
    }
    
    if (enabledTools.includes('code-quality')) {
      codeQualityTool.register(server, config.codeQuality);
      console.log('Code Quality tool registered');
    }
    
    if (enabledTools.includes('documentation')) {
      docGenTool.register(server, config.documentation);
      console.log('Documentation Generator tool registered');
    }
    
    if (enabledTools.includes('code-translation')) {
      codeTranslationTool.register(server, config.codeTranslation);
      console.log('Code Translation tool registered');
    }
    
    if (enabledTools.includes('dependency-manager')) {
      dependencyManagerTool.register(server, config.dependencyManager);
      console.log('Dependency Manager tool registered');
    }
    
    if (enabledTools.includes('performance-profiler')) {
      performanceProfilerTool.register(server, config.performanceProfiler);
      console.log('Performance Profiler tool registered');
    }
    
    if (enabledTools.includes('code-explainer')) {
      codeExplainerTool.register(server, config.codeExplainer);
      console.log('AI Code Explainer tool registered');
    }
    
    await server.start();
    console.log('Server started successfully');
    
    // Handle graceful shutdown
    const handleShutdown = async () => {
      console.log('Shutting down server...');
      await server.stop();
      console.log('Server stopped');
      process.exit(0);
    };
    
    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();