import express from "express";
import { getMessages, deleteMessage, moderateMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import { requireWorkspaceRole, requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router();

router.use(protect);

// F/F/F — any member can view
router.get("/:workspaceId", requireWorkspaceMember, getMessages);

// O/O/O — only the sender can delete their own message
router.delete("/:workspaceId/:id", requireWorkspaceMember, deleteMessage);

// F/L/— — moderate someone else's message (Admin hard-delete, Manager redact)
router.delete("/:workspaceId/:id/moderate", requireWorkspaceRole("Admin", "Manager"), moderateMessage);

export default router;