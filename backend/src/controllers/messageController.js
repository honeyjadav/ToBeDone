import Message from "../models/Message.js";
import Group from "../models/Group.js";
import { logActivity } from "./activityLogController.js";

// @desc    Get messages — either a plain channel or a group, based on query
// @route   GET /api/messages/:workspaceId?channel=general  OR  ?groupId=xxx
// @access  Private (any member; group messages require group membership)
export const getMessages = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { channel = "general", groupId, limit = 50, before } = req.query;

    let query = { workspace: workspaceId };

    if (groupId) {
      const group = await Group.findOne({ _id: groupId, workspace: workspaceId });
      if (!group) {
        res.status(404);
        throw new Error("Group not found");
      }
      if (group.isPrivate && !group.members.map(String).includes(req.user.id)) {
        res.status(403);
        throw new Error("You are not a member of this group");
      }
      query.group = groupId;
    } else {
      query.channel = channel;
      query.group = null;
    }

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "name email")
      .populate("attachments");

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message via REST (in addition to the socket path)
// @route   POST /api/messages/:workspaceId
// @access  Private (any member; group messages require group membership)
export const sendMessage = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { channel = "general", groupId, content, attachments = [] } = req.body;
    const userId = req.user.id;

    if (!content) {
      res.status(400);
      throw new Error("Message content is required");
    }

    let groupDoc = null;
    if (groupId) {
      groupDoc = await Group.findOne({ _id: groupId, workspace: workspaceId });
      if (!groupDoc) {
        res.status(404);
        throw new Error("Group not found");
      }
      if (!groupDoc.members.map(String).includes(userId)) {
        res.status(403);
        throw new Error("You are not a member of this group");
      }
    }

    const message = await Message.create({
      workspace: workspaceId,
      channel: groupId ? undefined : channel,
      group: groupId || null,
      sender: userId,
      content,
      attachments,
    });

    const populated = await message.populate("sender", "name email");

    logActivity({
      workspace: workspaceId,
      user: userId,
      action: "MESSAGE_SENT",
      targetType: "Message",
      targetId: message._id,
      metadata: {
        channel: groupId ? null : channel,
        groupName: groupDoc?.name || null,
      },
    });

    res.status(201).json({ success: true, message: "Message sent", data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own message
// @route   DELETE /api/messages/:workspaceId/:id
// @access  Private — everyone can only delete their own message
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    await Message.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Moderate (delete/redact) another user's message
// @route   DELETE /api/messages/:workspaceId/:id/moderate
// @access  Private (Admin/Manager only) — Manager redacts, Admin hard-deletes
export const moderateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.membership.role;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (role === "Admin") {
      await Message.deleteOne({ _id: id });
      return res.status(200).json({ success: true, message: "Message permanently deleted" });
    }

    message.content = "[message removed by moderator]";
    await message.save();
    res.status(200).json({ success: true, message: "Message redacted", data: message });
  } catch (err) {
    next(err);
  }
};