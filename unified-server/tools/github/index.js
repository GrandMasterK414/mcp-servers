const { Octokit } = require('@octokit/rest');

class GitHubTool {
  constructor(config) {
    this.token = config.token;
    this.octokit = new Octokit({ auth: this.token });
  }

  async listRepositories(req, res) {
    try {
      const { username, org, page = 1, per_page = 30 } = req.query;
      
      let repos;
      if (org) {
        repos = await this.octokit.repos.listForOrg({ org, page, per_page });
      } else if (username) {
        repos = await this.octokit.repos.listForUser({ username, page, per_page });
      } else {
        repos = await this.octokit.repos.listForAuthenticatedUser({ page, per_page });
      }
      
      res.json(repos.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRepository(req, res) {
    try {
      const { owner, repo } = req.query;
      const repository = await this.octokit.repos.get({ owner, repo });
      res.json(repository.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContent(req, res) {
    try {
      const { owner, repo, path, ref } = req.query;
      const content = await this.octokit.repos.getContent({ owner, repo, path, ref });
      res.json(content.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listPullRequests(req, res) {
    try {
      const { owner, repo, state = 'open', page = 1, per_page = 30 } = req.query;
      const prs = await this.octokit.pulls.list({ owner, repo, state, page, per_page });
      res.json(prs.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPullRequest(req, res) {
    try {
      const { owner, repo, title, head, base, body } = req.body;
      const pr = await this.octokit.pulls.create({ owner, repo, title, head, base, body });
      res.json(pr.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listIssues(req, res) {
    try {
      const { owner, repo, state = 'open', page = 1, per_page = 30 } = req.query;
      const issues = await this.octokit.issues.listForRepo({ owner, repo, state, page, per_page });
      res.json(issues.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createIssue(req, res) {
    try {
      const { owner, repo, title, body, labels, assignees } = req.body;
      const issue = await this.octokit.issues.create({ owner, repo, title, body, labels, assignees });
      res.json(issue.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  register: async (server, config) => {
    if (!config.token) {
      console.warn('GitHub tool requires a token. Tool will be registered but may not work correctly.');
    }
    
    const githubTool = new GitHubTool(config);
    
    server.registerTool('github', {
      // Repository endpoints
      listRepositories: githubTool.listRepositories.bind(githubTool),
      getRepository: githubTool.getRepository.bind(githubTool),
      getContent: githubTool.getContent.bind(githubTool),
      
      // Pull request endpoints
      listPullRequests: githubTool.listPullRequests.bind(githubTool),
      createPullRequest: githubTool.createPullRequest.bind(githubTool),
      
      // Issue endpoints
      listIssues: githubTool.listIssues.bind(githubTool),
      createIssue: githubTool.createIssue.bind(githubTool)
    });
    
    return githubTool;
  }
};