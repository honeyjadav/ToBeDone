import ActivityLog from "../models/Activitylog.js";
import Digest from "../models/Digest.js";
import { summarizeActivity } from "../services/aiSummaryService.js";

export const logActivity = async ({ workspace, user, action, targetType, targetId, metadata = {} }) => {
  try {
    // Ignore chat-message traffic in the activity log: messages already live in
    // the Message collection and should not be repeated in the digest feed,
    // which otherwise gets flooded with every direct/group message.
    if (action === "MESSAGE_SENT" || targetType === "Message") {
      return;
    }

    await ActivityLog.create({ workspace, user, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

const MIN_WINDOW_HOURS = 24;
const MAX_WINDOW_HOURS = 24 * 7; // 168 = 7 days

const clampWindowHours = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return MIN_WINDOW_HOURS;
  return Math.min(MAX_WINDOW_HOURS, Math.max(MIN_WINDOW_HOURS, n));
};

// TESTING ONLY: set DIGEST_TEST_WINDOW_MS in .env (e.g. 120000 for 2 minutes)
// to shrink the bucket size regardless of windowHours, so you can see a new
// digest appear without waiting a full day. Remove/unset for production.
const getWindowMs = (windowHours) => {
  if (process.env.DIGEST_TEST_WINDOW_MS) return Number(process.env.DIGEST_TEST_WINDOW_MS);
  return windowHours * 60 * 60 * 1000;
};

// Fixed, non-overlapping buckets aligned to epoch time. E.g. with windowHours=24,
// every real-world calendar day (UTC) is exactly one bucket, and stays exactly
// one digest document no matter how many times it's regenerated within that day.
const getBucketRange = (windowHours) => {
  const windowMs = getWindowMs(windowHours);
  const bucketStartMs = Math.floor(Date.now() / windowMs) * windowMs;
  return {
    bucketStart: new Date(bucketStartMs),
    bucketEnd: new Date(bucketStartMs + windowMs),
  };
};

// Generates (or refreshes) the digest for the CURRENT bucket only. If a digest
// already exists for this bucket and no new activity has arrived since it was
// last generated, this is a no-op (returns the existing doc, no AI call).
// If new activity has arrived within the same bucket, it re-summarizes ALL
// activity in that bucket (not just the delta) and overwrites the same
// document — so the bucket always has exactly one, up-to-date digest.
export const generateAndSaveDigest = async (workspaceId, windowHours, userId = null) => {
  const { bucketStart, bucketEnd } = getBucketRange(windowHours);

  const currentCount = await ActivityLog.countDocuments({
    workspace: workspaceId,
    createdAt: { $gte: bucketStart, $lt: bucketEnd },
  });

  const existing = await Digest.findOne({ workspace: workspaceId, windowHours, bucketStart });

  if (currentCount === 0) {
    // Nothing has happened in this bucket yet.
    return existing || null;
  }

  if (existing && existing.activityCount === currentCount) {
    // Already up to date for this bucket — skip the AI call entirely.
    return existing;
  }

  const logs = await ActivityLog.find({
    workspace: workspaceId,
    createdAt: { $gte: bucketStart, $lt: bucketEnd },
  })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const digest = await summarizeActivity(logs);

  const saved = await Digest.findOneAndUpdate(
    { workspace: workspaceId, windowHours, bucketStart },
    {
      workspace: workspaceId,
      windowHours,
      bucketStart,
      label: new Date().toLocaleString(),
      groups: digest.groups,
      focus: digest.focus,
      activityCount: logs.length,
      ...(userId ? { generatedBy: userId } : {}),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return saved;
};

// @desc    Get the digest for the current time window. Silently generates or
//          refreshes it in place if there's new activity — no manual trigger needed.
// @route   GET /api/workspaces/:workspaceId/digest?windowHours=24
// @access  Private (any member)
export const getDigest = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const windowHours = clampWindowHours(req.query.windowHours ?? 24);

    const saved = await generateAndSaveDigest(workspaceId, windowHours, req.user?._id);

    if (!saved) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No activity yet.",
      });
    }

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Get digest history for a workspace (each entry is one distinct time
//          window — never duplicated, never re-lists another window's activity)
// @route   GET /api/workspaces/:workspaceId/digest/history?limit=20
// @access  Private (any member)
export const getDigestHistory = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { limit = 20 } = req.query;

    const history = await Digest.find({ workspace: workspaceId })
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 20, 50))
      .lean();

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Raw activity feed (no AI)
// @route   GET /api/workspaces/:workspaceId/activity
export const getActivityFeed = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const logs = await ActivityLog.find({ workspace: workspaceId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};