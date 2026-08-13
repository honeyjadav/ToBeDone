import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerChatHandlers } from "./chatSocket.js";

let io;

// track online users per workspace: { workspaceId: { socketId: { userId, name } } }
const workspacePresence = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Real JWT auth — client must connect with:
  // io(url, { auth: { token: "<accessToken>" } })
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        return next(new Error("Invalid or expired token"));
      }

      const user = await User.findById(decoded.id).select("name email");
      if (!user) {
        return next(new Error("User no longer exists"));
      }

      socket.user = { id: user._id.toString(), name: user.name };
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
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

  delete workspacePresence[workspaceId][socket.id];

  if (Object.keys(workspacePresence[workspaceId]).length === 0) {
    delete workspacePresence[workspaceId];
  } else {
    io.to(workspaceId).emit(
      "presence:update",
      Object.values(workspacePresence[workspaceId])
    );
  }

  io.to(workspaceId).emit("user:left", { userId: socket.user.id });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}