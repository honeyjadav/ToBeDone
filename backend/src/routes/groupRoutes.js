import express from "express";
import {
  createGroup,
  getGroups,
  getGroupById,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
} from "../controllers/groupController.js";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.js";

const router = express.Router({ mergeParams: true }); // mounted under /:workspaceId/groups

router.get("/", requireWorkspaceMember, getGroups);
router.post("/", requireWorkspaceMember, createGroup);
router.get("/:groupId", requireWorkspaceMember, getGroupById);
router.post("/:groupId/members", requireWorkspaceMember, addGroupMember);
router.delete("/:groupId/members/:userId", requireWorkspaceMember, removeGroupMember);
router.delete("/:groupId", requireWorkspaceMember, deleteGroup);

export default router;