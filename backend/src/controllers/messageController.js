import Message from "../models/Message.js";
import Group from "../models/Group.js";

// @desc    Get messages — channel, group, or 1:1 DM depending on query
// @route   GET /api/messages/:workspaceId?channel=general | ?groupId=xxx | ?recipientId=xxx
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const {
      channel = "general",
      groupId,
      recipientId,
      limit = 50,
      before,
    } = req.query;

    let query = { workspace: workspaceId };

    if (groupId) {
      const group = await Group.findOne({
        _id: groupId,
        workspace: workspaceId,
      });
      if (!group) {
        res.status(404);
        throw new Error("Group not found");
      }

      const isCurrentMember = group.members.map(String).includes(req.user.id);

      if (group.isPrivate) {
        // PRIVATE group: only current members, or former members capped to
        // what existed before they were removed, can read anything at all.
        const formerEntry = group.formerMembers?.find(
          (f) => f.user.toString() === req.user.id,
        );

        if (!isCurrentMember && !formerEntry) {
          res.status(403);
          throw new Error("You are not a member of this group");
        }

        query.group = groupId;
        if (!isCurrentMember && formerEntry) {
          query.createdAt = {
            ...(query.createdAt || {}),
            $lte: formerEntry.removedAt,
          };
        }
      } else {
        // PUBLIC group: anyone in the workspace can read the full,
        // ongoing history — current member, former member, or someone who
        // was never a member. Sending is separately restricted to current
        // members only (enforced in the message:send socket handler).
        query.group = groupId;
      }
    } else if (recipientId) {
      query.$or = [
        { sender: req.user.id, recipient: recipientId },
        { sender: recipientId, recipient: req.user.id },
      ];
    } else {
      query.channel = channel;
      query.group = null;
      query.recipient = null;
    }

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "name email")
      .populate("systemMeta.actorId", "name")
      .populate("systemMeta.targetId", "name");

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own message
// @route   DELETE /api/messages/:workspaceId/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    if (message.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only delete your own messages",
        });
    }
    await Message.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Moderate another user's message (Admin hard-delete, Manager redact)
// @route   DELETE /api/messages/:workspaceId/:id/moderate
export const moderateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.membership.role;
    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    if (role === "Admin") {
      await Message.deleteOne({ _id: id });
      return res
        .status(200)
        .json({ success: true, message: "Message permanently deleted" });
    }
    message.content = "[message removed by moderator]";
    await message.save();
    res
      .status(200)
      .json({ success: true, message: "Message redacted", data: message });
  } catch (err) {
    next(err);
  }
};