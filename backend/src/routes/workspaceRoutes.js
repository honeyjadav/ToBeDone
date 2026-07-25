import express from "express";
import { createWorkspace, getMyWorkspaces } from "../controllers/workspaceController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createWorkspaceSchema } from "../validators/workspaceValidator.js";

const router = express.Router();

router.post("/", protect, validate(createWorkspaceSchema), createWorkspace);
router.get("/", protect, getMyWorkspaces);

export default router;