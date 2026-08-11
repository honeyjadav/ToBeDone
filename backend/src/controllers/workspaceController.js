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
      owner: userId,
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

// @desc    Update workspace details (name, description, logo)
// @route   PATCH /api/workspaces/:workspaceId
// @access  Private (Admin only)
export const updateWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, logo } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      res.status(404);
      throw new Error("Workspace not found");
    }

    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (logo !== undefined) workspace.logo = logo;

    await workspace.save();

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: {
        workspaceId: workspace._id,
        name: workspace.name,
        description: workspace.description,
        logo: workspace.logo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workspace (and its memberships)
// @route   DELETE /api/workspaces/:workspaceId
// @access  Private (Admin only)
export const deleteWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      res.status(404);
      throw new Error("Workspace not found");
    }

    await WorkspaceMember.deleteMany({ workspaceId });
    await Workspace.deleteOne({ _id: workspaceId });

    // NOTE: Tasks / Messages / Notifications / WorkflowRules tied to this
    // workspace are intentionally left for a separate cascade-cleanup job
    // (or cascade here once those controllers/cleanup policy are finalized).

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};