import express from "express";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspaceController.js";
import {
  getWorkspaceMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/workspaceMemberController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createWorkspaceSchema } from "../validators/workspaceValidator.js";
import {
  requireWorkspaceRole,
  requireWorkspaceMember,
} from "../middleware/workspaceAuth.js";
import taskRoutes from "./taskRoutes.js";
import activityLogRoutes from "./activityLogRoutes.js";
import groupRoutes from "./groupRoutes.js";
const router = express.Router();

router.use(protect);

router.post("/", validate(createWorkspaceSchema), createWorkspace);
router.get("/", getMyWorkspaces);

// Get a single workspace — any member can view
router.get("/:workspaceId", requireWorkspaceMember, getWorkspaceById);

// Admin only
router.patch("/:workspaceId", requireWorkspaceRole("Admin"), updateWorkspace);
router.delete("/:workspaceId", requireWorkspaceRole("Admin"), deleteWorkspace);

// Member management
router.get("/:workspaceId/members", requireWorkspaceMember, getWorkspaceMembers);
router.patch("/:workspaceId/members/:memberId/role", requireWorkspaceRole("Admin"), updateMemberRole);
router.delete("/:workspaceId/members/:memberId", requireWorkspaceRole("Admin"), removeMember);

router.use("/:workspaceId/tasks", taskRoutes);
router.use("/:workspaceId", activityLogRoutes);
router.use("/:workspaceId/groups", groupRoutes);

export default router;