import { useEffect, useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TagIcon from "@mui/icons-material/Tag";
import AssignmentIcon from "@mui/icons-material/Assignment";
import APICallService from "../services/APICallService";
import { useAuth } from "../hooks/useAuth";
import { getSocket } from "../services/Socket";

// 1. Import settings utility
import { getAppSettings } from "../utils/preferences";

const TYPE_CONFIG = {
  DIGEST: {
    icon: AutoAwesomeIcon,
    color: "#7c3aed",
    bg: "#f3f0fe",
    darkBg: "#2e1065",
  },
  DIRECT: {
    icon: AlternateEmailIcon,
    color: "#3b82f6",
    bg: "#eff6ff",
    darkBg: "#1e3a8a",
  },
  TASK: {
    icon: AssignmentIcon,
    color: "#059669",
    bg: "#ecfdf5",
    darkBg: "#14532d",
  },
};

const FILTERS = [
  "All",
  "Unread",
  "Digests",
  "Mentions & Direct",
];

const Notifications = () => {
  const { activeWorkspace } = useAuth();
  const workspaceId = activeWorkspace?.workspaceId;

  // 2. Initialize dark mode state and event listener
  const initialSettings = getAppSettings();
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

  useEffect(() => {
    const handleSettingsChange = (event) => {
      const nextSettings = event.detail ?? getAppSettings();
      setDarkMode(Boolean(nextSettings.darkMode));
    };

    window.addEventListener('tobedone-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET NOTIFICATIONS (INITIAL LOAD)
  // --------------------------------------------------

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await APICallService.getNotifications(workspaceId);

        console.log(
          "Notifications API response:",
          response
        );

        const payload = response?.data;

        if (payload?.success) {
          setNotifications(payload.data || []);
        } else {
          setNotifications([]);
          setError(
            payload?.message ||
            "Unable to load notifications."
          );
        }
      } catch (err) {
        console.error(
          "Failed to load notifications:",
          err
        );

        setError(
          err?.response?.data?.message ||
          "Failed to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [workspaceId]);

  // --------------------------------------------------
  // LISTEN FOR REAL-TIME NOTIFICATIONS
  // --------------------------------------------------

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !workspaceId) return;

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      console.log("New notification received:", notification);

      // Add new notification to the top of the list
      setNotifications((prev) => [notification, ...prev]);
    };

    // Listen for notification updates (e.g., read status changed)
    const handleNotificationUpdated = (updatedNotification) => {
      console.log("Notification updated:", updatedNotification);

      setNotifications((prev) =>
        prev.map((notif) =>
          (notif.notificationId === updatedNotification.notificationId ||
            notif._id === updatedNotification._id)
            ? updatedNotification
            : notif
        )
      );
    };

    // Listen for deleted notifications
    const handleNotificationDeleted = (notificationId) => {
      console.log("Notification deleted:", notificationId);

      setNotifications((prev) =>
        prev.filter(
          (notif) =>
            notif.notificationId !== notificationId &&
            notif._id !== notificationId
        )
      );
    };

    // Subscribe to socket events
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:updated", handleNotificationUpdated);
    socket.on("notification:deleted", handleNotificationDeleted);

    // Emit event to subscribe to workspace notifications
    socket.emit("subscribe:workspace", { workspaceId });

    // Cleanup
    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:updated", handleNotificationUpdated);
      socket.off("notification:deleted", handleNotificationDeleted);
      socket.emit("unsubscribe:workspace", { workspaceId });
    };
  }, [workspaceId]);

  // --------------------------------------------------
  // MARK ONE AS READ
  // --------------------------------------------------

  const markRead = async (notificationId) => {
    if (!workspaceId || !notificationId) {
      return;
    }

    // Optimistic update on Notifications page
    setNotifications((prev) =>
      prev.map((notification) =>
        String(
          notification.notificationId ||
          notification._id ||
          notification.id
        ) === String(notificationId)
          ? {
            ...notification,
            isRead: true,
          }
          : notification
      )
    );

    // Tell Header / Dropdown
    window.dispatchEvent(
      new CustomEvent("notification:state-change", {
        detail: {
          type: "read",
          notificationId,
        },
      })
    );

    try {
      await APICallService.markNotificationRead(
        workspaceId,
        notificationId
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      // Reload from backend if API fails
      try {
        const response =
          await APICallService.getNotifications(
            workspaceId
          );

        if (response?.data?.success) {
          const data = response.data.data || [];

          setNotifications(data);

          // Synchronize Header again
          window.dispatchEvent(
            new CustomEvent(
              "notification:sync",
              {
                detail: {
                  notifications: data,
                },
              }
            )
          );
        }
      } catch (reloadError) {
        console.error(
          "Failed to reload notifications:",
          reloadError
        );
      }
    }
  };
  // --------------------------------------------------
  // MARK ALL AS READ
  // --------------------------------------------------

  const markAllRead = async () => {
    if (!workspaceId) {
      return;
    }

    const previousNotifications =
      notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    // Tell Header / Dropdown
    window.dispatchEvent(
      new CustomEvent("notification:state-change", {
        detail: {
          type: "read-all",
        },
      })
    );

    try {
      await APICallService.markAllNotificationsRead(
        workspaceId
      );
    } catch (err) {
      console.error(
        "Failed to mark all notifications as read:",
        err
      );

      // Rollback Notifications page
      setNotifications(previousNotifications);

      // Rollback Header / Dropdown
      window.dispatchEvent(
        new CustomEvent("notification:sync", {
          detail: {
            notifications:
              previousNotifications,
          },
        })
      );
    }
  };

  // --------------------------------------------------
  // CLEAR READ NOTIFICATIONS
  // --------------------------------------------------

  const clearRead = async () => {
    if (!workspaceId) {
      return;
    }

    const previousNotifications =
      notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.filter(
        (notification) => !notification.isRead
      )
    );

    // Tell Header / Dropdown
    window.dispatchEvent(
      new CustomEvent("notification:state-change", {
        detail: {
          type: "clear-read",
        },
      })
    );

    try {
      await APICallService.clearReadNotifications(
        workspaceId
      );
    } catch (err) {
      console.error(
        "Failed to clear read notifications:",
        err
      );

      // Rollback Notifications page
      setNotifications(previousNotifications);

      // Rollback Header / Dropdown
      window.dispatchEvent(
        new CustomEvent("notification:sync", {
          detail: {
            notifications:
              previousNotifications,
          },
        })
      );
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filtered = notifications.filter(
    (notification) => {
      if (tab === 1) {
        return !notification.isRead;
      }

      if (tab === 2) {
        return notification.type === "DIGEST";
      }

      if (tab === 3) {
        return notification.type === "DIRECT";
      }

      return true;
    }
  );

  // --------------------------------------------------
  // TIME AGO
  // --------------------------------------------------

  const timeAgo = (dateStr) => {
    if (!dateStr) {
      return "";
    }

    const diffMs =
      Date.now() -
      new Date(dateStr).getTime();

    const mins = Math.floor(
      diffMs / 60000
    );

    if (mins < 1) {
      return "Just now";
    }

    if (mins < 60) {
      return `${mins}m ago`;
    }

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) {
      return `${hrs}h ago`;
    }

    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const readCount =
    notifications.filter(
      (notification) =>
        notification.isRead
    ).length;

  if (!workspaceId) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          backgroundColor: darkMode ? "#020817" : "transparent",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: darkMode ? "#94a3b8" : "#64748b",
          }}
        >
          No active workspace selected.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        p: 3,
        backgroundColor: darkMode ? "#020817" : "transparent",
      }}
    >
      <Box sx={{ maxWidth: "760px" }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              color: darkMode ? "#f8fafc" : "#1e293b",
            }}
          >
            Notifications
          </Typography>

          <Box sx={{ flex: 1 }} />

          {unreadCount > 0 && (
            <Button
              onClick={markAllRead}
              sx={{
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 600,
                color: darkMode ? "#c4b5fd" : "#7c3aed",
              }}
            >
              Mark all as read
            </Button>
          )}

          {readCount > 0 && (
            <Button
              onClick={clearRead}
              sx={{
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 600,
                color: darkMode ? "#94a3b8" : "#94a3b8",
              }}
            >
              Clear read
            </Button>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: "13px",
            color: darkMode ? "#94a3b8" : "#64748b",
            mb: 2,
          }}
        >
          Digest summaries, mentions, and task alerts
          in one place
        </Typography>

        {/* FILTER TABS */}
        <Tabs
          value={tab}
          onChange={(event, value) =>
            setTab(value)
          }
          sx={{
            mb: 2,
            minHeight: "36px",

            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              minHeight: "36px",
              color: darkMode ? "#94a3b8" : "#64748b",
            },

            "& .Mui-selected": {
              color: darkMode ? "#c4b5fd !important" : "#7c3aed !important",
            },

            "& .MuiTabs-indicator": {
              backgroundColor: darkMode ? "#a78bfa" : "#7c3aed",
            },
          }}
        >
          {FILTERS.map((filter) => (
            <Tab
              key={filter}
              label={filter}
            />
          ))}
        </Tabs>

        {/* NOTIFICATIONS CONTAINER */}
        <Box
          sx={{
            border: `1px solid ${darkMode ? "#334155" : "#e5e7eb"}`,
            borderRadius: "10px",
            backgroundColor: darkMode ? "#0f172a" : "#ffffff",
            overflow: "hidden",
          }}
        >
          {loading && (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: darkMode ? "#94a3b8" : "#94a3b8",
                }}
              >
                Loading notifications...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Box
              sx={{
                py: 6,
                px: 3,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: darkMode ? "#f87171" : "#ef4444",
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {!loading &&
            !error &&
            filtered.length === 0 && (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: darkMode ? "#94a3b8" : "#94a3b8",
                  }}
                >
                  Nothing here
                </Typography>
              </Box>
            )}

          {!loading &&
            !error &&
            filtered.length > 0 &&
            filtered.map(
              (notification, index) => {
                const config =
                  TYPE_CONFIG[
                  notification.type
                  ] ||
                  TYPE_CONFIG.DIRECT;

                const Icon =
                  config.icon;

                const notificationId =
                  notification.notificationId ||
                  notification._id;

                return (
                  <Box
                    key={notificationId}
                    onClick={() =>
                      markRead(
                        notificationId
                      )
                    }
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      px: 2.5,
                      py: 2,
                      cursor: "pointer",

                      backgroundColor:
                        notification.isRead
                          ? "transparent"
                          : (darkMode ? "#1e1b4b" : "#faf9ff"),

                      borderBottom:
                        index ===
                          filtered.length - 1
                          ? "none"
                          : `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`,

                      "&:hover": {
                        backgroundColor:
                          darkMode ? "#1e293b" : "#f8fafc",
                      },
                    }}
                  >
                    {/* ICON */}
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        flexShrink: 0,
                        backgroundColor:
                          darkMode ? config.darkBg : config.bg,
                        color:
                          config.color,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 16,
                        }}
                      />
                    </Box>

                    {/* CONTENT */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "13.5px",
                            fontWeight: 700,
                            color:
                              darkMode ? "#f8fafc" : "#1e293b",
                          }}
                        >
                          {
                            notification.title
                          }
                        </Typography>

                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#7c3aed",
                            }}
                          />
                        )}

                        {notification.sentToSlack && (
                          <TagIcon
                            sx={{
                              fontSize: 13,
                              color:
                                "#0891b2",
                              ml: 0.25,
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: darkMode ? "#94a3b8" : "#64748b",
                          mt: 0.35,

                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display:
                            "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                        }}
                      >
                        {
                          notification.summary
                        }
                      </Typography>

                      <Typography
                        sx={{
                          fontSize:
                            "11.5px",
                          color:
                            darkMode ? "#64748b" : "#94a3b8",
                          mt: 0.5,
                        }}
                      >
                        {timeAgo(
                          notification.createdAt
                        )}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;