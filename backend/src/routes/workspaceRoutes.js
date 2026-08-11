import express from "express";
import {
  createWorkspace,
  getMyWorkspaces,
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

const router = express.Router();

// every route below requires a logged-in user
router.use(protect);

router.post("/", validate(createWorkspaceSchema), createWorkspace);
router.get("/", getMyWorkspaces);

// F/—/— (Admin only)
router.patch("/:workspaceId", requireWorkspaceRole("Admin"), updateWorkspace);
router.delete("/:workspaceId", requireWorkspaceRole("Admin"), deleteWorkspace);

// Member management — F/F/F view, F/—/— role changes/removal (Admin only)
router.get("/:workspaceId/members", requireWorkspaceMember, getWorkspaceMembers);
router.patch("/:workspaceId/members/:memberId/role", requireWorkspaceRole("Admin"), updateMemberRole);
router.delete("/:workspaceId/members/:memberId", requireWorkspaceRole("Admin"), removeMember);

// Tasks, nested under a workspace
router.use("/:workspaceId/tasks", taskRoutes);

export default router;