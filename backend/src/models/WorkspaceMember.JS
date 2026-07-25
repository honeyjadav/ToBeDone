import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Member"],
      default: "Member",
      required: true,
    },
  },
  { timestamps: true }
);

workspaceMemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

const WorkspaceMember = mongoose.model("WorkspaceMember", workspaceMemberSchema);
export default WorkspaceMember;