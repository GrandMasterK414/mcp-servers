const Task = require('../models/Task');
const mongoose = require('mongoose');

// Register all MCP handlers with the MCP server
exports.registerAll = (mcpServer) => {
  mcpServer.registerTool('taskmanager', 'Task management with contextual code awareness');
  
  // Handler for registering a new request and its tasks
  mcpServer.registerHandler('taskmanager', 'request_planning', async (params) => {
    try {
      const { originalRequest, tasks, splitDetails } = params;
      
      if (!originalRequest || !tasks || !Array.isArray(tasks)) {
        return { error: 'Invalid parameters: originalRequest and tasks array are required' };
      }
      
      // Create a request ID
      const requestId = new mongoose.Types.ObjectId().toString();
      
      // Create tasks for the request
      const taskPromises = tasks.map(task => {
        return new Task({
          requestId,
          title: task.title,
          description: task.description,
          status: 'pending',
          priority: task.priority || 'medium',
          context: task.context || {}
        }).save();
      });
      
      const createdTasks = await Promise.all(taskPromises);
      
      return {
        requestId,
        tasks: createdTasks.map(task => ({
          taskId: task._id.toString(),
          title: task.title,
          status: task.status
        })),
        message: `Created ${createdTasks.length} tasks for request '${originalRequest}'`
      };
    } catch (err) {
      return { error: err.message };
    }
  });
  
  // Handler for getting the next pending task
  mcpServer.registerHandler('taskmanager', 'get_next_task', async (params) => {
    try {
      const { requestId } = params;
      
      if (!requestId) {
        return { error: 'requestId is required' };
      }
      
      // Find all tasks for this request
      const allTasks = await Task.find({ requestId }).sort({ 'priority': -1, 'createdAt': 1 });
      
      if (allTasks.length === 0) {
        return { error: 'No tasks found for this request' };
      }
      
      // Get all task statuses for progress reporting
      const taskStatuses = allTasks.map(task => ({
        taskId: task._id.toString(),
        title: task.title,
        status: task.status,
        progress: task.progress.percentage
      }));
      
      // Check if there are any pending or in-progress tasks
      const pendingTasks = allTasks.filter(task => 
        task.status === 'pending' || task.status === 'in_progress');
      
      if (pendingTasks.length === 0) {
        return { 
          all_tasks_done: true,
          progress: taskStatuses,
          message: 'All tasks completed'
        };
      }
      
      // Get the next task (prioritize in-progress over pending)
      const nextTask = pendingTasks.find(task => task.status === 'in_progress') || pendingTasks[0];
      
      // If task is pending, mark it as in-progress
      if (nextTask.status === 'pending') {
        nextTask.status = 'in_progress';
        await nextTask.save();
      }
      
      return {
        taskId: nextTask._id.toString(),
        title: nextTask.title,
        description: nextTask.description,
        status: nextTask.status,
        progress: taskStatuses,
        context: nextTask.context
      };
    } catch (err) {
      return { error: err.message };
    }
  });
  
  // Handler for marking a task as done
  mcpServer.registerHandler('taskmanager', 'mark_task_done', async (params) => {
    try {
      const { requestId, taskId, completedDetails } = params;
      
      if (!requestId || !taskId) {
        return { error: 'requestId and taskId are required' };
      }
      
      const task = await Task.findOne({ _id: taskId, requestId });
      if (!task) {
        return { error: 'Task not found' };
      }
      
      // Update task status and details
      task.status = 'completed';
      task.completedAt = Date.now();
      task.progress.percentage = 100;
      
      if (completedDetails) {
        if (!task.metadata) task.metadata = {};
        task.metadata.completionDetails = completedDetails;
      }
      
      await task.save();
      
      // Get updated task statuses for progress reporting
      const allTasks = await Task.find({ requestId });
      const taskStatuses = allTasks.map(t => ({
        taskId: t._id.toString(),
        title: t.title,
        status: t.status,
        progress: t.progress.percentage
      }));
      
      return {
        taskId,
        status: 'completed',
        progress: taskStatuses,
        message: `Task '${task.title}' marked as done`,
        needs_approval: true
      };
    } catch (err) {
      return { error: err.message };
    }
  });
  
  // Handler for approving task completion
  mcpServer.registerHandler('taskmanager', 'approve_task_completion', async (params) => {
    try {
      const { requestId, taskId } = params;
      
      if (!requestId || !taskId) {
        return { error: 'requestId and taskId are required' };
      }
      
      const task = await Task.findOne({ _id: taskId, requestId });
      if (!task) {
        return { error: 'Task not found' };
      }
      
      if (task.status !== 'completed') {
        return { error: 'Cannot approve a task that is not completed' };
      }
      
      // Add an approved flag to the task
      if (!task.metadata) task.metadata = {};
      task.metadata.approved = true;
      task.metadata.approvedAt = Date.now();
      await task.save();
      
      // Get updated task statuses for progress reporting
      const allTasks = await Task.find({ requestId });
      const taskStatuses = allTasks.map(t => ({
        taskId: t._id.toString(),
        title: t.title,
        status: t.status,
        progress: t.progress.percentage,
        approved: t.metadata && t.metadata.approved
      }));
      
      return {
        taskId,
        status: 'approved',
        progress: taskStatuses,
        message: `Task '${task.title}' approved`
      };
    } catch (err) {
      return { error: err.message };
    }
  });
  
  // Handler for approving request completion
  mcpServer.registerHandler('taskmanager', 'approve_request_completion', async (params) => {
    try {
      const { requestId } = params;
      
      if (!requestId) {
        return { error: 'requestId is required' };
      }
      
      // Get all tasks for this request
      const allTasks = await Task.find({ requestId });
      
      if (allTasks.length === 0) {
        return { error: 'No tasks found for this request' };
      }
      
      // Check if all tasks are completed
      const pendingTasks = allTasks.filter(task => 
        task.status !== 'completed');
      
      if (pendingTasks.length > 0) {
        return { error: 'Cannot approve request completion while tasks are still pending' };
      }
      
      // Mark all tasks as approved
      for (const task of allTasks) {
        if (!task.metadata) task.metadata = {};
        task.metadata.approved = true;
        task.metadata.approvedAt = Date.now();
        task.metadata.requestCompleted = true;
        await task.save();
      }
      
      // Get updated task statuses for final report
      const taskStatuses = allTasks.map(t => ({
        taskId: t._id.toString(),
        title: t.title,
        status: t.status,
        progress: t.progress.percentage,
        approved: true
      }));
      
      return {
        requestId,
        status: 'completed',
        progress: taskStatuses,
        message: 'Request completed and approved',
        completed: true
      };
    } catch (err) {
      return { error: err.message };
    }
  });
  
  // More handlers can be added as needed...
  
  console.log('Registered all Task Manager MCP handlers');
};
