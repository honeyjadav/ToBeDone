import Message from "../models/Message.js";

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

  // ---- SEND MESSAGE ----
  socket.on("message:send", async ({ workspaceId, channel, content, attachments }) => {
    try {
      const message = await Message.create({
        workspace: workspaceId,
        channel: channel || "general",
        sender: socket.user.id,
        content,
        attachments: attachments || [],
      });

      const populated = await message.populate("sender", "name email");

      // broadcast to everyone in the workspace room (including sender, for confirmation)
      io.to(workspaceId).emit("message:new", populated);
    } catch (err) {
      socket.emit("message:error", { message: err.message });
    }
  });

  // ---- TYPING INDICATOR ----
  socket.on("typing:start", ({ workspaceId, channel }) => {
    socket.to(workspaceId).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
      typing: true,
    });
  });

  socket.on("typing:stop", ({ workspaceId, channel }) => {
    socket.to(workspaceId).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
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