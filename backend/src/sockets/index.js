import { Server } from "socket.io";
import { registerChatHandlers } from "./chatSocket.js";

let io;

// track online users per workspace: { workspaceId: { socketId: { userId, name } } }
const workspacePresence = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // TEMP AUTH — no login system yet.
  // Client must send { userId, name } manually until real JWT auth is ready.
  // TODO: replace with real JWT verification once authController/login is done.
 // backend/src/sockets/index.js
io.use((socket, next) => {
  const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
  const name = socket.handshake.auth?.name || socket.handshake.query?.name;

  if (!userId) return next(new Error("userId required (temp auth)"));

  socket.user = { id: userId, name: name || "Anonymous" };
  next();
});

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, socket.user);

    registerChatHandlers(io, socket, workspacePresence);

    socket.on("disconnect", () => {
      handleDisconnect(io, socket, workspacePresence);
    });
  });

  return io;
}

function handleDisconnect(io, socket, workspacePresence) {
  const workspaceId = socket.data.workspaceId;
  if (!workspaceId || !workspacePresence[workspaceId]) return;

  // 1. Remove the user from presence tracking
  delete workspacePresence[workspaceId][socket.id];

  // 2. Clean up the workspace object if it's completely empty
  if (Object.keys(workspacePresence[workspaceId]).length === 0) {
    delete workspacePresence[workspaceId];
  } else {
    // 3. Broadcast updated list to remaining users
    io.to(workspaceId).emit(
      "presence:update",
      Object.values(workspacePresence[workspaceId])
    );
  }

  // FIXED: Changed 'socket.to' to 'io.to' because the individual socket is dead
  io.to(workspaceId).emit("user:left", { userId: socket.user.id });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}