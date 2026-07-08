import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import Project from '../models/Project.js';
import { ACTIVITY_TYPES, TASK_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const createTaskService = async (taskData, userId) => {
  try {
    const project = await Project.findById(taskData.projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    const task = new Task({
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || TASK_STATUS.BACKLOG,
      priority: taskData.priority || 'medium',
      project: taskData.projectId,
      creator: userId,
      assignee: taskData.assignee || null,
      dueDate: taskData.dueDate || null,
      startDate: taskData.startDate || null,
      estimatedHours: taskData.estimatedHours || null,
      labels: taskData.labels || [],
    });

    await task.save();
    await task.populate('creator', 'firstName lastName email avatar');
    await task.populate('assignee', 'firstName lastName email avatar');

    await ActivityLog.create({
      type: ACTIVITY_TYPES.TASK_CREATED,
      user: userId,
      project: taskData.projectId,
      task: task._id,
      description: `Created task: ${task.title}`,
    });

    logger.info(`Task created: ${task.title}`);

    return task;
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    throw error;
  }
};

export const getProjectTasksService = async (projectId, filters = {}) => {
  try {
    const query = { project: projectId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.assignee) {
      query.assignee = filters.assignee;
    }

    const tasks = await Task.find(query)
      .populate('creator', 'firstName lastName email avatar')
      .populate('assignee', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });

    return tasks;
  } catch (error) {
    logger.error(`Get project tasks error: ${error.message}`);
    throw error;
  }
};

export const getTaskByIdService = async (taskId) => {
  try {
    const task = await Task.findById(taskId)
      .populate('creator', 'firstName lastName email avatar')
      .populate('assignee', 'firstName lastName email avatar')
      .populate('comments')
      .populate('attachments');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  } catch (error) {
    logger.error(`Get task error: ${error.message}`);
    throw error;
  }
};

export const updateTaskService = async (taskId, updateData, userId) => {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    const changes = {};

    if (updateData.title && updateData.title !== task.title) {
      changes.title = { from: task.title, to: updateData.title };
      task.title = updateData.title;
    }

    if (updateData.description !== undefined) {
      changes.description = { from: task.description, to: updateData.description };
      task.description = updateData.description;
    }

    if (updateData.status && updateData.status !== task.status) {
      changes.status = { from: task.status, to: updateData.status };
      task.status = updateData.status;

      if (updateData.status === TASK_STATUS.DONE) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    if (updateData.priority && updateData.priority !== task.priority) {
      changes.priority = { from: task.priority, to: updateData.priority };
      task.priority = updateData.priority;
    }

    if (updateData.assignee !== undefined) {
      changes.assignee = { from: task.assignee, to: updateData.assignee };
      task.assignee = updateData.assignee;
    }

    if (updateData.dueDate !== undefined) {
      changes.dueDate = { from: task.dueDate, to: updateData.dueDate };
      task.dueDate = updateData.dueDate;
    }

    await task.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.TASK_UPDATED,
      user: userId,
      project: task.project,
      task: taskId,
      description: `Updated task: ${task.title}`,
      changes,
    });

    logger.info(`Task updated: ${task.title}`);

    return task.populate('creator', 'firstName lastName email avatar')
      .populate('assignee', 'firstName lastName email avatar');
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    throw error;
  }
};

export const deleteTaskService = async (taskId, userId) => {
  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    await ActivityLog.create({
      type: ACTIVITY_TYPES.TASK_UPDATED,
      user: userId,
      project: task.project,
      task: taskId,
      description: `Deleted task: ${task.title}`,
    });

    logger.info(`Task deleted: ${task.title}`);

    return { message: 'Task deleted successfully' };
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    throw error;
  }
};

export const changeTaskStatusService = async (taskId, newStatus, userId) => {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    const oldStatus = task.status;
    task.status = newStatus;

    if (newStatus === TASK_STATUS.DONE) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.TASK_UPDATED,
      user: userId,
      project: task.project,
      task: taskId,
      description: `Changed task status from ${oldStatus} to ${newStatus}`,
      changes: { status: { from: oldStatus, to: newStatus } },
    });

    logger.info(`Task status changed: ${task.title} - ${newStatus}`);

    return task;
  } catch (error) {
    logger.error(`Change task status error: ${error.message}`);
    throw error;
  }
};