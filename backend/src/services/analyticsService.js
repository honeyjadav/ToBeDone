import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';
import { TASK_STATUS, ACTIVITY_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const getProjectAnalyticsService = async (projectId) => {
  try {
    const tasks = await Task.find({ project: projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
    const pendingTasks = tasks.filter(
      (t) =>
        t.status !== TASK_STATUS.DONE &&
        t.status !== TASK_STATUS.BACKLOG
    ).length;
    const overdueTasks = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== TASK_STATUS.DONE
    ).length;

    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const tasksByStatus = {
      backlog: tasks.filter((t) => t.status === TASK_STATUS.BACKLOG).length,
      todo: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
      in_progress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
      review: tasks.filter((t) => t.status === TASK_STATUS.REVIEW).length,
      testing: tasks.filter((t) => t.status === TASK_STATUS.TESTING).length,
      done: completedTasks,
    };

    const tasksByPriority = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
    };

    logger.info(`Analytics retrieved for project: ${projectId}`);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
      tasksByStatus,
      tasksByPriority,
    };
  } catch (error) {
    logger.error(`Get analytics error: ${error.message}`);
    throw error;
  }
};

export const getUserAnalyticsService = async (userId) => {
  try {
    const userTasks = await Task.find({ assignee: userId });
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    });

    const completedTasks = userTasks.filter((t) => t.status === TASK_STATUS.DONE).length;
    const pendingTasks = userTasks.filter(
      (t) =>
        t.status !== TASK_STATUS.DONE &&
        t.status !== TASK_STATUS.BACKLOG
    ).length;
    const overdueTasks = userTasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== TASK_STATUS.DONE
    ).length;

    const completionPercentage =
      userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0;

    const activityLogs = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    logger.info(`User analytics retrieved for user: ${userId}`);

    return {
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
      projectCount: userProjects.length,
      taskCount: userTasks.length,
      recentActivity: activityLogs,
    };
  } catch (error) {
    logger.error(`Get user analytics error: ${error.message}`);
    throw error;
  }
};

export const getTaskCompletionTrendService = async (projectId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await ActivityLog.find({
      project: projectId,
      type: ACTIVITY_TYPES.TASK_COMPLETED,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    const trend = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      trend[dateKey] = activities.filter(
        (a) => a.createdAt.toISOString().split('T')[0] === dateKey
      ).length;
    }

    logger.info(`Task completion trend retrieved for project: ${projectId}`);

    return trend;
  } catch (error) {
    logger.error(`Get trend error: ${error.message}`);
    throw error;
  }
};  