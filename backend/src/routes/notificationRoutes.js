import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearReadNotifications
} from "../controllers/notificationController.js";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router({ mergeParams: true }); // ← fixed

router.get(
  "/",
  requireWorkspaceMember,
  getNotifications
);

router.patch(
  "/:notificationId/read",
  requireWorkspaceMember,
  markNotificationRead
);

router.patch(
  "/read-all",
  requireWorkspaceMember,
  markAllNotificationsRead
);

router.delete(
  "/read",
  requireWorkspaceMember,
  clearReadNotifications
);

export default router;