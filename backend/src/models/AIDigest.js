import mongoose from 'mongoose';

const aiDigestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    digestType: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    summary: String,
    tasksCompleted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    tasksPending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    tasksOverdue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    suggestedPriorities: mongoose.Schema.Types.Mixed,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

aiDigestSchema.index({ user: 1, createdAt: -1 });
aiDigestSchema.index({ project: 1 });

const AIDigest = mongoose.model('AIDigest', aiDigestSchema);
export default AIDigest;