import mongoose from "mongoose";
import crypto from "crypto";

const inviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(16).toString("hex"),
    },
    email: {
      type: String,
      required: [true, "Invitee email is required"],
      lowercase: true,
      trim: true,
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
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "used", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  { timestamps: true }
);

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;