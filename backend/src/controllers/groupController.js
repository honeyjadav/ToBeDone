import Group from "../models/Group.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import { logActivity } from "./activityLogController.js";

// @desc    Create a group within a workspace
// @route   POST /api/workspaces/:workspaceId/groups
// @access  Private (any member)
export const createGroup = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { name, isPrivate = true, members = [] } = req.body;
    const userId = req.user.id;

    if (!name) {
      res.status(400);
      throw new Error("Group name is required");
    }

    // Creator is always a member; dedupe any passed-in members
    const memberSet = new Set([userId, ...members.map(String)]);

    const group = await Group.create({
      workspace: workspaceId,
      name,
      isPrivate,
      members: Array.from(memberSet),
      createdBy: userId,
    });

    logActivity({
      workspace: workspaceId,
      user: userId,
      action: "GROUP_CREATED",
      targetType: "Group",
      targetId: group._id,
      metadata: { name: group.name, memberCount: group.members.length },
    });

    res.status(201).json({ success: true, message: "Group created successfully", data: group });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error("A group with this name already exists in this workspace"));
    }
    next(error);
  }
};

// @desc    List groups the requester belongs to (or all public groups + their private ones)
// @route   GET /api/workspaces/:workspaceId/groups
// @access  Private (any member)
export const getGroups = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const groups = await Group.find({
      workspace: workspaceId,
      $or: [{ isPrivate: false }, { members: userId }],
    })
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single group (must be a member if private)
// @route   GET /api/workspaces/:workspaceId/groups/:groupId
// @access  Private
export const getGroupById = async (req, res, next) => {
  try {
    const { workspaceId, groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findOne({ _id: groupId, workspace: workspaceId }).populate(
      "members",
      "name email"
    );
    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }

    if (group.isPrivate && !group.members.some((m) => m._id.toString() === userId)) {
      res.status(403);
      throw new Error("You are not a member of this group");
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to a group
// @route   POST /api/workspaces/:workspaceId/groups/:groupId/members
// @access  Private (group members only — anyone in the group can add others)
export const addGroupMember = async (req, res, next) => {
  try {
    const { workspaceId, groupId } = req.params;
    const { userId: newUserId } = req.body;
    const requesterId = req.user.id;

    if (!newUserId) {
      res.status(400);
      throw new Error("userId is required");
    }

    const group = await Group.findOne({ _id: groupId, workspace: workspaceId });
    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }

    if (!group.members.map(String).includes(requesterId)) {
      res.status(403);
      throw new Error("Only existing group members can add others");
    }

    // Must be a workspace member to be added to a group
    const isWorkspaceMember = await WorkspaceMember.findOne({ workspaceId, userId: newUserId });
    if (!isWorkspaceMember) {
      res.status(400);
      throw new Error("User must be a workspace member to join a group");
    }

    if (group.members.map(String).includes(newUserId)) {
      res.status(400);
      throw new Error("User is already in this group");
    }

    group.members.push(newUserId);
    await group.save();

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "GROUP_MEMBER_ADDED",
      targetType: "Group",
      targetId: group._id,
      metadata: { groupName: group.name, addedUser: newUserId },
    });

    res.status(200).json({ success: true, message: "Member added to group", data: group });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a group (self-leave, or creator removing someone)
// @route   DELETE /api/workspaces/:workspaceId/groups/:groupId/members/:userId
// @access  Private
export const removeGroupMember = async (req, res, next) => {
  try {
    const { workspaceId, groupId, userId: targetUserId } = req.params;
    const requesterId = req.user.id;

    const group = await Group.findOne({ _id: groupId, workspace: workspaceId });
    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }

    const isSelfLeave = requesterId === targetUserId;
    const isCreator = group.createdBy.toString() === requesterId;

    if (!isSelfLeave && !isCreator) {
      res.status(403);
      throw new Error("Only the group creator can remove other members");
    }

    if (!group.members.map(String).includes(targetUserId)) {
      res.status(400);
      throw new Error("User is not in this group");
    }

    group.members = group.members.filter((m) => m.toString() !== targetUserId);
    await group.save();

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "GROUP_MEMBER_REMOVED",
      targetType: "Group",
      targetId: group._id,
      metadata: { groupName: group.name, removedUser: targetUserId, selfLeave: isSelfLeave },
    });

    res.status(200).json({ success: true, message: "Member removed from group" });
  } catch (error) {
    next(error);
  }
};