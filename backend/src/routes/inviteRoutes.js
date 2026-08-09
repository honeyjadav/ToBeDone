import express from "express";
import {
  sendInvite,
  getWorkspaceInvites,
  acceptInvite,
} from "../controllers/inviteController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { sendInviteSchema } from "../validators/inviteValidator.js";
import {
  requireWorkspaceRole,
  requireWorkspaceMember,
} from "../middleware/workspaceAuth.js";

const router = express.Router();

router.post(
  "/:workspaceId",
  protect,
  requireWorkspaceRole("Admin"),
  validate(sendInviteSchema),
  sendInvite,
);
router.get(
  "/:workspaceId",
  protect,
  requireWorkspaceMember,
  getWorkspaceInvites,
);
router.post("/accept/:token", protect, acceptInvite);

export default router;
