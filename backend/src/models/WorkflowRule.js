import mongoose from "mongoose";

const workflowRuleSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true, // e.g. "Notify manager when task is Done"
    },
    trigger: {
      event: {
        type: String,
        enum: ["TASK_STATUS_CHANGED", "TASK_OVERDUE", "TASK_CREATED"],
        required: true,
      },
      condition: {
        type: mongoose.Schema.Types.Mixed,
        default: {}, // e.g. { status: "Done" }
      },
    },
    action: {
      type: {
        type: String,
        enum: ["NOTIFY_MANAGER", "NOTIFY_USER", "SEND_SLACK", "CREATE_NOTIFICATION"],
        required: true,
      },
      params: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const WorkflowRule = mongoose.model("WorkflowRule", workflowRuleSchema);
export default WorkflowRule;
