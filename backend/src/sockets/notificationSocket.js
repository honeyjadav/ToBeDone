// sockets/notificationSocket.js

export function notificationSocket(io, userId, notification) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit("notification:new", notification);
}

/**
 * Notify a user that one notification was marked as read.
 */
export function notificationReadSocket(io, userId, notification) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit("notification:read", {
    notificationId:
      notification.notificationId || notification._id || notification.id,
    workspace: notification.workspace,
    isRead: true,
  });
}

/**
 * Notify a user that all notifications
 * in a workspace were marked as read.
 */
export function notificationReadAllSocket(io, userId, workspaceId) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit("notifications:read-all", {
    workspaceId,
  });
}

/**
 * Notify frontend that read notifications
 * were deleted/cleared.
 */
export function notificationClearReadSocket(io, userId, workspaceId) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit("notifications:clear-read", {
    workspaceId,
  });
}