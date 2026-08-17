import Task from "../models/Task.js";
import { logActivity } from "./activityLogController.js";
import Notification from "../models/Notification.js";
// import { getIO } from "../sockets/index.js";
// import { notificationSocket } from "../sockets/notificationSocket.js";
import { notifyUsers } from "../utils/notify.js";

// @desc    Get all tasks in a workspace
// @route   GET /api/workspaces/:workspaceId/tasks
// @access  Private (any member) — F/F/F
export const getTasks = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { status, assignedTo } = req.query;

    const query = { workspace: workspaceId };
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/workspaces/:workspaceId/tasks/:id
// @access  Private (any member) — F/F/F
export const getTaskById = async (req, res, next) => {
  try {
    const { workspaceId, id } = req.params;

    const task = await Task.findOne({ taskId: id, workspace: workspaceId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.author", "name email");

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/workspaces/:workspaceId/tasks
// @access  Private (Admin/Manager full; Member limited) — F/F/L
//
// "Limited" for Member means: they CAN create a task, but only assigned to
// themselves, and capped at "Medium" priority — they can't self-assign
// High/Urgent priority work. Admin/Manager can set any assignee(s)/priority.
export const createTask = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate, type } = req.body;
    const role = req.membership.role;
    const userId = req.user.id;

    if (!title) {
      res.status(400);
      throw new Error("Task title is required");
    }

    const isFullAccess = role === "Admin" || role === "Manager";

    const taskData = {
      title,
      type: type || "Task",
      description: description || "",
      workspace: workspaceId,
      createdBy: userId,
      status: status || "To Do",
      dueDate,
    };

    if (isFullAccess) {
      taskData.priority = priority || "Medium";
      taskData.assignedTo = Array.isArray(assignedTo) ? assignedTo : assignedTo ? [assignedTo] : [];
    } else {
      const HIGH_TIER = ["High", "Urgent"];
      taskData.priority = HIGH_TIER.includes(priority) ? "Medium" : priority || "Medium";
      taskData.assignedTo = [userId];
    }

    const task = await Task.create(taskData);

    const activity = await logActivity({
      workspace: workspaceId,
      user: userId,
      action: "TASK_CREATED",
      targetType: "Task",
      targetId: task._id,
      metadata: { title: task.title },
    });

    // Notify anyone assigned who isn't the creator themselves
    if (task.assignedTo?.length > 0) {
      await notifyUsers({
        userIds: task.assignedTo,
        actorId: userId,
        workspace: workspaceId,
        title: "New task assigned to you",
        summary: `${req.user.name} assigned you "${task.title}"`,
        sourceActivityIds: activity ? [activity._id] : [],
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task's editable fields (title, description, status, priority, dueDate)
// @route   PATCH /api/workspaces/:workspaceId/tasks/:id
// @access  Private (Admin/Manager: any task; Member: only if assigned) — F/F/O
// Ownership/assignment already enforced by requireResourceAccess middleware,
// which attaches the task to req.resource.
export const updateTask = async (req, res, next) => {
  try {
    const task = req.resource;
    const { title, description, status, priority, dueDate, type, assignedTo } = req.body;
    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo.map(String); // snapshot before changes

    if (title !== undefined) task.title = title;
    if (type !== undefined) task.type = type;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    let assigneesChanged = false;
    if (assignedTo !== undefined) {
      const newAssignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
      task.assignedTo = newAssignedTo;
      assigneesChanged = true;
    }

    await task.save();

    if (status !== undefined && status !== oldStatus) {
      logActivity({
        workspace: task.workspace,
        user: req.user.id,
        action: "TASK_STATUS_CHANGED",
        targetType: "Task",
        targetId: task._id,
        metadata: { title: task.title, oldStatus, newStatus: status },
      });
    } else {
      logActivity({
        workspace: task.workspace,
        user: req.user.id,
        action: "TASK_UPDATED",
        targetType: "Task",
        targetId: task._id,
        metadata: { title: task.title },
      });
    }

    // ============================================================
    // NOTIFY NEWLY ASSIGNED USERS
    // ============================================================
    if (assigneesChanged) {
      const newAssignees = task.assignedTo
        .map(String)
        .filter((uid) => !oldAssignedTo.includes(uid)); // only people who weren't already assigned

      if (newAssignees.length > 0) {
        const assignActivity = await logActivity({
          workspace: task.workspace,
          user: req.user.id,
          action: "TASK_ASSIGNED",
          targetType: "Task",
          targetId: task._id,
          metadata: { title: task.title, assignedTo: task.assignedTo },
        });

        await notifyUsers({
          userIds: newAssignees,
          actorId: req.user.id,
          workspace: task.workspace,
          title: "New task assigned to you",
          summary: `${req.user.name} assigned you "${task.title}"`,
          sourceActivityIds: assignActivity ? [assignActivity._id] : [],
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign/reassign a task to one or more users
// @route   PATCH /api/workspaces/:workspaceId/tasks/:id/assign
// @access  Private (Admin/Manager only) — F/F/—
export const assignTask = async (req, res, next) => {
  try {
    const { workspaceId, id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      res.status(400);
      throw new Error("assignedTo is required");
    }

    const task = await Task.findOne({ taskId: id, workspace: workspaceId });
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    task.assignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    await task.save();

    logActivity({
      workspace: workspaceId,
      user: req.user.id,
      action: "TASK_ASSIGNED",
      targetType: "Task",
      targetId: task._id,
      metadata: { title: task.title, assignedTo: task.assignedTo },
    });

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/workspaces/:workspaceId/tasks/:id
// @access  Private (Admin/Manager only) — F/F/—
export const deleteTask = async (req, res, next) => {
  try {
    const { workspaceId, id } = req.params;

    const task = await Task.findOneAndDelete({ taskId: id, workspace: workspaceId });
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a task
// @route   POST /api/workspaces/:workspaceId/tasks/:id/comments
// @access  Private (any member) — comments aren't in the matrix explicitly;
// treated like messages: any member can post, same as chat.
export const addTaskComment = async (req, res, next) => {
  try {
    const { workspaceId, id } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const task = await Task.findOne({ taskId: id, workspace: workspaceId });
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    task.comments.push({ author: req.user.id, text });
    await task.save();

    logActivity({
      workspace: workspaceId,
      user: req.user.id,
      action: "TASK_COMMENTED",
      targetType: "Task",
      targetId: task._id,
      metadata: { title: task.title },
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: task.comments[task.comments.length - 1],
    });
  } catch (error) {
    next(error);
  }
};