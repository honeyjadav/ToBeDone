import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  assignTask,
  deleteTask,
  addTaskComment,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import {
  requireWorkspaceRole,
  requireWorkspaceMember,
} from "../middleware/workspaceAuth.js";
import { requireResourceAccess } from "../middleware/resourceAuth.js";
import Task from "../models/Task.js";

const router = express.Router({ mergeParams: true }); // expects to be mounted under /:workspaceId/tasks

router.use(protect);

// F/F/F — any member can view
router.get("/", requireWorkspaceMember, getTasks);
router.get("/:id", requireWorkspaceMember, getTaskById);

// F/F/L — any member can create; controller applies Member-specific limits
router.post("/", requireWorkspaceMember, createTask);

// F/F/O — Admin/Manager edit any task, Member only if assigned to it
router.patch(
  "/:id",
  requireWorkspaceMember,
  requireResourceAccess(Task, {
    idField: "taskId",
    ownerField: "createdBy",
    assigneeField: "assignedTo",
    allowFullRoles: ["Admin", "Manager"],
  }),
  updateTask
);

// F/F/— — assigning tasks is Admin/Manager only
router.patch("/:id/assign", requireWorkspaceRole("Admin", "Manager"), assignTask);

// F/F/— — deleting tasks is Admin/Manager only
router.delete("/:id", requireWorkspaceRole("Admin", "Manager"), deleteTask);

// Comments: any member (same access level as chat messages)
router.post("/:id/comments", requireWorkspaceMember, addTaskComment);

export default router;