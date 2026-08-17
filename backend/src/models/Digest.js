import mongoose from "mongoose";

const digestSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    // Size of the summary window in hours (24 - 168). This also defines the
    // bucket size: one digest document exists per {workspace, windowHours, bucketStart}.
    windowHours: {
      type: Number,
      required: true,
      min: 24,
      max: 168,
    },
    // Start of the fixed time window this digest covers. As long as "now" falls
    // within [bucketStart, bucketStart + windowHours), any new activity updates
    // THIS SAME document rather than creating a new one. Once the window rolls
    // over, a new bucketStart (and therefore a new document) begins.
    bucketStart: { type: Date, required: true },
    label: { type: String, required: true },
    groups: { type: mongoose.Schema.Types.Mixed, default: [] },
    focus: { type: String, default: "" },
    // How many activity log entries were rolled into this digest (used to detect
    // whether new activity has come in since the last generation for this bucket).
    activityCount: { type: Number, default: 0 },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

digestSchema.index({ workspace: 1, windowHours: 1, bucketStart: 1 }, { unique: true });
digestSchema.index({ workspace: 1, createdAt: -1 });
// TTL: auto-expire digests after 90 days so history doesn't grow forever
digestSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const Digest = mongoose.models.Digest || mongoose.model("Digest", digestSchema);

export default Digest;