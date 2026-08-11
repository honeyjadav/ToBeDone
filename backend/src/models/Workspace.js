import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const workspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slackWebhookUrl: {
      type: String, // for Slack integration
      default: "",
    },
    logo: {
      type: String, // Cloudinary URL
      default: "",
    },
  },
  { timestamps: true }
);

// No `next` param — this project's Mongoose setup resolves async
// pre-hooks automatically (see User.js pre-save hook for the same pattern).
workspaceSchema.pre("save", async function () {
  if (this.isNew && !this.workspaceId) {
    const seq = await getNextSequence("workspace");
    this.workspaceId = `wsp${String(seq).padStart(3, "0")}`;
  }
});

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;