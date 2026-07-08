import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import { ACTIVITY_TYPES, NOTIFICATION_TYPES } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const createCommentService = async (commentData, userId) => {
  try {
    const task = await Task.findById(commentData.taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    const comment = new Comment({
      content: commentData.content,
      task: commentData.taskId,
      author: userId,
      mentions: commentData.mentions || [],
    });

    await comment.save();
    await comment.populate('author', 'firstName lastName email avatar');

    task.comments.push(comment._id);
    await task.save();

    await ActivityLog.create({
      type: ACTIVITY_TYPES.COMMENT_ADDED,
      user: userId,
      project: task.project,
      task: commentData.taskId,
      description: `Added comment to task: ${task.title}`,
    });

    if (commentData.mentions && commentData.mentions.length > 0) {
      for (const mentionedUserId of commentData.mentions) {
        await Notification.create({
          type: NOTIFICATION_TYPES.COMMENT_MENTION,
          title: `You were mentioned in a comment`,
          message: `${comment.author.firstName} mentioned you in "${task.title}"`,
          user: mentionedUserId,
          task: commentData.taskId,
          sender: userId,
        });
      }
    }

    logger.info(`Comment created for task: ${task.title}`);

    return comment;
  } catch (error) {
    logger.error(`Create comment error: ${error.message}`);
    throw error;
  }
};

export const getTaskCommentsService = async (taskId) => {
  try {
    const comments = await Comment.find({ task: taskId })
      .populate('author', 'firstName lastName email avatar')
      .populate('mentions', 'firstName lastName email avatar')
      .sort({ createdAt: -1 });

    return comments;
  } catch (error) {
    logger.error(`Get comments error: ${error.message}`);
    throw error;
  }
};

export const updateCommentService = async (commentId, updateData, userId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new Error('Unauthorized to update this comment');
    }

    comment.content = updateData.content;
    comment.edited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'firstName lastName email avatar');

    logger.info(`Comment updated: ${commentId}`);

    return comment;
  } catch (error) {
    logger.error(`Update comment error: ${error.message}`);
    throw error;
  }
};

export const deleteCommentService = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    await Comment.findByIdAndDelete(commentId);

    const task = await Task.findById(comment.task);
    task.comments = task.comments.filter((id) => id.toString() !== commentId);
    await task.save();

    logger.info(`Comment deleted: ${commentId}`);

    return { message: 'Comment deleted successfully' };
  } catch (error) {
    logger.error(`Delete comment error: ${error.message}`);
    throw error;
  }
};