import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { 
      type: String, 
      unique: true, 
      index: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    type: { 
      type: String, 
      enum: ["DIGEST", "DIRECT", "TASK"],
      default: "DIGEST" 
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String, 
      required: true 
    },
    taskId: {                              // NEW
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    chatData: {                            // NEW (still missing, needed separately)
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    sourceActivityIds: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ActivityLog" 
      },
    ],
    isRead: { 
      type: Boolean, 
      default: false 
    },
    sentToSlack: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });

notificationSchema.pre("save", async function () {
  if (this.isNew && !this.notificationId) {
    const seq = await getNextSequence("notification");
    this.notificationId = `not${String(seq).padStart(3, "0")}`;
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
