import Group from "../models/Group.js";
import WorkspaceMember from "../models/WorkspaceMember.js";

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

    const directs = memberRows
      .filter((m) => m.userId && m.userId._id.toString() !== userId)
      .map((m) => ({
        id: m.userId._id,
        type: "dm",
        name: m.userId.name,
        email: m.userId.email,
      }));

    const groupList = groups.map((g) => {
      const isMember = g.members.map(String).includes(userId);
      return {
        id: g._id,
        type: "group",
        name: g.name,
        isPrivate: g.isPrivate,
        memberCount: g.members.length,
        // Whether the requesting user can currently post here.
        // - Private groups: only listed for members, so this is always true.
        // - Public groups: listed for everyone in the workspace, but only
        //   actual members can post. Non-members (including anyone who was
        //   removed) get isMember: false -> read-only view on the frontend.
        isMember,
      };
    });

    res.status(200).json({
      success: true,
      data: { groups: groupList, directs },
    });
  } catch (error) {
    next(error);
  }
};