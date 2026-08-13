import WorkspaceMember from "../models/WorkspaceMember.js";
import { logActivity } from "./activityLogController.js";

// @desc    List all members of a workspace
// @route   GET /api/workspaces/:workspaceId/members
// @access  Private (any member)
export const getWorkspaceMembers = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const members = await WorkspaceMember.find({ workspaceId })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });

    const data = members.map((m) => ({
      memberId: m.memberId,
      userId: m.userId?._id,
      name: m.userId?.name,
      email: m.userId?.email,
      role: m.role,
      joinedAt: m.createdAt,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Change a member's role within a workspace
// @route   PATCH /api/workspaces/:workspaceId/members/:memberId/role
// @access  Private (Admin only)
export const updateMemberRole = async (req, res, next) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    if (!["Admin", "Manager", "Member"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    const membership = await WorkspaceMember.findOne({ memberId, workspaceId });
    if (!membership) {
      res.status(404);
      throw new Error("Member not found in this workspace");
    }

    const oldRole = membership.role;

    if (role === "Admin" && membership.role !== "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({ workspaceId, role: "Admin" });
      if (adminCount >= 2) {
        res.status(400);
        throw new Error("This workspace already has the maximum of 2 Admins");
      }
    }

    if (membership.role === "Admin" && role !== "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({ workspaceId, role: "Admin" });
      if (adminCount <= 1) {
        res.status(400);
        throw new Error("Cannot demote the only remaining Admin of this workspace");
      }
    }

    membership.role = role;
    await membership.save();

    logActivity({
      workspace: workspaceId,
      user: req.user.id, // the Admin who made the change
      action: "MEMBER_ROLE_CHANGED",
      targetType: "Membership",
      targetId: membership._id,
      metadata: { targetUser: membership.userId, oldRole, newRole: role },
    });

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: { memberId: membership.memberId, role: membership.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a workspace
// @route   DELETE /api/workspaces/:workspaceId/members/:memberId
// @access  Private (Admin only)
export const removeMember = async (req, res, next) => {
  try {
    const { workspaceId, memberId } = req.params;

    const membership = await WorkspaceMember.findOne({ memberId, workspaceId });
    if (!membership) {
      res.status(404);
      throw new Error("Member not found in this workspace");
    }

    if (membership.role === "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({ workspaceId, role: "Admin" });
      if (adminCount <= 1) {
        res.status(400);
        throw new Error("Cannot remove the only remaining Admin of this workspace");
      }
    }

    await WorkspaceMember.deleteOne({ _id: membership._id });

    // Note: logged BEFORE targetId would be invalid — membership doc is gone,
    // so we log the userId/role in metadata instead of relying on targetId lookup later.
    logActivity({
      workspace: workspaceId,
      user: req.user.id,
      action: "MEMBER_REMOVED",
      targetType: "Membership",
      targetId: membership._id,
      metadata: { targetUser: membership.userId, removedRole: membership.role, removed: true },
    });

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};