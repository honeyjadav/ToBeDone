import { useEffect, useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TagIcon from "@mui/icons-material/Tag";
import APICallService from "../services/APICallService";
import { useAuth } from "../hooks/useAuth";

const TYPE_CONFIG = {
  DIGEST: {
    icon: AutoAwesomeIcon,
    color: "#7c3aed",
    bg: "#f3f0fe",
  },
  DIRECT: {
    icon: AlternateEmailIcon,
    color: "#3b82f6",
    bg: "#eff6ff",
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

  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET NOTIFICATIONS
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
  // MARK ONE AS READ
  // --------------------------------------------------

  const markRead = async (notificationId) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === notificationId ||
        notification._id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
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
          setNotifications(
            response.data.data || []
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
    const previousNotifications = notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
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

      // Rollback
      setNotifications(previousNotifications);
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

  // --------------------------------------------------
  // NO WORKSPACE
  // --------------------------------------------------

  if (!workspaceId) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          No active workspace selected.
        </Typography>
      </Box>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        p: 3,
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
              color: "#1e293b",
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
                color: "#7c3aed",
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: "13px",
            color: "#64748b",
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
              color: "#64748b",
            },

            "& .Mui-selected": {
              color:
                "#7c3aed !important",
            },

            "& .MuiTabs-indicator": {
              backgroundColor:
                "#7c3aed",
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
            border:
              "1px solid #e5e7eb",
            borderRadius: "10px",
            backgroundColor:
              "#ffffff",
            overflow: "hidden",
          }}
        >

          {/* LOADING */}

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
                  color: "#94a3b8",
                }}
              >
                Loading notifications...
              </Typography>
            </Box>
          )}

          {/* ERROR */}

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
                  color: "#ef4444",
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

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
                    color: "#94a3b8",
                  }}
                >
                  Nothing here
                </Typography>
              </Box>
            )}

          {/* NOTIFICATION LIST */}

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
                          : "#faf9ff",

                      borderBottom:
                        index ===
                        filtered.length - 1
                          ? "none"
                          : "1px solid #f1f5f9",

                      "&:hover": {
                        backgroundColor:
                          "#f8fafc",
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
                          config.bg,
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
                              "#1e293b",
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
                          color: "#64748b",
                          mt: 0.35,
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
                            "#94a3b8",
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

