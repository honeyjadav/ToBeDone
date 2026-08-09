import mongoose from "mongoose";
import crypto from "crypto";
import { getNextSequence } from "./Counter.js";

const inviteSchema = new mongoose.Schema(
  {
    inviteId: {
      type: String,
      unique: true,
      index: true,
    },
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

inviteSchema.pre("save", async function () {
  if (this.isNew && !this.inviteId) {
    const seq = await getNextSequence("invite");
    this.inviteId = `inv${String(seq).padStart(3, "0")}`;
  }
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;