const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'blocked'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  context: {
    repository: String,
    branch: String,
    files: [String],
    commits: [String],
    codeSnippets: [{
      content: String,
      language: String,
      path: String,
      startLine: Number,
      endLine: Number
    }]
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    stages: [{
      name: String,
      completed: Boolean,
      timestamp: Date
    }]
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  assignedTo: String,
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed
});

// Indexes for efficient querying
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ 'context.repository': 1 });
TaskSchema.index({ 'context.branch': 1 });
TaskSchema.index({ assignedTo: 1 });

// Update the updatedAt timestamp on save
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
