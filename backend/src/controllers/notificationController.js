// notificationController.js
import mongoose from "mongoose";  // ← This line MUST be here
import Notification from "../models/Notification.js";
import { getIO } from "../sockets/index.js";
import {
  notificationReadSocket,
  notificationReadAllSocket,
  notificationClearReadSocket,
} from "../sockets/notificationSocket.js";

export const getNotifications = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const notifications = await Notification.find({
      user: userId,
      workspace: workspaceId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { workspaceId, notificationId } = req.params;
    const userId = req.user.id;

    console.log("=================================");
    console.log("MARK NOTIFICATION READ");
    console.log("workspaceId:", workspaceId);
    console.log("notificationId:", notificationId);
    console.log("userId:", userId);
    console.log("=================================");

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    // --------------------------------------------------
    // BUILD QUERY SAFELY
    // --------------------------------------------------

    const query = {
      user: userId,
      workspace: workspaceId,
    };

    /*
     * If notificationId is a valid MongoDB ObjectId,
     * search by _id.
     *
     * Otherwise search by custom notificationId.
     */

    if (mongoose.Types.ObjectId.isValid(notificationId)) {
      query._id = notificationId;
    } else {
      query.notificationId = notificationId;
    }

    console.log("Notification query:", query);

    // --------------------------------------------------
    // MARK READ
    // --------------------------------------------------

    const notification =
      await Notification.findOneAndUpdate(
        query,
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        {
          new: true,
        }
      );

    if (!notification) {
      console.error(
        "Notification not found:",
        notificationId
      );

      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    console.log(
      "Notification successfully marked as read:",
      notification._id.toString()
    );

    // --------------------------------------------------
    // SOCKET
    // --------------------------------------------------

    try {
      notificationReadSocket(
        getIO(),
        userId,
        notification.toObject()
      );
    } catch (socketError) {
      console.error(
        "Failed to emit notification read socket:",
        socketError.message
      );
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(
      "markNotificationRead error:",
      error
    );

    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    await Notification.updateMany(
      {
        user: userId,
        workspace: workspaceId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    try {
      notificationReadAllSocket(getIO(), userId, workspaceId);
    } catch (socketErr) {
      console.error("Failed to emit read-all socket event:", socketErr.message);
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const clearReadNotifications = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const result = await Notification.deleteMany({
      user: userId,
      workspace: workspaceId,
      isRead: true,
    });

    try {
      notificationClearReadSocket(getIO(), userId, workspaceId);
    } catch (socketErr) {
      console.error("Failed to emit clear-read socket event:", socketErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Read notifications cleared",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};