const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class APITesterTool {
  constructor(config) {
    this.historySize = config.historySize || 50;
    this.timeout = config.timeout || 30000;
    this.savedRequestsDir = config.savedRequestsDir || path.join(process.cwd(), 'data', 'api-requests');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.savedRequestsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create saved requests directory:', error);
    }
  }

  async sendRequest(req, res) {
    const { url, method = 'GET', headers = {}, params = {}, data = {}, timeout } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
      const response = await axios({
        url,
        method,
        headers,
        params,
        data,
        timeout: timeout || this.timeout,
        validateStatus: () => true // Don't throw on any status code
      });
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        time: new Date().toISOString(),
        size: JSON.stringify(response.data).length
      };
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        isAxiosError: error.isAxiosError,
        config: error.config,
        time: new Date().toISOString()
      });
    }
  }

  async saveRequest(req, res) {
    const { name, request } = req.body;
    
    if (!name || !request) {
      return res.status(400).json({ error: 'Name and request are required' });
    }
    
    try {
      const filename = `${name.replace(/[^a-z0-9]/gi, '_')}.json`;
      const filePath = path.join(this.savedRequestsDir, filename);
      
      await fs.writeFile(filePath, JSON.stringify(request, null, 2));
      
      res.json({ success: true, name, filePath });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listSavedRequests(req, res) {
    try {
      const files = await fs.readdir(this.savedRequestsDir);
      const requests = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const filePath = path.join(this.savedRequestsDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            return {
              name: file.replace('.json', ''),
              file,
              request: JSON.parse(content)
            };
          })
      );
      
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loadRequest(req, res) {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Request name is required' });
    }
    
    try {
      const filename = `${name.replace(/[^a-z0-9]/gi, '_')}.json`;
      const filePath = path.join(this.savedRequestsDir, filename);
      
      const content = await fs.readFile(filePath, 'utf8');
      const request = JSON.parse(content);
      
      res.json({ name, request });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRequest(req, res) {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Request name is required' });
    }
    
    try {
      const filename = `${name.replace(/[^a-z0-9]/gi, '_')}.json`;
      const filePath = path.join(this.savedRequestsDir, filename);
      
      await fs.unlink(filePath);
      
      res.json({ success: true, name });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  register: async (server, config) => {
    const apiTesterTool = new APITesterTool(config);
    await apiTesterTool.init();
    
    server.registerTool('apitester', {
      sendRequest: apiTesterTool.sendRequest.bind(apiTesterTool),
      saveRequest: apiTesterTool.saveRequest.bind(apiTesterTool),
      listSavedRequests: apiTesterTool.listSavedRequests.bind(apiTesterTool),
      loadRequest: apiTesterTool.loadRequest.bind(apiTesterTool),
      deleteRequest: apiTesterTool.deleteRequest.bind(apiTesterTool)
    });
    
    return apiTesterTool;
  }
};