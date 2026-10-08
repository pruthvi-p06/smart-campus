const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Issue category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Issue location is required'],
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporting user is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminNote: {
      type: String,
      default: '',
    },
    resolutionNote: {
      type: String,
      default: '',
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for sorting & filtering
issueSchema.index({ status: 1, priority: 1, category: 1, reportedBy: 1, assignedTo: 1 });

module.exports = mongoose.model('Issue', issueSchema);
