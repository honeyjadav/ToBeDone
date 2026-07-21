import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["Admin", "Manager", "Member"],
      default: "Member",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A user can only have one membership per workspace
membershipSchema.index({ user: 1, workspace: 1 }, { unique: true });

const Membership = mongoose.model("Membership", membershipSchema);
export default Membership;
