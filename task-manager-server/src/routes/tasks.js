const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    
    // Apply query filters if provided
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.requestId) filter.requestId = req.query.requestId;
    if (req.query.repository) filter['context.repository'] = req.query.repository;
    
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.status = status;
    
    // If the task is completed, set the completedAt timestamp
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = Date.now();
      task.progress.percentage = 100;
    }
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
