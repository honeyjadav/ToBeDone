import mongoose from "mongoose";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import User from "../models/User.js";
// Matches Task.status enum exactly
const STATUS_LIST = ["To Do", "In Progress", "Done"];

export const getDashboard = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      res.status(400);
      throw new Error("Invalid workspace ID");
    }

    const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      teamMembersCount,
      statusBreakdown,
      monthlyCompleted,
      upcomingTasks,
      recentActivity,
    ] = await Promise.all([
      Task.countDocuments({ workspace: workspaceObjectId }),

      Task.countDocuments({ workspace: workspaceObjectId, status: "Done" }),

      Task.countDocuments({
        workspace: workspaceObjectId,
        status: "In Progress",
      }),

      WorkspaceMember.countDocuments({ workspaceId: workspaceObjectId }),

      getStatusBreakdown(workspaceObjectId),

      getMonthlyCompleted(workspaceObjectId),

      getUpcomingTasks(workspaceObjectId),

      getRecentActivity(workspaceObjectId),
    ]);

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          teamMembers: teamMembersCount,
          completionRate,
        },
        statusBreakdown,
        monthlyCompleted,
        upcomingTasks,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------------------------------------
   Task status breakdown (for the donut chart)
--------------------------------------------------------- */
async function getStatusBreakdown(workspaceObjectId) {
  const results = await Task.aggregate([
    { $match: { workspace: workspaceObjectId } },
    { $group: { _id: "$status", value: { $sum: 1 } } },
  ]);

  const map = Object.fromEntries(results.map((r) => [r._id, r.value]));

  return STATUS_LIST.map((status) => ({
    status,
    value: map[status] || 0,
  }));
}

/* ---------------------------------------------------------
   Completed tasks per month, last 6 months (for the bar chart)
   Requires Task.completedAt (see schema update)
--------------------------------------------------------- */
async function getMonthlyCompleted(workspaceObjectId) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const results = await Task.aggregate([
    {
      $match: {
        workspace: workspaceObjectId,
        status: "Done",
        updatedAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
        },
        value: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthLabels = [];
  const cursor = new Date(sixMonthsAgo);

  for (let i = 0; i < 6; i++) {
    monthLabels.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth() + 1,
      label: cursor.toLocaleString("en-US", { month: "short" }),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const resultMap = new Map(
    results.map((r) => [`${r._id.year}-${r._id.month}`, r.value]),
  );

  return monthLabels.map(({ year, month, label }) => ({
    month: label,
    value: resultMap.get(`${year}-${month}`) || 0,
  }));
}

/* ---------------------------------------------------------
   Upcoming tasks (not Done, soonest due date first)
   assignedTo is an ARRAY of User refs — handled accordingly
--------------------------------------------------------- */
async function getUpcomingTasks(workspaceObjectId, limit = 4) {
  const tasks = await Task.find({
    workspace: workspaceObjectId,
    status: { $ne: "Done" },
    dueDate: { $ne: null },
  })
    .sort({ dueDate: 1 })
    .limit(limit)
    .populate("assignedTo", "name")
    .lean();

  return tasks.map((task) => ({
    id: task._id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    assignees:
      task.assignedTo?.length > 0
        ? task.assignedTo.map((u) => ({
            id: u._id,
            name: u.name,
            initials: toInitials(u.name),
          }))
        : [],
    dueDate: task.dueDate,
  }));
}

/* ---------------------------------------------------------
   Recent activity feed
   ActivityLog has targetType/targetId/metadata — not targetLabel.
   Falls back to metadata.label if you set one when logging,
   otherwise builds a readable string from action + targetType.
--------------------------------------------------------- */
async function getRecentActivity(workspaceObjectId, limit = 6) {
  const logs = await ActivityLog.find({
    workspace: workspaceObjectId,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name")
    .lean();

  const activities = await Promise.all(
    logs.map(async (log) => {
      let target = null;
      let role = null;
      let oldRole = null;
      let newRole = null;
      let assignees = [];
      let groupName = null;
      let oldStatus = null;  
      let newStatus = null;

     // MEMBER_INVITED
      if (log.action === "MEMBER_INVITED") {
          const email = log.metadata?.email;

          role = log.metadata?.role || null;

          if (email) {
              const invitedUser = await User.findOne({
                  email: email.toLowerCase().trim(),
              })
                  .select("name")
                  .lean();

              target = invitedUser?.name || email;
          }
      }

      // MEMBER_JOINED
      else if (log.action === "MEMBER_JOINED") {
          role = log.metadata?.role || null;
      }

      // MEMBER_REMOVED
      else if (log.action === "MEMBER_REMOVED") {
          const targetUserId = log.metadata?.targetUser;

          if (targetUserId) {
              const removedUser = await User.findById(targetUserId)
                  .select("name")
                  .lean();

              target = removedUser?.name || null;
          }
      }

      // MEMBER_ROLE_CHANGED
      else if (log.action === "MEMBER_ROLE_CHANGED") {
          const targetUserId = log.metadata?.targetUser;

          oldRole = log.metadata?.oldRole || null;
          newRole = log.metadata?.newRole || null;

          if (targetUserId) {
              const targetUser = await User.findById(targetUserId)
                  .select("name")
                  .lean();

              target = targetUser?.name || null;
          }
      }

      // GROUP_CREATED
      else if (log.action === "GROUP_CREATED") {
        target = log.metadata?.name || null;
      }

      // GROUP_MEMBER_ADDED
      else if (log.action === "GROUP_MEMBER_ADDED") {
        groupName = log.metadata?.groupName || null;

        const addedUserId = log.metadata?.addedUser;
        if (addedUserId) {
          const addedUser = await User.findById(addedUserId)
            .select("name")
            .lean();

          target = addedUser?.name || null;
        }
      }

      // GROUP_MEMBER_REMOVED
      else if (log.action === "GROUP_MEMBER_REMOVED") {
        groupName = log.metadata?.groupName || null;

        const removedUserId = log.metadata?.removedUser; // check your actual field name here
        if (removedUserId) {
          const removedUser = await User.findById(removedUserId)
            .select("name")
            .lean();

          target = removedUser?.name || null;
        }
      }

      // TASK_CREATED
      else if (log.action === "TASK_CREATED") {
        target = log.metadata?.title || null;
      }

      // TASK_UPDATED
      else if (log.action === "TASK_UPDATED") {
        target = log.metadata?.title || null;
      }

      // TASK_ASSIGNED
      else if (log.action === "TASK_ASSIGNED") {
        target = log.metadata?.title || null;

        const assignedToIds = log.metadata?.assignedTo || [];
        if (assignedToIds.length > 0) {
          const assignedUsers = await User.find({ _id: { $in: assignedToIds } })
            .select("name")
            .lean();

          assignees = assignedUsers.map((u) => ({
            id: u._id,
            name: u.name,
            initials: toInitials(u.name),
          }));
        }
      }

      // TASK_STATUS_CHANGED
      else if (log.action === "TASK_STATUS_CHANGED") {
        target = log.metadata?.title || null;
        oldStatus = log.metadata?.oldStatus || null;
        newStatus = log.metadata?.newStatus || null;
      }

      return {
        id: log._id,
        userId: log.user?._id,
        name: log.user?.name || "Unknown user",
        initials: toInitials(log.user?.name),
        action: log.action,
        target,
        role,
        oldRole,
        newRole,
        assignees,
        groupName,
        oldStatus,   
        newStatus,
        time: log.createdAt,
      };
    }),
  );

  return activities;
}

/* ---------------------------------------------------------
   Helper: derive initials from a name (no User.initials field)
--------------------------------------------------------- */
function toInitials(name) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
