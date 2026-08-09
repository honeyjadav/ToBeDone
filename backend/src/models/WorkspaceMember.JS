import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const workspaceMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      index: true,
    },
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

workspaceMemberSchema.pre("save", async function () {
  if (this.isNew && !this.memberId) {
    const seq = await getNextSequence("workspaceMember");
    this.memberId = `wsm${String(seq).padStart(3, "0")}`;
  }
});

const WorkspaceMember = mongoose.model("WorkspaceMember", workspaceMemberSchema);
export default WorkspaceMember;