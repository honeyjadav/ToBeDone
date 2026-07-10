import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Teammates will import their routes here, e.g.:
// import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
app.use("/api/test", testRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB first, only start listening once it succeeds.
// (Previously connectDB() and app.listen() ran independently — if the DB
// failed to connect, the server would still come up and every route would
// silently break on first query instead of failing fast at boot.)
connectDB().then(() => {
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );

  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});