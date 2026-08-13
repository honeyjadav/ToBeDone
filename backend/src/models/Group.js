import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isPrivate: {
      type: Boolean,
      default: true, // private = only members listed below can see/join; false = open to all workspace members
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

groupSchema.index({ workspace: 1, name: 1 }, { unique: true });

const Group = mongoose.model("Group", groupSchema);
export default Group;