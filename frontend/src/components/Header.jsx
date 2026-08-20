import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import APICallService from "../services/APICallService";
import {
  connectSocket,
  getSocket,
} from "../services/socket";
import { useAuth } from "../hooks/useAuth";
import NotificationToast from "../pages/NotificationToast";

export default function Header({ darkMode = false }) {
  const navigate = useNavigate();
  const { activeWorkspace } = useAuth();
  const [toastNotification, setToastNotification] = useState(null);

  const workspaceId =
    activeWorkspace?.workspaceId ||
    activeWorkspace?._id ||
    activeWorkspace?.id;

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const palette = darkMode
    ? {
        background: "#0f172a",
        border: "rgba(148, 163, 184, 0.2)",
        text: "#e2e8f0",
        muted: "#94a3b8",
        search: "#0b1220",
        iconBg: "#111827",
        username: "#e2e8f0",
        iconColor: "#cbd5e1",
        divider: "rgba(148, 163, 184, 0.2)",
      }
    : {
        background: "#ffffff",
        border: "#e2e8f0",
        text: "#1e293b",
        muted: "#94a3b8",
        search: "#f1f5f9",
        iconBg: "#f1f5f9",
        username: "#334155",
        iconColor: "#475569",
        divider: "#e2e8f0",
      };

  // --------------------------------------------------
  // GET CURRENT USER
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await APICallService.getMe();

        const userData = response?.data?.data;

        if (mounted && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load header user:", error);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // GET NOTIFICATIONS FROM BACKEND
  // --------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    if (!workspaceId) {
      setNotifications([]);
      return;
    }

    try {
      const response =
        await APICallService.getNotifications(workspaceId);

      const payload = response?.data;

      if (!payload?.success) {
        console.error(
          "Failed to load notifications:",
          payload?.message
        );
        return;
      }

      const notificationData = Array.isArray(payload.data)
        ? payload.data
        : [];

      setNotifications(notificationData);
    } catch (error) {
      console.error(
        "Failed to load header notifications:",
        error
      );
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // --------------------------------------------------
  // SOCKET.IO
  // --------------------------------------------------

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const socket = connectSocket();

    if (!socket) {
      console.warn(
        "Socket not connected because access token was not found."
      );
      return;
    }

    const joinWorkspace = () => {
      socket.emit("workspace:join", {
        workspaceId,
      });
    };

    const handleNewNotification = (notification) => {
    console.log("🔔 New notification received:", notification);

    if (
        notification?.workspace &&
        String(notification.workspace) !== String(workspaceId)
    ) {
        return;
    }

    const notificationId =
        notification?.notificationId ||
        notification?._id ||
        notification?.id;

    if (!notificationId) return;

    setNotifications((prev) => {
        const alreadyExists = prev.some(
            (item) =>
                String(item.notificationId || item._id || item.id) ===
                String(notificationId)
        );
        if (alreadyExists) return prev;
        return [{ ...notification, notificationId }, ...prev];
    });

    // NEW: trigger the popup toast
    setToastNotification({ ...notification, notificationId });
};

    socket.on("connect", joinWorkspace);

    socket.on(
      "notification:new",
      handleNewNotification
    );

    if (socket.connected) {
      joinWorkspace();
    }

    return () => {
      socket.off("connect", joinWorkspace);

      socket.off(
        "notification:new",
        handleNewNotification
      );
    };
  }, [workspaceId]);

  // --------------------------------------------------
// SOCKET.IO
// --------------------------------------------------

useEffect(() => {
  if (!workspaceId) {
    return;
  }

  const socket = connectSocket();

  if (!socket) {
    console.warn(
      "Socket not connected because access token was not found."
    );
    return;
  }

  // ------------------------------------------
  // JOIN WORKSPACE
  // ------------------------------------------

  const joinWorkspace = () => {
    socket.emit("workspace:join", {
      workspaceId,
    });
  };

  // ------------------------------------------
  // NEW NOTIFICATION
  // ------------------------------------------

  const handleNewNotification = (notification) => {
    console.log(
      "🔔 New notification received:",
      notification
    );

    // Ignore notifications from another workspace
    if (
      notification?.workspace &&
      String(notification.workspace) !== String(workspaceId)
    ) {
      return;
    }

    const notificationId =
      notification?.notificationId ||
      notification?._id ||
      notification?.id;

    if (!notificationId) {
      return;
    }

    setNotifications((prev) => {
      const alreadyExists = prev.some(
        (item) =>
          String(
            item.notificationId ||
              item._id ||
              item.id
          ) === String(notificationId)
      );

      if (alreadyExists) {
        return prev;
      }

      return [
        {
          ...notification,
          notificationId,
        },
        ...prev,
      ];
    });

    // Show toast
    setToastNotification({
      ...notification,
      notificationId,
    });
  };

  // ------------------------------------------
  // ONE NOTIFICATION MARKED AS READ
  // ------------------------------------------

  const handleNotificationRead = (data) => {
    console.log(
      "🔵 Notification marked as read:",
      data
    );

    if (!data?.notificationId) {
      return;
    }

    // Ignore another workspace
    if (
      data.workspace &&
      String(data.workspace) !== String(workspaceId)
    ) {
      return;
    }

    setNotifications((prev) =>
      prev.map((notification) => {
        const id =
          notification.notificationId ||
          notification._id ||
          notification.id;

        if (
          String(id) ===
          String(data.notificationId)
        ) {
          return {
            ...notification,
            isRead: true,
            readAt:
              data.readAt ||
              new Date().toISOString(),
          };
        }

        return notification;
      })
    );
  };

  // ------------------------------------------
  // ALL NOTIFICATIONS MARKED AS READ
  // ------------------------------------------

  const handleNotificationsReadAll = (data) => {
    console.log(
      "🟢 All notifications marked as read:",
      data
    );

    if (
      data?.workspaceId &&
      String(data.workspaceId) !== String(workspaceId)
    ) {
      return;
    }

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
        readAt:
          notification.readAt ||
          new Date().toISOString(),
      }))
    );
  };

  // ------------------------------------------
  // READ NOTIFICATIONS CLEARED
  // ------------------------------------------

  const handleNotificationsClearRead = (data) => {
  if (
    data?.workspaceId &&
    String(data.workspaceId) !==
      String(workspaceId)
  ) {
    return;
  }

  setNotifications((prev) =>
    prev.filter(
      (notification) =>
        !notification.isRead
    )
  );
};

  // ------------------------------------------
  // SOCKET EVENTS
  // ------------------------------------------

  socket.on(
    "connect",
    joinWorkspace
  );

  socket.on(
    "notification:new",
    handleNewNotification
  );

  socket.on(
    "notification:read",
    handleNotificationRead
  );

  socket.on(
    "notifications:read-all",
    handleNotificationsReadAll
  );

  socket.on(
    "notifications:clear-read",
    handleNotificationsClearRead
  );

  // If already connected
  if (socket.connected) {
    joinWorkspace();
  }

  // ------------------------------------------
  // CLEANUP
  // ------------------------------------------

  return () => {
    socket.off(
      "connect",
      joinWorkspace
    );

    socket.off(
      "notification:new",
      handleNewNotification
    );

    socket.off(
      "notification:read",
      handleNotificationRead
    );

    socket.off(
      "notifications:read-all",
      handleNotificationsReadAll
    );

    socket.off(
      "notifications:clear-read",
      handleNotificationsClearRead
    );
  };
}, [workspaceId]);
  // --------------------------------------------------
  // MARK ONE NOTIFICATION AS READ
  // --------------------------------------------------

  const handleMarkRead = async (notificationId) => {
  if (!workspaceId || !notificationId) {
    return;
  }

  // Optimistic update
  setNotifications((prev) =>
    prev.map((notification) => {
      const id =
        notification.notificationId ||
        notification._id ||
        notification.id;

      return String(id) === String(notificationId)
        ? {
            ...notification,
            isRead: true,
            readAt: new Date().toISOString(),
          }
        : notification;
    })
  );

  try {
    await APICallService.markNotificationRead(
      workspaceId,
      notificationId
    );
  } catch (error) {
    console.error(
      "Failed to mark notification as read:",
      error
    );

    // Get actual backend state
    fetchNotifications();
  }
};

  // --------------------------------------------------
  // MARK ALL AS READ
  // --------------------------------------------------

  const handleMarkAllRead = async () => {
  if (!workspaceId) {
    return;
  }

  const previousNotifications = notifications;

  // Optimistic update
  setNotifications((prev) =>
    prev.map((notification) => ({
      ...notification,
      isRead: true,
      readAt:
        notification.readAt ||
        new Date().toISOString(),
    }))
  );

  try {
    await APICallService.markAllNotificationsRead(
      workspaceId
    );
  } catch (error) {
    console.error(
      "Failed to mark all notifications as read:",
      error
    );

    // Rollback
    setNotifications(previousNotifications);
  }
};
  // --------------------------------------------------
  // OPEN NOTIFICATION
  // --------------------------------------------------

const handleOpenNotification = async (notification) => {
  if (!notification) {
    return;
  }

  const notificationId =
    notification.notificationId ||
    notification._id ||
    notification.id;

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  if (!notification.isRead && notificationId) {
    try {
      await handleMarkRead(notificationId);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  // ==========================================
  // WORKSPACE
  // ==========================================

  const workspaceId = notification.workspace;

  if (!workspaceId) {
    console.error(
      "Workspace ID missing from notification:",
      notification
    );
    return;
  }

  // TASK
  if (
    notification.title === "New task assigned to you" ||
    notification.taskId ||
    notification.task
  ) {
    // Fall back to the linked activity log's targetId when no
    // direct taskId/task is present on the notification itself.
    const taskActivity = notification.sourceActivityIds?.find(
      (activity) => activity?.targetType === "Task"
    );

    const taskId =
      notification.taskId ||
      notification.task?._id ||
      notification.task?.id ||
      notification.data?.taskId ||
      taskActivity?.targetId;

    if (!taskId) {
      console.error("Task ID missing from notification:", notification);
      return;
    }

    navigate("/dashboard/tasks", {
      state: {
        taskId,
        workspaceId,
      },
    });

    return;
  }

  // ==========================================
  // CHAT NOTIFICATION
  // ==========================================

  if (notification.type === "DIRECT") {
    const chatData = notification.chatData;

    if (!chatData) {
      console.error(
        "Chat data missing:",
        notification
      );
      return;
    }

    // ------------------------------------------
    // GROUP CHAT
    // ------------------------------------------

    if (chatData.type === "GROUP") {
      if (!chatData.groupId) {
        console.error("Group ID missing:", chatData);
        return;
      }

      navigate("/dashboard/chat", {
        state: {
          type: "GROUP",
          groupId: chatData.groupId,
          workspaceId: workspaceId,
        },
      });

      return;
    }

    // ------------------------------------------
    // DIRECT MESSAGE
    // ------------------------------------------

    if (!chatData.userId) {
      console.error("User ID missing for DM:", chatData);
      return;
    }

    navigate("/dashboard/chat", {
      state: {
        type: "DM",
        userId: chatData.userId,
        workspaceId: workspaceId,
      },
    });

    return;
  }

  // ==========================================
  // DIGEST
  // ==========================================

  if (notification.type === "DIGEST") {
    navigate("/dashboard/digest");
    return;
  }

  console.warn(
    "Unknown notification type:",
    notification.type
  );
};

  // --------------------------------------------------
  // USER INITIALS
  // --------------------------------------------------

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: palette.background,
        borderBottom: `1px solid ${palette.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "60px",
        gap: "16px",
        boxShadow: darkMode
          ? "0 1px 3px rgba(15, 23, 42, 0.4)"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* -------------------------------------------- */}
      {/* LOGO */}
      {/* -------------------------------------------- */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "#7c3aed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 11l3 3L22 4"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: palette.text,
            letterSpacing: "-0.3px",
            whiteSpace: "nowrap",
          }}
        >
          ToBeDone
        </h1>
      </div>

      {/* -------------------------------------------- */}
      {/* SEARCH */}
      {/* -------------------------------------------- */}

      <div
        className="header-search"
        style={{
          flex: 1,
          maxWidth: "320px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: palette.search,
          borderRadius: "8px",
          padding: "0 12px",
          height: "36px",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            flexShrink: 0,
          }}
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke={palette.muted}
            strokeWidth="2"
          />

          <path
            d="m21 21-4.3-4.3"
            stroke={palette.muted}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          placeholder="Search your tasks...."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "13px",
            color: palette.text,
            width: "100%",
          }}
        />
      </div>

      {/* -------------------------------------------- */}
      {/* RIGHT SIDE */}
      {/* -------------------------------------------- */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        {/* Messages */}

        <button
          style={{
            ...iconBtnStyle,
            background: palette.iconBg,
          }}
          aria-label="Messages"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6Z"
              stroke={palette.iconColor}
              strokeWidth="1.8"
            />

            <path
              d="m2 7 8.97 6.28a2 2 0 0 0 2.06 0L22 7"
              stroke={palette.iconColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* ---------------------------------------- */}
        {/* NOTIFICATION DROPDOWN */}
        {/* ---------------------------------------- */}

        <NotificationDropdown
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onOpenNotification={handleOpenNotification}
        />

        {/* Divider */}

        <div
          style={{
            width: "1px",
            height: "24px",
            background: palette.divider,
          }}
        />

        {/* ---------------------------------------- */}
        {/* USER */}
        {/* ---------------------------------------- */}

        <div
          onClick={() =>
            navigate("/dashboard/profile")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#ede9fe",
              color: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getInitials(user?.name)}
          </div>

          <span
            className="username-display"
            style={{
              color: palette.username,
              fontSize: "13.5px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "User"}
          </span>
        </div>
      </div>
      <NotificationToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
        onOpen={(n) => {
          setToastNotification(null);
          handleOpenNotification(n);
        }}
      />
      <style>{`
        .header-search {
          transition: background 0.2s ease;
        }

        .header-search:focus-within {
          background-color: ${
            darkMode ? "#172033" : "#e9edf3"
          } !important;
        }

        @media (max-width: 768px) {
          .header-search {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .username-display {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

const iconBtnStyle = {
  position: "relative",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
