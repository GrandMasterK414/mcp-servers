const { FilesystemServer } = require('@modelcontextprotocol/server-filesystem');

module.exports = {
  register: async (server, config) => {
    const directories = config.directories || ['/data'];
    
    // Create filesystem server with the specified directories
    const filesystemServer = new FilesystemServer(directories);
    
    // Register the filesystem handlers with the main server
    server.registerTool('filesystem', filesystemServer);
    
    return filesystemServer;
  }
};