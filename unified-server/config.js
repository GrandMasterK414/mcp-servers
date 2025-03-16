module.exports = {
  port: process.env.PORT || 3000,
  enabledTools: process.env.ENABLED_TOOLS ? 
    process.env.ENABLED_TOOLS.split(',') : 
    ['filesystem', 'github', 'apitester', 'codeexplainer', 'translator',
     'dbexplorer', 'codequality', 'docgen', 'dependencymanager', 'profiler'],
  tools: {
    filesystem: {
      directories: process.env.FS_DIRECTORIES ? 
        process.env.FS_DIRECTORIES.split(',') : 
        ['/data', './projects', './documents']
    },
    github: {
      token: process.env.GITHUB_TOKEN
    },
    apitester: {
      historySize: process.env.API_TESTER_HISTORY_SIZE || 50,
      timeout: process.env.API_TESTER_TIMEOUT || 30000,
      savedRequestsDir: process.env.API_TESTER_SAVED_REQUESTS_DIR
    },
    dbexplorer: {
      connectionsDir: process.env.DB_CONNECTIONS_DIR,
      queriesDir: process.env.DB_QUERIES_DIR,
      maxQueryHistory: process.env.DB_MAX_QUERY_HISTORY || 100,
      queryTimeout: process.env.DB_QUERY_TIMEOUT || 30000
    },
    codequality: {
      eslintConfigPath: process.env.ESLINT_CONFIG_PATH,
      prettierConfigPath: process.env.PRETTIER_CONFIG_PATH
    },
    docgen: {
      outputDir: process.env.DOC_OUTPUT_DIR,
      templateDir: process.env.DOC_TEMPLATE_DIR
    },
    translator: {
      apiKey: process.env.TRANSLATOR_API_KEY,
      apiEndpoint: process.env.TRANSLATOR_API_ENDPOINT,
      model: process.env.TRANSLATOR_MODEL,
      historyDir: process.env.TRANSLATOR_HISTORY_DIR
    },
    dependencymanager: {
      npmRegistry: process.env.NPM_REGISTRY || 'https://registry.npmjs.org',
      pypiRegistry: process.env.PYPI_REGISTRY || 'https://pypi.org/pypi',
      projectsDir: process.env.PROJECTS_DIR || process.cwd(),
      cacheDir: process.env.DEPENDENCY_CACHE_DIR,
      cacheTTL: process.env.DEPENDENCY_CACHE_TTL || 3600000
    },
    profiler: {
      outputDir: process.env.PROFILER_OUTPUT_DIR,
      tempDir: process.env.PROFILER_TEMP_DIR,
      nodejsProfiler: process.env.NODEJS_PROFILER || 'clinic',
      pythonProfiler: process.env.PYTHON_PROFILER || 'cProfile'
    },
    codeexplainer: {
      apiKey: process.env.EXPLAINER_API_KEY,
      apiEndpoint: process.env.EXPLAINER_API_ENDPOINT,
      model: process.env.EXPLAINER_MODEL || 'gpt-4',
      historyDir: process.env.EXPLAINER_HISTORY_DIR,
      maxContextLength: process.env.EXPLAINER_MAX_CONTEXT_LENGTH || 8000,
      maxExplanations: process.env.EXPLAINER_MAX_EXPLANATIONS || 100
    },
    personal: {
      customCommands: process.env.CUSTOM_COMMANDS ? 
        JSON.parse(process.env.CUSTOM_COMMANDS) : 
        {}
    }
  }
};