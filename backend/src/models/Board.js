import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    columns: [
      {
        name: { type: String, required: true }, // e.g. "To Do", "In Progress", "Done"
        order: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
export default Board;
