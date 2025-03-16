const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('@modelcontextprotocol/server');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const tasksRoutes = require('./routes/tasks');
const contextRoutes = require('./routes/context');
const progressRoutes = require('./routes/progress');

// Import MCP handlers
const mcpHandlers = require('./mcp/handlers');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start Express server
app.listen(port, () => {
  console.log(`Task Manager API server running on port ${port}`);
});

// Initialize MCP server
const mcpServer = createServer({
  port: process.env.MCP_PORT || 3001,
  host: process.env.MCP_HOST || '0.0.0.0'
});

// Register MCP handlers
mcpHandlers.registerAll(mcpServer);

// Start MCP server
mcpServer.start()
  .then(() => {
    console.log(`MCP server running on port ${process.env.MCP_PORT || 3001}`);
  })
  .catch(err => {
    console.error('Failed to start MCP server:', err);
  });

// Handle graceful shutdown
const handleShutdown = async () => {
  console.log('Shutting down servers...');
  await mcpServer.stop();
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
