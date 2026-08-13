import Message from "../models/Message.js";
import Group from "../models/Group.js";
import { logActivity } from "../controllers/activityLogController.js";

export function registerChatHandlers(io, socket, workspacePresence) {
  // ---- JOIN WORKSPACE ROOM ----
  socket.on("workspace:join", async ({ workspaceId }) => {
    socket.join(workspaceId);
    socket.data.workspaceId = workspaceId;

    workspacePresence[workspaceId] = workspacePresence[workspaceId] || {};
    workspacePresence[workspaceId][socket.id] = {
      userId: socket.user.id,
      name: socket.user.name,
    };

    socket.to(workspaceId).emit("user:joined", {
      userId: socket.user.id,
      name: socket.user.name,
    });

    io.to(workspaceId).emit(
      "presence:update",
      Object.values(workspacePresence[workspaceId])
    );
  });

  // ---- JOIN / LEAVE A GROUP ROOM ----
  socket.on("group:join", async ({ groupId }) => {
    const group = await Group.findById(groupId);
    if (!group || !group.members.map(String).includes(socket.user.id)) {
      return socket.emit("message:error", { message: "Not authorized to join this group" });
    }
    socket.join(`group:${groupId}`);
  });

  socket.on("group:leave", ({ groupId }) => {
    socket.leave(`group:${groupId}`);
  });

  // ---- SEND MESSAGE (channel OR group) ----
  socket.on("message:send", async ({ workspaceId, channel, groupId, content, attachments }) => {
    try {
      let groupDoc = null;

      if (groupId) {
        groupDoc = await Group.findById(groupId);
        if (!groupDoc || !groupDoc.members.map(String).includes(socket.user.id)) {
          return socket.emit("message:error", { message: "Not authorized to post in this group" });
        }
      }

      const message = await Message.create({
        workspace: workspaceId,
        channel: groupId ? undefined : channel || "general",
        group: groupId || null,
        sender: socket.user.id,
        content,
        attachments: attachments || [],
      });

      const populated = await message.populate("sender", "name email");

      if (groupId) {
        io.to(`group:${groupId}`).emit("message:new", populated);
      } else {
        io.to(workspaceId).emit("message:new", populated);
      }

      logActivity({
        workspace: workspaceId,
        user: socket.user.id,
        action: "MESSAGE_SENT",
        targetType: "Message",
        targetId: message._id,
        metadata: { channel: groupId ? null : channel, groupName: groupDoc?.name || null },
      });
    } catch (err) {
      socket.emit("message:error", { message: err.message });
    }
  });

  // ---- TYPING INDICATOR ----
  socket.on("typing:start", ({ workspaceId, channel, groupId }) => {
    const room = groupId ? `group:${groupId}` : workspaceId;
    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
      groupId,
      typing: true,
    });
  });

  socket.on("typing:stop", ({ workspaceId, channel, groupId }) => {
    const room = groupId ? `group:${groupId}` : workspaceId;
    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
      groupId,
      typing: false,
    });
  });

  // ---- READ RECEIPTS ----
  socket.on("message:read", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: socket.user.id },
    });
    socket.to(socket.data.workspaceId).emit("message:read", {
      messageId,
      userId: socket.user.id,
    });
  });

  // ---- LEAVE WORKSPACE ----
  socket.on("workspace:leave", ({ workspaceId }) => {
    socket.leave(workspaceId);
    if (workspacePresence[workspaceId]) {
      delete workspacePresence[workspaceId][socket.id];
      io.to(workspaceId).emit(
        "presence:update",
        Object.values(workspacePresence[workspaceId] || {})
      );
    }
  });
}