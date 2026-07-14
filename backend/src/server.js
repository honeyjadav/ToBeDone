import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/index.js";
import config from "./config/index.js";

const server = http.createServer(app);

initSocket(server); // attaches socket.io to the same HTTP server

connectDB()
  .then(() => {
    server.listen(config.port, () =>
      console.log(`Server running on port ${config.port} (HTTP + Socket.io)`)
    );

    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });