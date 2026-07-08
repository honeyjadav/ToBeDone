import mongoose from 'mongoose';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.BACKLOG,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: Date,
    startDate: Date,
    completedAt: Date,
    estimatedHours: Number,
    actualHours: Number,
    labels: [String],
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    subtasks: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    checklists: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        items: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            text: String,
            completed: { type: Boolean, default: false },
          },
        ],
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment',
      },
    ],
    activity: [
      {
        type: {
          type: String,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changes: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;