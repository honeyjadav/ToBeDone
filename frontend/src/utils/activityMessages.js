export const ACTIVITY_MESSAGES = {
    MEMBER_JOINED: () => ({
        action: "joined the workspace",
        target: "",
    }),

    MEMBER_INVITED: (activity) => ({
        action: "invited",
        target: activity.target || "a member",
    }),

    MEMBER_REMOVED: (activity) => ({
        action: "removed",
        target: activity.target
            ? `${activity.target} from the workspace`
            : "a member from the workspace",
    }),

    MEMBER_ROLE_CHANGED: (activity) => ({
        action: "changed",
        target: activity.target
            ? `${activity.target}'s role from ${activity.oldRole} to ${activity.newRole}`
            : `a member's role from ${activity.oldRole} to ${activity.newRole}`,
    }),

    TASK_CREATED: (activity) => ({
        action: "created",
        target: activity.target ? `task "${activity.target}"` : "a task",
    }),

    TASK_UPDATED: (activity) => ({
        action: "updated",
        target: activity.target ? `task "${activity.target}"` : "a task",
    }),

    TASK_ASSIGNED: (activity) => {
        const names = activity.assignees?.map((u) => u.name).filter(Boolean) || [];

        let target = activity.target ? `"${activity.target}"` : "a task";

        if (names.length === 1) {
            target += ` to ${names[0]}`;
        } else if (names.length === 2) {
            target += ` to ${names[0]} and ${names[1]}`;
        } else if (names.length > 2) {
            target += ` to ${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
        }

        return {
            action: "assigned",
            target,
        };
    },

    TASK_STATUS_CHANGED: (activity) => ({
        action: "changed the status of",
        target: activity.target
            ? `"${activity.target}" from ${activity.oldStatus} to ${activity.newStatus}`
            : `a task from ${activity.oldStatus} to ${activity.newStatus}`,
    }),

    TASK_COMMENTED: (activity) => ({
        action: "commented on",
        target: activity.target || "a task",
    }),

    FILE_UPLOADED: (activity) => ({
        action: "uploaded",
        target: activity.target || "a file",
    }),

    GROUP_CREATED: (activity) => ({
        action: "created",
        target: activity.target ? `a group "${activity.target}"` : "a group",
    }),

    GROUP_MEMBER_ADDED: (activity) => ({
        action: "added",
        target: activity.target
            ? `"${activity.target}" to group "${activity.groupName || "a group"}"`
            : `a member to group "${activity.groupName || "a group"}"`,
    }),

    GROUP_MEMBER_REMOVED: (activity) => ({
        action: "removed",
        target: activity.target
            ? `${activity.target} from ${activity.groupName || "a group"}`
            : `a member from ${activity.groupName || "a group"}`,
    }),
    };

export const formatActivityAction = (activity) => {
    if (!activity?.action) {
        return {
            action: "performed an action",
            target: "",
        };
    }

    const formatter = ACTIVITY_MESSAGES[activity.action];

    if (formatter) {
        return formatter(activity);
    }

    return {
        action: activity.action
            .replaceAll("_", " ")
            .toLowerCase(),
        target: activity.target || "",
    };
};