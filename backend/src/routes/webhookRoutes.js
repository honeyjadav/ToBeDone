import express from "express";
import {
    getWebhooks,
    getWebhookById,
    createWebhook,
    updateWebhook,
    deleteWebhook,
} from "../controllers/webhookController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createWebhookSchema, updateWebhookSchema } from "../validators/webhookValidator.js";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(requireWorkspaceMember);

router.get("/", getWebhooks);
router.get("/:id", getWebhookById);
router.post("/", validate(createWebhookSchema), createWebhook);
router.patch("/:id", validate(updateWebhookSchema), updateWebhook);
router.delete("/:id", deleteWebhook);

export default router;
