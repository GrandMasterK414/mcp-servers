const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get task progress
router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    res.json(task.progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task progress percentage
router.patch('/:taskId/percentage', async (req, res) => {
  try {
    const { percentage } = req.body;
    if (percentage === undefined) {
      return res.status(400).json({ error: 'Percentage is required' });
    }
    
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.progress.percentage = Math.min(Math.max(0, percentage), 100);
    
    // If progress is 100%, update task status to completed
    if (task.progress.percentage === 100 && task.status !== 'completed') {
      task.status = 'completed';
      task.completedAt = Date.now();
    }
    
    const updatedTask = await task.save();
    res.json(updatedTask.progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a progress stage
router.post('/:taskId/stages', async (req, res) => {
  try {
    const { name, completed } = req.body;
    if (!name) return res.status(400).json({ error: 'Stage name is required' });
    
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    const stage = {
      name,
      completed: completed || false,
      timestamp: Date.now()
    };
    
    if (!task.progress.stages) task.progress.stages = [];
    task.progress.stages.push(stage);
    
    // Recalculate overall progress percentage based on stages
    if (task.progress.stages.length > 0) {
      const completedStages = task.progress.stages.filter(s => s.completed).length;
      task.progress.percentage = Math.round((completedStages / task.progress.stages.length) * 100);
    }
    
    const updatedTask = await task.save();
    res.status(201).json(updatedTask.progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a progress stage
router.patch('/:taskId/stages/:stageIndex', async (req, res) => {
  try {
    const { name, completed } = req.body;
    const stageIndex = parseInt(req.params.stageIndex);
    
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (!task.progress.stages || !task.progress.stages[stageIndex]) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    if (name) task.progress.stages[stageIndex].name = name;
    if (completed !== undefined) {
      task.progress.stages[stageIndex].completed = completed;
      
      // If the stage was just completed, update the timestamp
      if (completed) task.progress.stages[stageIndex].timestamp = Date.now();
      
      // Recalculate overall progress percentage based on stages
      const completedStages = task.progress.stages.filter(s => s.completed).length;
      task.progress.percentage = Math.round((completedStages / task.progress.stages.length) * 100);
      
      // If all stages are complete, mark task as completed
      if (task.progress.stages.every(s => s.completed) && task.status !== 'completed') {
        task.status = 'completed';
        task.completedAt = Date.now();
      }
    }
    
    const updatedTask = await task.save();
    res.json(updatedTask.progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
