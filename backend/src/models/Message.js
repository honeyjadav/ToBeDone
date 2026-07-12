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
      default: "general", // simple channel name; can later become its own model
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
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FileUpload",
      },
    ],
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

const Message = mongoose.model("Message", messageSchema);
export default Message;
