module.exports = {
  // Core server configuration
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  
  // Parse enabled tools from environment variable or use defaults
  enabledTools: (process.env.ENABLED_TOOLS || 'filesystem,github').split(','),
  
  // Filesystem tool configuration
  filesystem: {
    allowedDirectories: (process.env.FS_DIRECTORIES || '/data,/projects').split(','),
    maxFileSize: parseInt(process.env.FS_MAX_FILE_SIZE || 5 * 1024 * 1024), // 5MB default
    excludePatterns: (process.env.FS_EXCLUDE_PATTERNS || 'node_modules,**/.git/**').split(','),
    allowWrite: process.env.FS_ALLOW_WRITE === 'true'
  },
  
  // GitHub tool configuration
  github: {
    accessToken: process.env.GITHUB_TOKEN,
    userAgent: process.env.GITHUB_USER_AGENT || 'MCP-Unified-Server',
    defaultOwner: process.env.GITHUB_DEFAULT_OWNER,
    defaultRepo: process.env.GITHUB_DEFAULT_REPO,
    cacheExpiry: parseInt(process.env.GITHUB_CACHE_EXPIRY || 60000) // 1 minute default cache
  },
  
  // API Tester tool configuration
  apiTester: {
    saveRequestHistory: process.env.API_SAVE_HISTORY === 'true',
    maxHistoryItems: parseInt(process.env.API_MAX_HISTORY || 50),
    maxResponseSize: parseInt(process.env.API_MAX_RESPONSE_SIZE || 1024 * 1024), // 1MB default
    timeout: parseInt(process.env.API_TIMEOUT || 30000), // 30 seconds default
    allowedHosts: process.env.API_ALLOWED_HOSTS ? process.env.API_ALLOWED_HOSTS.split(',') : []
  },
  
  // Database Explorer tool configuration
  database: {
    connections: process.env.DB_CONNECTIONS ? JSON.parse(process.env.DB_CONNECTIONS) : [],
    maxQueryExecutionTime: parseInt(process.env.DB_MAX_QUERY_TIME || 30000), // 30 seconds default
    maxResultRows: parseInt(process.env.DB_MAX_RESULT_ROWS || 1000),
    supportedTypes: (process.env.DB_SUPPORTED_TYPES || 'mysql,postgresql,mongodb').split(',')
  },
  
  // Code Quality tool configuration
  codeQuality: {
    linters: (process.env.QUALITY_LINTERS || 'eslint,prettier').split(','),
    configPaths: process.env.QUALITY_CONFIG_PATHS ? JSON.parse(process.env.QUALITY_CONFIG_PATHS) : {},
    autoFix: process.env.QUALITY_AUTO_FIX === 'true',
    maxFileSizeKb: parseInt(process.env.QUALITY_MAX_FILE_SIZE || 500) // 500KB default
  },
  
  // Documentation Generator tool configuration
  documentation: {
    generators: (process.env.DOC_GENERATORS || 'jsdoc,pydoc').split(','),
    outputFormats: (process.env.DOC_OUTPUT_FORMATS || 'markdown,html').split(','),
    templatesDir: process.env.DOC_TEMPLATES_DIR || './tools/documentation/templates',
    outputDir: process.env.DOC_OUTPUT_DIR || './docs'
  },
  
  // Code Translation tool configuration
  codeTranslation: {
    supportedLanguages: (process.env.TRANSLATION_LANGUAGES || 'javascript,typescript,python,java,cpp').split(','),
    translationEngine: process.env.TRANSLATION_ENGINE || 'ai',
    preserveComments: process.env.TRANSLATION_PRESERVE_COMMENTS === 'true',
    apiKey: process.env.TRANSLATION_API_KEY,
    maxTokens: parseInt(process.env.TRANSLATION_MAX_TOKENS || 8000),
    historySize: parseInt(process.env.TRANSLATION_HISTORY_SIZE || 20)
  },
  
  // Dependency Manager tool configuration
  dependencyManager: {
    packageManagers: (process.env.DEPENDENCY_PACKAGE_MANAGERS || 'npm,pip').split(','),
    checkVulnerabilities: process.env.DEPENDENCY_CHECK_VULNS === 'true',
    autoUpdate: process.env.DEPENDENCY_AUTO_UPDATE === 'true',
    registryUrls: process.env.DEPENDENCY_REGISTRY_URLS ? JSON.parse(process.env.DEPENDENCY_REGISTRY_URLS) : {},
    includeDevDependencies: process.env.DEPENDENCY_INCLUDE_DEV === 'true'
  },
  
  // Performance Profiler tool configuration
  performanceProfiler: {
    supportedLanguages: (process.env.PROFILER_LANGUAGES || 'javascript,python').split(','),
    maxProfilingTime: parseInt(process.env.PROFILER_MAX_TIME || 60000), // 1 minute default
    detailedReport: process.env.PROFILER_DETAILED === 'true',
    outputFormat: process.env.PROFILER_OUTPUT_FORMAT || 'json',
    temporaryDir: process.env.PROFILER_TEMP_DIR || './tmp'
  },
  
  // AI Code Explainer tool configuration
  codeExplainer: {
    aiProvider: process.env.EXPLAINER_AI_PROVIDER || 'openai',
    apiKey: process.env.EXPLAINER_API_KEY,
    maxTokens: parseInt(process.env.EXPLAINER_MAX_TOKENS || 8000),
    detailLevels: (process.env.EXPLAINER_DETAIL_LEVELS || 'brief,detailed,comprehensive').split(','),
    supportedLanguages: (process.env.EXPLAINER_LANGUAGES || 'javascript,typescript,python,java,cpp,go,rust').split(','),
    includeSuggestions: process.env.EXPLAINER_INCLUDE_SUGGESTIONS === 'true'
  }
};