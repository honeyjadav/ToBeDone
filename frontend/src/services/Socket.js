import { io } from "socket.io-client";
import { LOCAL_STORAGE_KEYS } from "../constants/Constants";

let socket = null;

export function connectSocket() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
    withCredentials: true,
    autoConnect: true,
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}