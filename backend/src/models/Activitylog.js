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
        "MEMBER_REMOVED",
        "MEMBER_ROLE_CHANGED",
        "MEMBER_INVITED",
        "GROUP_CREATED",
        "GROUP_MEMBER_ADDED",
        "GROUP_MEMBER_REMOVED",
      ],
    },
    targetType: {
      type: String,
      enum: ["Task", "Message", "FileUpload", "Membership", "Board", "Group"],
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    includedInDigest: { type: Boolean, default: false },
  },
  { timestamps: true },
);

activityLogSchema.index({ workspace: 1, createdAt: -1 });
activityLogSchema.index({ includedInDigest: 1 });
activityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
);

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
