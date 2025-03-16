const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = require('glob');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const unlinkAsync = promisify(fs.unlink);
const globAsync = promisify(glob);

class FilesystemTool {
  constructor(config) {
    this.allowedDirectories = config.allowedDirectories || [];
    this.maxFileSize = config.maxFileSize || 5 * 1024 * 1024; // 5MB default
    this.excludePatterns = config.excludePatterns || [];
    this.allowWrite = config.allowWrite || false;
  }

  /**
   * Register all filesystem tool functions with the MCP server
   * @param {Object} server - MCP server instance
   */
  register(server) {
    // Register functions
    server.registerFunction('read_file', this.readFile.bind(this));
    server.registerFunction('write_file', this.writeFile.bind(this));
    server.registerFunction('list_dir', this.listDirectory.bind(this));
    server.registerFunction('search_files', this.searchFiles.bind(this));
    server.registerFunction('delete_file', this.deleteFile.bind(this));
    server.registerFunction('create_directory', this.createDirectory.bind(this));
    server.registerFunction('get_file_info', this.getFileInfo.bind(this));

    console.log('Filesystem tool registered with allowed directories:', this.allowedDirectories);
    console.log('Write operations:', this.allowWrite ? 'enabled' : 'disabled');
  }

  /**
   * Verify if the path is allowed based on configuration
   * @param {string} filePath - Path to verify
   * @returns {boolean} - Whether path is allowed
   */
  isPathAllowed(filePath) {
    const resolvedPath = path.resolve(filePath);
    
    // Check if path is within allowed directories
    return this.allowedDirectories.some(dir => {
      const allowedDir = path.resolve(dir);
      return resolvedPath.startsWith(allowedDir);
    });
  }

  /**
   * Check if path matches any exclude pattern
   * @param {string} filePath - Path to check
   * @returns {boolean} - Whether path should be excluded
   */
  isPathExcluded(filePath) {
    return this.excludePatterns.some(pattern => {
      // Handle glob patterns
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(filePath);
      }
      // Handle direct substring matching
      return filePath.includes(pattern);
    });
  }

  /**
   * Read file contents
   * @param {Object} params - Parameters
   * @param {string} params.path - File path
   * @returns {Promise<Object>} - File contents and metadata
   */
  async readFile(params) {
    try {
      const { path: filePath } = params;
      
      if (!filePath) {
        throw new Error('File path is required');
      }
      
      if (!this.isPathAllowed(filePath)) {
        throw new Error('Access to this file path is not allowed');
      }
      
      if (this.isPathExcluded(filePath)) {
        throw new Error('This file path is excluded by configuration');
      }
      
      const stats = await statAsync(filePath);
      
      if (stats.size > this.maxFileSize) {
        throw new Error(`File size exceeds maximum allowed size of ${this.maxFileSize} bytes`);
      }
      
      const content = await readFileAsync(filePath, 'utf8');
      
      return {
        content,
        size: stats.size,
        lastModified: stats.mtime,
        isDirectory: stats.isDirectory(),
        extension: path.extname(filePath)
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Write content to a file
   * @param {Object} params - Parameters
   * @param {string} params.path - File path
   * @param {string} params.content - File content
   * @returns {Promise<Object>} - Result information
   */
  async writeFile(params) {
    try {
      const { path: filePath, content } = params;
      
      if (!this.allowWrite) {
        throw new Error('Write operations are disabled');
      }
      
      if (!filePath || content === undefined) {
        throw new Error('File path and content are required');
      }
      
      if (!this.isPathAllowed(filePath)) {
        throw new Error('Access to this file path is not allowed');
      }
      
      if (this.isPathExcluded(filePath)) {
        throw new Error('This file path is excluded by configuration');
      }
      
      // Ensure the directory exists
      const dirPath = path.dirname(filePath);
      await mkdirAsync(dirPath, { recursive: true });
      
      await writeFileAsync(filePath, content);
      
      const stats = await statAsync(filePath);
      
      return {
        success: true,
        size: stats.size,
        lastModified: stats.mtime,
        path: filePath
      };
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }

  /**
   * List directory contents
   * @param {Object} params - Parameters
   * @param {string} params.path - Directory path
   * @returns {Promise<Object>} - Directory contents
   */
  async listDirectory(params) {
    try {
      const { path: dirPath } = params;
      
      if (!dirPath) {
        throw new Error('Directory path is required');
      }
      
      if (!this.isPathAllowed(dirPath)) {
        throw new Error('Access to this directory path is not allowed');
      }
      
      const files = await readdirAsync(dirPath);
      
      const entries = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dirPath, file);
          
          // Skip excluded files
          if (this.isPathExcluded(filePath)) {
            return null;
          }
          
          try {
            const stats = await statAsync(filePath);
            return {
              name: file,
              path: filePath,
              size: stats.size,
              isDirectory: stats.isDirectory(),
              lastModified: stats.mtime,
              extension: path.extname(file)
            };
          } catch (err) {
            // Skip files with errors
            return null;
          }
        })
      );
      
      // Filter out null entries (excluded or error files)
      return {
        path: dirPath,
        entries: entries.filter(entry => entry !== null)
      };
    } catch (error) {
      console.error('Error listing directory:', error);
      throw new Error(`Failed to list directory: ${error.message}`);
    }
  }

  /**
   * Search for files matching a pattern
   * @param {Object} params - Parameters
   * @param {string} params.pattern - Search pattern
   * @param {string} params.basePath - Base directory for search
   * @returns {Promise<Object>} - Search results
   */
  async searchFiles(params) {
    try {
      const { pattern, basePath } = params;
      
      if (!pattern || !basePath) {
        throw new Error('Search pattern and base path are required');
      }
      
      if (!this.isPathAllowed(basePath)) {
        throw new Error('Access to this base path is not allowed');
      }
      
      // Create glob pattern with resolved base path
      const searchPattern = path.join(path.resolve(basePath), pattern);
      
      // Find matching files
      const matches = await globAsync(searchPattern, {
        nodir: true,
        dot: false,
        ignore: this.excludePatterns
      });
      
      // Get file information for each match
      const results = await Promise.all(
        matches.map(async (filePath) => {
          try {
            const stats = await statAsync(filePath);
            return {
              path: filePath,
              name: path.basename(filePath),
              size: stats.size,
              lastModified: stats.mtime,
              extension: path.extname(filePath)
            };
          } catch (err) {
            return null;
          }
        })
      );
      
      return {
        pattern,
        basePath,
        matches: results.filter(result => result !== null)
      };
    } catch (error) {
      console.error('Error searching files:', error);
      throw new Error(`Failed to search files: ${error.message}`);
    }
  }

  /**
   * Delete a file
   * @param {Object} params - Parameters
   * @param {string} params.path - File path
   * @returns {Promise<Object>} - Result information
   */
  async deleteFile(params) {
    try {
      const { path: filePath } = params;
      
      if (!this.allowWrite) {
        throw new Error('Write operations are disabled');
      }
      
      if (!filePath) {
        throw new Error('File path is required');
      }
      
      if (!this.isPathAllowed(filePath)) {
        throw new Error('Access to this file path is not allowed');
      }
      
      if (this.isPathExcluded(filePath)) {
        throw new Error('This file path is excluded by configuration');
      }
      
      const stats = await statAsync(filePath);
      
      if (stats.isDirectory()) {
        throw new Error('Cannot delete a directory with this function');
      }
      
      await unlinkAsync(filePath);
      
      return {
        success: true,
        path: filePath,
        deleted: true
      };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Create a new directory
   * @param {Object} params - Parameters
   * @param {string} params.path - Directory path
   * @returns {Promise<Object>} - Result information
   */
  async createDirectory(params) {
    try {
      const { path: dirPath } = params;
      
      if (!this.allowWrite) {
        throw new Error('Write operations are disabled');
      }
      
      if (!dirPath) {
        throw new Error('Directory path is required');
      }
      
      if (!this.isPathAllowed(dirPath)) {
        throw new Error('Access to this directory path is not allowed');
      }
      
      if (this.isPathExcluded(dirPath)) {
        throw new Error('This directory path is excluded by configuration');
      }
      
      await mkdirAsync(dirPath, { recursive: true });
      
      return {
        success: true,
        path: dirPath,
        created: true
      };
    } catch (error) {
      console.error('Error creating directory:', error);
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }

  /**
   * Get file or directory information
   * @param {Object} params - Parameters
   * @param {string} params.path - File or directory path
   * @returns {Promise<Object>} - File/directory information
   */
  async getFileInfo(params) {
    try {
      const { path: filePath } = params;
      
      if (!filePath) {
        throw new Error('File path is required');
      }
      
      if (!this.isPathAllowed(filePath)) {
        throw new Error('Access to this file path is not allowed');
      }
      
      if (this.isPathExcluded(filePath)) {
        throw new Error('This file path is excluded by configuration');
      }
      
      const stats = await statAsync(filePath);
      
      return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        lastModified: stats.mtime,
        created: stats.birthtime,
        permissions: stats.mode,
        extension: path.extname(filePath)
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }
}

module.exports = {
  register: (server, config) => {
    const filesystemTool = new FilesystemTool(config);
    filesystemTool.register(server);
  }
};