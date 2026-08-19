// notify.js
import Notification from "../models/Notification.js";
import { getIO } from "../sockets/index.js";
import { notificationSocket } from "../sockets/notificationSocket.js";

export const notifyUsers = async ({
  userIds,
  actorId,
  workspace,
  title,
  summary,
  type = "DIRECT",
  sourceActivityIds = [],
  taskId = null,
  chatData = null,
}) => {
  const targets = [...new Set((userIds || []).map(String))].filter(
    (uid) => uid !== String(actorId)
  );

  await Promise.all(
    targets.map(async (uid) => {
      try {
        const notification = await Notification.create({
          user: uid,
          workspace,
          type,
          title,
          summary,
          sourceActivityIds,
          taskId,
          chatData,
        });

        // Send database notification + chat information
        try {
          const io = getIO();
          notificationSocket(io, uid, notification.toObject());
        } catch (socketErr) {
          console.error(
            `Failed to emit socket notification to user ${uid}:`,
            socketErr.message
          );
        }
      } catch (err) {
        console.error(`Failed to notify user ${uid}:`, err.message);
      }
    })
  );
};