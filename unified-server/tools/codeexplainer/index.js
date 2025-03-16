const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class AICodeExplainerTool {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.apiEndpoint = config.apiEndpoint || 'https://api.openai.com/v1/chat/completions';
    this.model = config.model || 'gpt-4';
    this.historyDir = config.historyDir || path.join(process.cwd(), 'data', 'explanations');
    this.maxContextLength = config.maxContextLength || 8000; // Maximum tokens for the context
    this.maxExplanations = config.maxExplanations || 100; // Maximum explanations to store
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.historyDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create explanation history directory:', error);
    }
  }

  async explainCode(req, res) {
    const { code, language, level = 'detailed', includeComments = true, explainLine = false } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    try {
      // Create the appropriate prompt based on the requested level of detail
      let prompt;
      
      if (explainLine) {
        // Line-by-line explanation
        prompt = `Explain the following ${language || ''} code line by line:

\`\`\`${language || ''}
${code}
\`\`\`

Please provide a concise explanation for each line in this format:
Line 1: [code] - [explanation]
Line 2: [code] - [explanation]
etc.

${includeComments ? 'Include explanations for comments as well.' : 'Skip comment lines.'}`;
      } else {
        // Block level explanation
        let detailLevel;
        switch (level) {
          case 'brief':
            detailLevel = 'a brief, high-level explanation';
            break;
          case 'detailed':
            detailLevel = 'a detailed explanation covering the main functionality and approach';
            break;
          case 'comprehensive':
            detailLevel = 'a comprehensive explanation including implementation details, potential edge cases, and performance considerations';
            break;
          default:
            detailLevel = 'a detailed explanation';
        }
        
        prompt = `Explain the following ${language || ''} code, providing ${detailLevel}:

\`\`\`${language || ''}
${code}
\`\`\`

${includeComments ? 'Include explanations of any comments in the code.' : ''}
${level === 'comprehensive' ? 'Also include insights on potential bugs, edge cases, and performance considerations.' : ''}`;
      }
      
      // Call the AI API
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert software developer with a talent for explaining code clearly and concisely. Your explanations are technically precise yet accessible.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2048
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Extract the explanation
      const explanation = response.data.choices[0].message.content;
      
      // Generate a unique ID for this explanation
      const explanationId = uuidv4();
      
      // Save to history
      const historyItem = {
        id: explanationId,
        timestamp: new Date().toISOString(),
        code,
        language,
        level,
        includeComments,
        explainLine,
        explanation
      };
      
      const historyPath = path.join(this.historyDir, `${explanationId}.json`);
      await fs.writeFile(historyPath, JSON.stringify(historyItem, null, 2));
      
      // Manage history size
      await this.pruneHistory();
      
      res.json({
        explanationId,
        explanation,
        timestamp: historyItem.timestamp
      });
    } catch (error) {
      console.error('Explanation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate explanation',
        details: error.response?.data || error.message
      });
    }
  }

  async getExplanationHistory(req, res) {
    try {
      const files = await fs.readdir(this.historyDir);
      
      // Sort files by modification time, newest first
      const sortedFiles = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const filePath = path.join(this.historyDir, file);
            const stats = await fs.stat(filePath);
            return { file, mtime: stats.mtime };
          })
      );
      
      sortedFiles.sort((a, b) => b.mtime - a.mtime);
      
      // Get history items with limited information
      const historyItems = await Promise.all(
        sortedFiles.map(async ({ file }) => {
          const filePath = path.join(this.historyDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const item = JSON.parse(content);
          
          // Return a summary without the full code and explanation
          return {
            id: item.id,
            timestamp: item.timestamp,
            language: item.language,
            codePreview: item.code.length > 100 ? item.code.slice(0, 100) + '...' : item.code,
            level: item.level,
            explainLine: item.explainLine
          };
        })
      );
      
      res.json({ history: historyItems });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExplanation(req, res) {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Explanation ID is required' });
    }
    
    try {
      const filePath = path.join(this.historyDir, `${id}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      
      res.json(JSON.parse(content));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async analyzeCodeQuality(req, res) {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    try {
      // Create the prompt for code quality analysis
      const prompt = `Analyze the following ${language || ''} code for quality issues, potential bugs, and suggestions for improvement:

\`\`\`${language || ''}
${code}
\`\`\`

Please provide:

1. Overall assessment of code quality (0-10 scale)
2. Strengths
3. Potential bugs or issues
4. Performance considerations
5. Readability and maintainability
6. Specific recommendations for improvement

Format your response as a structured analysis with clear sections.`;
      
      // Call the AI API
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert software developer specializing in code quality assessment. You provide detailed, actionable feedback on code with a focus on reliability, performance, and maintainability.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2048
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Extract the analysis
      const analysis = response.data.choices[0].message.content;
      
      // Generate a unique ID for this analysis
      const analysisId = uuidv4();
      
      // Save to history
      const historyItem = {
        id: analysisId,
        type: 'quality',
        timestamp: new Date().toISOString(),
        code,
        language,
        analysis
      };
      
      const historyPath = path.join(this.historyDir, `${analysisId}.json`);
      await fs.writeFile(historyPath, JSON.stringify(historyItem, null, 2));
      
      res.json({
        analysisId,
        analysis,
        timestamp: historyItem.timestamp
      });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: 'Failed to generate code quality analysis',
        details: error.response?.data || error.message
      });
    }
  }

  async pruneHistory() {
    try {
      const files = await fs.readdir(this.historyDir);
      
      if (files.length <= this.maxExplanations) {
        return; // No need to prune
      }
      
      // Get file stats
      const fileStats = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const filePath = path.join(this.historyDir, file);
            const stats = await fs.stat(filePath);
            return { file, mtime: stats.mtime };
          })
      );
      
      // Sort by modification time, oldest first
      fileStats.sort((a, b) => a.mtime - b.mtime);
      
      // Delete oldest files beyond the limit
      const filesToDelete = fileStats.slice(0, fileStats.length - this.maxExplanations);
      
      for (const { file } of filesToDelete) {
        await fs.unlink(path.join(this.historyDir, file));
      }
    } catch (error) {
      console.error('Failed to prune explanation history:', error);
    }
  }
}

module.exports = {
  register: async (server, config) => {
    if (!config.apiKey) {
      console.warn('Code Explainer tool requires an API key. Tool will be registered but may not work correctly.');
    }
    
    const codeExplainerTool = new AICodeExplainerTool(config);
    await codeExplainerTool.init();
    
    server.registerTool('codeexplainer', {
      explainCode: codeExplainerTool.explainCode.bind(codeExplainerTool),
      getExplanationHistory: codeExplainerTool.getExplanationHistory.bind(codeExplainerTool),
      getExplanation: codeExplainerTool.getExplanation.bind(codeExplainerTool),
      analyzeCodeQuality: codeExplainerTool.analyzeCodeQuality.bind(codeExplainerTool)
    });
    
    return codeExplainerTool;
  }
};