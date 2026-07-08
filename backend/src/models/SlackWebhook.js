import mongoose from 'mongoose';

const slackWebhookSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    webhookUrl: {
      type: String,
      required: true,
    },
    channel: String,
    events: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    testsSent: {
      type: Number,
      default: 0,
    },
    lastTestAt: Date,
    logs: [
      {
        event: String,
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        response: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

slackWebhookSchema.index({ project: 1 });

const SlackWebhook = mongoose.model('SlackWebhook', slackWebhookSchema);
export default SlackWebhook;