import express from "express";
import { sendInvite, getWorkspaceInvites } from "../controllers/inviteController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { sendInviteSchema } from "../validators/inviteValidator.js";

const router = express.Router();

router.post("/", protect, validate(sendInviteSchema), sendInvite);
router.get("/:workspaceId", protect, getWorkspaceInvites);

export default router;