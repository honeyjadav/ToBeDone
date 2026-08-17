import express from "express";
import { getDigest, getDigestHistory, getActivityFeed } from "../controllers/activityLogController.js";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router({ mergeParams: true });

router.get("/digest", requireWorkspaceMember, getDigest);
router.get("/digest/history", requireWorkspaceMember, getDigestHistory);
router.get("/activity", requireWorkspaceMember, getActivityFeed);

export default router;