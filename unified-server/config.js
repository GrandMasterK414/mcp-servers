module.exports = {
  port: process.env.PORT || 3000,
  enabledTools: process.env.ENABLED_TOOLS ? 
    process.env.ENABLED_TOOLS.split(',') : 
    ['filesystem', 'websearch', 'coderunner', 'personal'],
  tools: {
    filesystem: {
      directories: process.env.FS_DIRECTORIES ? 
        process.env.FS_DIRECTORIES.split(',') : 
        ['/data', './projects', './documents']
    },
    websearch: {
      apiKey: process.env.SEARCH_API_KEY,
      useProxy: process.env.USE_PROXY === 'true'
    },
    coderunner: {
      timeout: process.env.CODE_TIMEOUT || 5000,
      allowedLanguages: process.env.ALLOWED_LANGUAGES ? 
        process.env.ALLOWED_LANGUAGES.split(',') : 
        ['javascript', 'python', 'bash']
    },
    personal: {
      customCommands: process.env.CUSTOM_COMMANDS ? 
        JSON.parse(process.env.CUSTOM_COMMANDS) : 
        {}
    }
  }
};