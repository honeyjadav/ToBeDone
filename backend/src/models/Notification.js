import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    type: {
      type: String,
      enum: ["DIGEST", "DIRECT"], // DIGEST = AI-generated batch summary, DIRECT = single event (e.g. @mention)
      default: "DIGEST",
    },
    title: {
      type: String,
      required: true, // e.g. "Your daily digest"
    },
    summary: {
      type: String,
      required: true, // the AI-generated text, e.g. "3 tasks overdue, 2 comments need your reply..."
    },
    sourceActivityIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityLog",
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    sentToSlack: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
