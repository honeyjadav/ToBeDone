import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const webhookHeaderSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { _id: false }
);

const webhookSchema = new mongoose.Schema(
    {
        webhookId: {
            type: String,
            unique: true,
            index: true,
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
        name: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        event: {
            type: String,
            required: true,
            trim: true,
        },
        headers: [webhookHeaderSchema],
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

webhookSchema.index({ workspace: 1, active: 1, event: 1 });

webhookSchema.pre("save", async function () {
    if (this.isNew && !this.webhookId) {
        const seq = await getNextSequence("webhook");
        this.webhookId = `wbh${String(seq).padStart(3, "0")}`;
    }
});

const Webhook = mongoose.model("Webhook", webhookSchema);
export default Webhook;
