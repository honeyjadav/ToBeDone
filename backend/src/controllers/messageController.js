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

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};