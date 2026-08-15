import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router({ mergeParams: true });

router.get("/", requireWorkspaceMember, getDashboard);

export default router;