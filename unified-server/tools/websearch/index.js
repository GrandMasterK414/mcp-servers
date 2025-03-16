const axios = require('axios');

class WebSearchTool {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.useProxy = config.useProxy || false;
    this.baseUrl = 'https://api.search.service/v1/search';
  }
  
  async search(query, options = {}) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          limit: options.limit || 10,
          ...options
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Web search error:', error.message);
      throw new Error(`Web search failed: ${error.message}`);
    }
  }
  
  handleRequest(req, res) {
    const { query, ...options } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    this.search(query, options)
      .then(results => res.json(results))
      .catch(error => res.status(500).json({ error: error.message }));
  }
}

module.exports = {
  register: async (server, config) => {
    const webSearchTool = new WebSearchTool(config);
    
    // Register the web search tool with the main server
    server.registerTool('websearch', {
      search: webSearchTool.handleRequest.bind(webSearchTool)
    });
    
    return webSearchTool;
  }
};