import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const workflowRuleSchema = new mongoose.Schema(
  {
    ruleId: {
      type: String,
      unique: true,
      index: true,
    },
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
      required: true,
    },
    trigger: {
      event: {
        type: String,
        enum: ["TASK_STATUS_CHANGED", "TASK_OVERDUE", "TASK_CREATED"],
        required: true,
      },
      condition: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
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

workflowRuleSchema.pre("save", async function () {
  if (this.isNew && !this.ruleId) {
    const seq = await getNextSequence("workflowRule");
    this.ruleId = `wfr${String(seq).padStart(3, "0")}`;
  }
});

const WorkflowRule = mongoose.model("WorkflowRule", workflowRuleSchema);
export default WorkflowRule;