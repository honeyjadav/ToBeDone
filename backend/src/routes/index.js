import express from "express";
import authRoutes from "./authRoutes.js";
import testRoutes from "./testRoutes.js";
import messageRoutes from "./messageRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import inviteRoutes from "./inviteRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/invites", inviteRoutes);
router.use("/messages", messageRoutes);
router.use("/test", testRoutes);

export default router;