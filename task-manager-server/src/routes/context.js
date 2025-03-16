const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get tasks by repository context
router.get('/repository/:repo', async (req, res) => {
  try {
    const tasks = await Task.find({ 'context.repository': req.params.repo });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks by branch context
router.get('/branch/:branch', async (req, res) => {
  try {
    const tasks = await Task.find({ 'context.branch': req.params.branch });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks by file context
router.get('/file/', async (req, res) => {
  try {
    if (!req.query.path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const tasks = await Task.find({ 'context.files': req.query.path });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task context
router.patch('/:taskId/context', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Update context properties if provided
    if (req.body.repository) task.context.repository = req.body.repository;
    if (req.body.branch) task.context.branch = req.body.branch;
    
    // Add files to context (avoid duplicates)
    if (req.body.files && Array.isArray(req.body.files)) {
      const uniqueFiles = new Set([...task.context.files || [], ...req.body.files]);
      task.context.files = Array.from(uniqueFiles);
    }
    
    // Add commits to context (avoid duplicates)
    if (req.body.commits && Array.isArray(req.body.commits)) {
      const uniqueCommits = new Set([...task.context.commits || [], ...req.body.commits]);
      task.context.commits = Array.from(uniqueCommits);
    }
    
    // Add code snippets to context
    if (req.body.codeSnippets && Array.isArray(req.body.codeSnippets)) {
      if (!task.context.codeSnippets) task.context.codeSnippets = [];
      task.context.codeSnippets.push(...req.body.codeSnippets);
    }
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
