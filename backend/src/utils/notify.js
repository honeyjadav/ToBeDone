import Notification from "../models/Notification.js";
import { getIO } from "../sockets/index.js";
import { notificationSocket } from "../sockets/notificationSocket.js";

/**
 * Creates a DIRECT Notification for each target user and pushes it live
 * via socket. Automatically skips the actor (no need to notify yourself).
 */
export const notifyUsers = async ({
  userIds,
  actorId,
  workspace,
  title,
  summary,
  sourceActivityIds = [],
}) => {
  const targets = [...new Set((userIds || []).map(String))].filter(
    (uid) => uid !== String(actorId)
  );

  const io = getIO();

  await Promise.all(
    targets.map(async (uid) => {
      try {
        const notification = await Notification.create({
          user: uid,
          workspace,
          type: "DIRECT",
          title,
          summary,
          sourceActivityIds,
        });

        notificationSocket(io, uid, notification);
      } catch (err) {
        console.error(`Failed to notify user ${uid}:`, err.message);
      }
    })
  );
};