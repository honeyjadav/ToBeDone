import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_ASSIGNED",
        "TASK_STATUS_CHANGED",
        "TASK_COMMENTED",
        "TASK_DUE_SOON",
        "TASK_OVERDUE",
        "MESSAGE_SENT",
        "FILE_UPLOADED",
        "MEMBER_JOINED",
        "MEMBER_ROLE_CHANGED",
      ],
    },
    targetType: {
      type: String,
      enum: ["Task", "Message", "FileUpload", "Membership", "Board"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // flexible extra info, e.g. { oldStatus, newStatus }
      default: {},
    },
    // used to mark whether this activity has already been included
    // in a digest batch sent to the user
    includedInDigest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ workspace: 1, createdAt: -1 });
activityLogSchema.index({ includedInDigest: 1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
