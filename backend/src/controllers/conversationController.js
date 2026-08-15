import Group from "../models/Group.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Message from "../models/Message.js";

// @desc    List groups the user belongs to + public groups (view-only) + other workspace members (for DMs)
// @route   GET /api/workspaces/:workspaceId/conversations
// @access  Private (any member)
export const getConversations = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const groups = await Group.find({
      workspace: workspaceId,
      $or: [{ isPrivate: false }, { members: userId }],
    }).select("name isPrivate members");

    const memberRows = await WorkspaceMember.find({ workspaceId }).populate(
      "userId",
      "name email"
    );

    const directs = await Promise.all(
      memberRows
        .filter((m) => m.userId && m.userId._id.toString() !== userId)
        .map(async (m) => {
          const otherId = m.userId._id;
          const unreadCount = await Message.countDocuments({
            workspace: workspaceId,
            group: null,
            sender: otherId,
            recipient: userId,
            deleted: false,
            readBy: { $ne: userId },
          });
          return {
            id: otherId,
            type: "dm",
            name: m.userId.name,
            email: m.userId.email,
            unreadCount,
          };
        })
    );

    const groupList = await Promise.all(
      groups.map(async (g) => {
        const isMember = g.members.map(String).includes(userId);
        // Only current members accrue a badge — read-only viewers of a
        // public group don't need an unread nudge the way an active
        // member does.
        const unreadCount = isMember
          ? await Message.countDocuments({
              workspace: workspaceId,
              group: g._id,
              isSystem: false,
              sender: { $ne: userId },
              deleted: false,
              readBy: { $ne: userId },
            })
          : 0;

        return {
          id: g._id,
          type: "group",
          name: g.name,
          isPrivate: g.isPrivate,
          memberCount: g.members.length,
          isMember,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { groups: groupList, directs },
    });
  } catch (error) {
    next(error);
  }
};