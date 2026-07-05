import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import testRoutes from "./routes/testRoutes.js";

// Teammates will import their routes here, e.g.:
// import authRoutes from "./routes/authRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
app.use("/api/test", testRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));