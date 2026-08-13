import ActivityLog from "../models/Activitylog.js";
import { summarizeActivity } from "../services/aiSummaryService.js";

export const logActivity = async ({ workspace, user, action, targetType, targetId, metadata = {} }) => {
  try {
    await ActivityLog.create({ workspace, user, action, targetType, targetId, metadata });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

// @desc    Generate an AI digest from recent logs
// @route   GET /api/workspaces/:workspaceId/digest?period=24h
// @access  Private (any member)
export const getDigest = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { period = "24h" } = req.query;

    const since = new Date();
    if (period === "week") since.setDate(since.getDate() - 7);
    else since.setDate(since.getDate() - 1);

    const logs = await ActivityLog.find({
      workspace: workspaceId,
      createdAt: { $gte: since },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const digest = await summarizeActivity(logs);

    await ActivityLog.updateMany(
      { _id: { $in: logs.map((l) => l._id) } },
      { $set: { includedInDigest: true } }
    );

    res.status(200).json({
      success: true,
      data: {
        label: new Date().toLocaleString(),
        period: period === "week" ? "This Week" : "Last 24h",
        groups: digest.groups,
        focus: digest.focus,
      },
    });
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