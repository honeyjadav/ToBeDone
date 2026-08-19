import Message from "../models/Message.js";
import Group from "../models/Group.js";
import { logActivity } from "../controllers/activityLogController.js";
import {notifyUsers} from "../utils/notify.js"

function truncate(content, maxLength = 100) {
  return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
}

export function registerChatHandlers(io, socket, workspacePresence) {
  // ---- JOIN WORKSPACE ROOM (+ personal room for DM delivery) ----
  socket.on("workspace:join", async ({ workspaceId }) => {
    socket.join(workspaceId);
    socket.join(`user:${socket.user.id}`);
    socket.data.workspaceId = workspaceId;
    socket.data.activeChatRoom = null; // ✅ Track active chat

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
  
  // ---- TRACK ACTIVE CHAT ROOM ----
  // Call this when opening a 1:1 DM
  socket.on("chat:open", ({ recipientId, groupId }) => {
    if (recipientId) {
      socket.data.activeChatRoom = `dm:${[socket.user.id, recipientId].sort().join("_")}`;
      socket.join(socket.data.activeChatRoom);
    } else if (groupId) {
      socket.data.activeChatRoom = `group:${groupId}`;
      socket.join(socket.data.activeChatRoom);
    }
  });

  // Call this when closing a DM
  socket.on("chat:close", () => {
    if (socket.data.activeChatRoom) {
      socket.leave(socket.data.activeChatRoom);
      socket.data.activeChatRoom = null;
    }
  });
  
  // ---- JOIN / LEAVE A GROUP ROOM ----
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
socket.on(
  "message:send",
  async ({
    workspaceId,
    channel,
    groupId,
    recipientId,
    content,
  }) => {
    try {
      let groupDoc = null;

      // ============================================================
      // VALIDATE GROUP
      // ============================================================

      if (groupId) {
        groupDoc = await Group.findById(groupId);

        if (
          !groupDoc ||
          !groupDoc.members
            .map(String)
            .includes(socket.user.id.toString())
        ) {
          return socket.emit("message:error", {
            message:
              "You must be a member of this group to send messages",
          });
        }
      }

      // ============================================================
      // CREATE MESSAGE
      // ============================================================

      const message = await Message.create({
        workspace: workspaceId,

        channel:
          groupId || recipientId
            ? undefined
            : channel || "general",

        group: groupId || null,
        recipient: recipientId || null,
        sender: socket.user.id,
        content,
      });

      console.log("========== MESSAGE CREATED ==========");
      console.log("Message ID:", message._id);
      console.log("Workspace:", workspaceId);
      console.log("Group:", groupId || null);
      console.log("Recipient:", recipientId || null);
      console.log("Sender:", socket.user.id);
      console.log("====================================");

      // ============================================================
      // POPULATE SENDER
      // ============================================================

      const populated = await message.populate(
        "sender",
        "name email"
      );

      // ============================================================
      // REAL-TIME MESSAGE DELIVERY
      // ============================================================

      if (groupId) {
        // Group message

        io.to(`group:${groupId}`).emit(
          "message:new",
          populated
        );
      } else if (recipientId) {
        // Personal / DM message

        io
          .to(`user:${recipientId}`)
          .to(`user:${socket.user.id}`)
          .emit("message:new", populated);
      } else {
        // Workspace / channel message

        io.to(workspaceId).emit(
          "message:new",
          populated
        );
      }

      // ============================================================
      // MESSAGE PREVIEW
      // ============================================================

      const preview = truncate(content);

      // ============================================================
      // PERSONAL / DIRECT MESSAGE NOTIFICATION
      // ============================================================

      if (recipientId) {
        const dmRoomId =
          `dm:${[
            socket.user.id,
            recipientId,
          ]
            .sort()
            .join("_")}`;

        const dmSockets =
          await io
            .in(dmRoomId)
            .fetchSockets();

        const isRecipientViewingDM =
          dmSockets.some(
            (s) =>
              s.user.id.toString() ===
              recipientId.toString()
          );

        console.log(
          "========== DM NOTIFICATION =========="
        );

        console.log("Message ID:", message._id);
        console.log("DM Room:", dmRoomId);
        console.log("Recipient:", recipientId);
        console.log(
          "Recipient viewing:",
          isRecipientViewingDM
        );

        console.log(
          "====================================="
        );

        // Don't create notification if
        // recipient is already viewing this DM
        if (!isRecipientViewingDM) {
          await notifyUsers({
  userIds: [recipientId],
  actorId: socket.user.id,
  workspace: workspaceId,
  title: `New message from ${socket.user.name}`,
  summary: preview,

  chatData: {
    type: "DM",
    userId: socket.user.id.toString(),
    messageId: message._id.toString(),
  },
});

          console.log(
            "✅ Personal message notification created"
          );
        }
      }

      // ============================================================
      // GROUP MESSAGE NOTIFICATION
      // ============================================================

      else if (groupId && groupDoc) {
        const groupRoomId =
          `group:${groupId}`;

        const groupSockets =
          await io
            .in(groupRoomId)
            .fetchSockets();

        const activeUserIds =
          new Set(
            groupSockets.map((s) =>
              s.user.id.toString()
            )
          );

        // Find members who are NOT
        // currently viewing this group
        const usersToNotify =
          groupDoc.members.filter(
            (memberId) =>
              !activeUserIds.has(
                memberId.toString()
              ) &&
              memberId.toString() !==
                socket.user.id.toString()
          );

        console.log(
          "========== GROUP NOTIFICATION =========="
        );

        console.log("Message ID:", message._id);
        console.log("Group ID:", groupId);
        console.log("Group Name:", groupDoc.name);

        console.log(
          "Users to notify:",
          usersToNotify.map(String)
        );

        console.log(
          "========================================="
        );

        if (usersToNotify.length > 0) {
          await notifyUsers({
          userIds: usersToNotify,
          actorId: socket.user.id,
          workspace: workspaceId,
          title: `New message in ${groupDoc.name}`,
          summary: `${socket.user.name} sent: "${preview}"`,

          chatData: {
            type: "GROUP",
            groupId: groupId.toString(),
            messageId: message._id.toString(),
          },
        });

          console.log(
            `✅ Group notification created for ${usersToNotify.length} user(s)`
          );
        }
      }

      // ============================================================
      // NORMAL CHANNEL MESSAGE
      // ============================================================

      else {
        console.log(
          "[CHAT] Channel message - no notification created"
        );
      }

    } catch (err) {
      console.error(
        "Message send error:",
        err
      );

      socket.emit(
        "message:error",
        {
          message: err.message,
        }
      );
    }
  }
);


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