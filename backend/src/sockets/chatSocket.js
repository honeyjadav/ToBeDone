import Message from "../models/Message.js";
import Group from "../models/Group.js";
import { logActivity } from "../controllers/activityLogController.js";

export function registerChatHandlers(io, socket, workspacePresence) {
  // ---- JOIN WORKSPACE ROOM (+ personal room for DM delivery) ----
  socket.on("workspace:join", async ({ workspaceId }) => {
    socket.join(workspaceId);
    socket.join(`user:${socket.user.id}`);
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
  // Members of the group can always join (to send + receive live).
  // Non-members may ALSO join if the group is public — this only grants
  // them live delivery of messages (read-only); it does NOT grant posting
  // rights, which are checked separately in message:send below.
  socket.on("group:join", async ({ groupId }) => {
    const group = await Group.findById(groupId);
    if (!group) {
      return socket.emit("message:error", { message: "Group not found" });
    }
    const isMember = group.members.map(String).includes(socket.user.id);
    if (group.isPrivate && !isMember) {
      return socket.emit("message:error", { message: "Not authorized to join this group" });
    }
    socket.join(`group:${groupId}`);
  });

  socket.on("group:leave", ({ groupId }) => {
    socket.leave(`group:${groupId}`);
  });

  // ---- SEND MESSAGE (channel OR group OR 1:1 DM) ----
  socket.on("message:send", async ({ workspaceId, channel, groupId, recipientId, content }) => {
    try {
      let groupDoc = null;

      if (groupId) {
        groupDoc = await Group.findById(groupId);
        // Posting always requires current membership, regardless of
        // isPrivate. A public group can be viewed by anyone in the
        // workspace, but only members may send — this is the one place
        // that's actually enforced, since the frontend UI just hides the
        // composer as a convenience.
        if (!groupDoc || !groupDoc.members.map(String).includes(socket.user.id)) {
          return socket.emit("message:error", { message: "You must be a member of this group to send messages" });
        }
      }

      const message = await Message.create({
        workspace: workspaceId,
        channel: groupId || recipientId ? undefined : channel || "general",
        group: groupId || null,
        recipient: recipientId || null,
        sender: socket.user.id,
        content,
      });

      const populated = await message.populate("sender", "name email");

      if (groupId) {
        // Broadcasts to everyone currently in the room — which now
        // includes public-group viewers who joined via group:join above.
        io.to(`group:${groupId}`).emit("message:new", populated);
      } else if (recipientId) {
        io.to(`user:${recipientId}`).to(`user:${socket.user.id}`).emit("message:new", populated);
      } else {
        io.to(workspaceId).emit("message:new", populated);
      }

    } catch (err) {
      socket.emit("message:error", { message: err.message });
    }
  });

  // ---- UNSEND MESSAGE (soft delete, real-time) ----
  socket.on("message:delete", async ({ messageId, groupId, recipientId, workspaceId }) => {
    const message = await Message.findById(messageId);
    if (!message) return;
    if (message.sender.toString() !== socket.user.id) {
      return socket.emit("message:error", { message: "You can only unsend your own messages" });
    }

    message.content = "This message was unsent";
    message.deleted = true;
    await message.save();

    const room = groupId ? `group:${groupId}` : workspaceId;
    const target = recipientId
      ? io.to(`user:${recipientId}`).to(`user:${socket.user.id}`)
      : io.to(room);
    target.emit("message:deleted", { messageId, content: message.content });
  });

  // ---- TYPING INDICATOR ----
  socket.on("typing:start", ({ workspaceId, channel, groupId, recipientId }) => {
    const room = groupId ? `group:${groupId}` : recipientId ? `user:${recipientId}` : workspaceId;
    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
      groupId,
      recipientId,
      typing: true,
    });
  });

  socket.on("typing:stop", ({ workspaceId, channel, groupId, recipientId }) => {
    const room = groupId ? `group:${groupId}` : recipientId ? `user:${recipientId}` : workspaceId;
    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      name: socket.user.name,
      channel,
      groupId,
      recipientId,
      typing: false,
    });
  });

  // ---- READ RECEIPTS ----
  socket.on("message:read", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: socket.user.id } });
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