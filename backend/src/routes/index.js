import express from "express";
import authRoutes from "./authRoutes.js";
import testRoutes from "./testRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/test", testRoutes);       // was imported but never used
router.use("/messages", messageRoutes);

export default router;