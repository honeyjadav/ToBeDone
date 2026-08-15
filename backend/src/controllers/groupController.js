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

    res
      .status(201)
      .json({
        success: true,
        message: "Group created successfully",
        data: group,
      });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(
        new Error("A group with this name already exists in this workspace"),
      );
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

    const group = await Group.findOne({
      _id: groupId,
      workspace: workspaceId,
    }).populate("members", "name email");
    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }

    if (
      group.isPrivate &&
      !group.members.some((m) => m._id.toString() === userId)
    ) {
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

    const isWorkspaceMember = await WorkspaceMember.findOne({
      workspaceId,
      userId: newUserId,
    });
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

    const Message = (await import("../models/Message.js")).default;
    const sysMsg = await Message.create({
      workspace: workspaceId,
      group: groupId,
      sender: requesterId,
      content: "added a member", // fallback only; frontend renders from systemMeta
      isSystem: true,
      systemMeta: {
        type: "member_added",
        actorId: requesterId,
        targetId: newUserId,
      },
    });
    const populatedSys = await sysMsg.populate([
      { path: "sender", select: "name email" },
      { path: "systemMeta.actorId", select: "name" },
      { path: "systemMeta.targetId", select: "name" },
    ]);

    const io = (await import("../sockets/index.js")).getIO();
    io.to(`group:${groupId}`).emit("message:new", populatedSys);

    res
      .status(200)
      .json({ success: true, message: "Member added to group", data: group });
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
    // Only matters for PRIVATE groups — used to cap how far back a former
    // member can read. Public groups never consult this: removal from a
    // public group just demotes someone to the same read-only view every
    // other workspace member already has, with full ongoing visibility.
    group.formerMembers.push({ user: targetUserId, removedAt: new Date() });
    await group.save();

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "GROUP_MEMBER_REMOVED",
      targetType: "Group",
      targetId: group._id,
      metadata: {
        groupName: group.name,
        removedUser: targetUserId,
        selfLeave: isSelfLeave,
      },
    });

    const Message = (await import("../models/Message.js")).default;
    const sysMsg = await Message.create({
      workspace: workspaceId,
      group: groupId,
      sender: requesterId,
      content: isSelfLeave ? "left the group" : "removed a member", // fallback only
      isSystem: true,
      systemMeta: {
        type: isSelfLeave ? "member_left" : "member_removed",
        actorId: requesterId,
        targetId: targetUserId,
      },
    });
    const populatedSys = await sysMsg.populate([
      { path: "sender", select: "name email" },
      { path: "systemMeta.actorId", select: "name" },
      { path: "systemMeta.targetId", select: "name" },
    ]);

    const io = (await import("../sockets/index.js")).getIO();
    io.to(`group:${groupId}`).emit("message:new", populatedSys);
    io.to(`user:${targetUserId}`).emit("message:new", populatedSys);

    if (group.isPrivate) {
      // PRIVATE group: full hard cutoff. Tell the removed user's client to
      // stop treating this as a live/readable thread, and force their
      // socket out of the room so they can't keep receiving live
      // broadcasts via a stale subscription.
      io.to(`user:${targetUserId}`).emit("group:removed", { groupId, isPrivate: true });
      io.in(`user:${targetUserId}`).socketsLeave(`group:${groupId}`);
    } else {
      // PUBLIC group: no hard cutoff. The removed user keeps read access
      // (same as any other workspace member) — just tell their client to
      // refresh so the sidebar/composer reflect isMember: false.
      io.to(`user:${targetUserId}`).emit("group:demoted", { groupId, isPrivate: false });
    }

    res
      .status(200)
      .json({ success: true, message: "Member removed from group" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a group entirely (creator only)
// @route   DELETE /api/workspaces/:workspaceId/groups/:groupId
// @access  Private (creator only)
export const deleteGroup = async (req, res, next) => {
  try {
    const { workspaceId, groupId } = req.params;
    const requesterId = req.user.id;

    const group = await Group.findOne({ _id: groupId, workspace: workspaceId });
    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }
    if (group.createdBy.toString() !== requesterId) {
      res.status(403);
      throw new Error("Only the group creator can delete this group");
    }

    const memberIds = group.members.map(String);
    await group.deleteOne();

    const Message = (await import("../models/Message.js")).default;
    await Message.deleteMany({ workspace: workspaceId, group: groupId });

    logActivity({
      workspace: workspaceId,
      user: requesterId,
      action: "GROUP_DELETED",
      targetType: "Group",
      targetId: group._id,
      metadata: { name: group.name },
    });

    const io = (await import("../sockets/index.js")).getIO();
    // Notify anyone who was a member directly, plus anyone currently
    // viewing the group's socket room (public-group viewers included).
    memberIds.forEach((uid) => io.to(`user:${uid}`).emit("group:deleted", { groupId }));
    io.to(`group:${groupId}`).emit("group:deleted", { groupId });

    res.status(200).json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    next(error);
  }
};