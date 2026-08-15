import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    channel: {
      type: String,
      default: "general",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    isSystem: { type: Boolean, default: false },
    systemMeta: {
      type: {
        type: String,
        enum: ["member_removed", "member_left", "member_added"],
      },
      actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      targetId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ workspace: 1, channel: 1, createdAt: -1 });
messageSchema.index({ workspace: 1, sender: 1, recipient: 1, createdAt: -1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;