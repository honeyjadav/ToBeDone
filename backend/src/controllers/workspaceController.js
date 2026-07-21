import Workspace from "../models/Workspace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";

// @desc    Create a new workspace. Creator automatically becomes Admin.
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const workspace = await Workspace.create({
      name,
      createdBy: userId,
    });

    const membership = await WorkspaceMember.create({
      userId,
      workspaceId: workspace._id,
      role: "Admin",
    });

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: {
        workspaceId: workspace._id,
        name: workspace.name,
        role: membership.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workspaces the logged-in user belongs to
// @route   GET /api/workspaces
// @access  Private
export const getMyWorkspaces = async (req, res, next) => {
  try {
    const memberships = await WorkspaceMember.find({ userId: req.user.id }).populate(
      "workspaceId",
      "name"
    );

    const workspaces = memberships.map((m) => ({
      workspaceId: m.workspaceId._id,
      name: m.workspaceId.name,
      role: m.role,
    }));

    res.status(200).json({ success: true, data: workspaces });
  } catch (error) {
    next(error);
  }
};