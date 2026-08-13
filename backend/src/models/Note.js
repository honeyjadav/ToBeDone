import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: "",
            trim: true,
        },
        content: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: "#fff9c4",
        },
        pinned: {
            type: Boolean,
            default: false,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Note", noteSchema);