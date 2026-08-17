export function notificationSocket(io, userId, notification) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit("notification:new", notification);
}