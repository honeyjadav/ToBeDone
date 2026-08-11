import Message from "../models/Message.js";

export const getMessages = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { channel = "general", limit = 50, before } = req.query;

    const query = { workspace: workspaceId, channel };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "name email")
      .populate("attachments");

    res.json(messages.reverse()); // oldest first for UI rendering
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own message
// @route   DELETE /api/messages/:workspaceId/:id
// @access  Private — O/O/O: everyone (Admin/Manager/Member) can only delete
// their own message. Moderation of OTHERS' messages is a separate endpoint
// below, gated to Admin/Manager per the matrix.
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

// @desc    Moderate (delete) another user's message
// @route   DELETE /api/messages/:workspaceId/:id/moderate
// @access  Private (Admin/Manager only) — F/L/—.
// Manager gets "Limited": soft-action only (message content is redacted,
// not permanently purged); Admin can hard-delete.
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

    // Manager: soft-moderate — redact content, keep the record for audit.
    message.content = "[message removed by moderator]";
    await message.save();
    res.status(200).json({ success: true, message: "Message redacted", data: message });
  } catch (err) {
    next(err);
  }
};