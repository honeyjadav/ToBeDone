import Notification from '../models/Notification.js';
import logger from '../utils/logger.js';

export const createNotificationService = async (notificationData) => {
  try {
    const notification = new Notification({
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      user: notificationData.user,
      task: notificationData.task || null,
      project: notificationData.project || null,
      sender: notificationData.sender || null,
      data: notificationData.data || null,
    });

    await notification.save();

    logger.info(`Notification created for user: ${notificationData.user}`);

    return notification;
  } catch (error) {
    logger.error(`Create notification error: ${error.message}`);
    throw error;
  }
};

export const getUserNotificationsService = async (userId, limit = 20) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .populate('sender', 'firstName lastName email avatar')
      .populate('task', 'title')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    throw error;
  }
};

export const getUnreadNotificationCountService = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return { unreadCount: count };
  } catch (error) {
    logger.error(`Get unread count error: ${error.message}`);
    throw error;
  }
};

export const markNotificationAsReadService = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    logger.info(`Notification marked as read: ${notificationId}`);

    return notification;
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    throw error;
  }
};

export const markAllNotificationsAsReadService = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    logger.info(`All notifications marked as read for user: ${userId}`);

    return { message: 'All notifications marked as read' };
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    throw error;
  }
};