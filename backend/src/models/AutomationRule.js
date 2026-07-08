import mongoose from 'mongoose';
import { AUTOMATIONS_TRIGGERS, AUTOMATION_ACTIONS } from '../utils/constants.js';

const automationRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trigger: {
      type: String,
      enum: Object.values(AUTOMATIONS_TRIGGERS),
      required: true,
    },
    triggerConditions: mongoose.Schema.Types.Mixed,
    actions: [
      {
        type: {
          type: String,
          enum: Object.values(AUTOMATION_ACTIONS),
        },
        config: mongoose.Schema.Types.Mixed,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    executionCount: {
      type: Number,
      default: 0,
    },
    lastExecuted: Date,
  },
  {
    timestamps: true,
  }
);

automationRuleSchema.index({ project: 1 });
automationRuleSchema.index({ isActive: 1 });

const AutomationRule = mongoose.model('AutomationRule', automationRuleSchema);
export default AutomationRule;