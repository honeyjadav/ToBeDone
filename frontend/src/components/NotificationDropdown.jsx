import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  Badge,
  Divider,
  Button,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useNavigate } from "react-router-dom";

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
   TASK: {
    icon: AssignmentIcon,
    color: "#059669",
    bg: "#ecfdf5",
  },
};

export default function NotificationDropdown({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onOpenNotification,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  const navigate = useNavigate();

  const [now, setNow] = useState(() => Date.now());

  // Keep previous notifications so we can detect NEW notifications
  const previousNotificationsRef = useRef([]);

  // Prevent sound from playing on the first API load
  const initializedRef = useRef(false);

  // --------------------------------------------------
  // UPDATE "TIME AGO"
  // --------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // --------------------------------------------------
  // NEW NOTIFICATION DETECTION
  // --------------------------------------------------

  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      return;
    }

    const currentIds = notifications.map(
      (notification) =>
        notification.notificationId ||
        notification._id ||
        notification.id
    );

    // First API load:
    // don't play notification sound for existing notifications
    if (!initializedRef.current) {
      previousNotificationsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }

    const previousIds = previousNotificationsRef.current;

    const hasNewNotification = currentIds.some(
      (id) => !previousIds.includes(id)
    );

    if (hasNewNotification) {
      playNotificationSound();

      // Start bell animation
      setIsRinging(true);

      // Stop animation after 1 second
      const animationTimer = setTimeout(() => {
        setIsRinging(false);
      }, 1000);

      previousNotificationsRef.current = currentIds;

      return () => clearTimeout(animationTimer);
    }

    previousNotificationsRef.current = currentIds;
  }, [notifications]);

  // --------------------------------------------------
  // PLAY NOTIFICATION SOUND
  // --------------------------------------------------

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/sounds/notification.mp3");

      audio.volume = 0.5;

      audio
        .play()
        .catch((error) => {
          // Browser may block autoplay until user interacts
          console.warn(
            "Notification sound could not be played:",
            error
          );
        });
    } catch (error) {
      console.error(
        "Notification sound error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // UNREAD COUNT
  // --------------------------------------------------

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // --------------------------------------------------
  // OPEN NOTIFICATION
  // --------------------------------------------------

  const handleItemClick = (notification) => {
    const notificationId =
      notification.notificationId ||
      notification._id ||
      notification.id;

    if (!notification.isRead) {
      onMarkRead?.(notificationId);
    }

    onOpenNotification?.(notification);

    setAnchorEl(null);
  };

  // --------------------------------------------------
  // TIME AGO
  // --------------------------------------------------

  const timeAgo = (dateStr) => {
    if (!dateStr) {
      return "";
    }

    const diffMs =
      now - new Date(dateStr).getTime();

    const mins = Math.floor(diffMs / 60000);

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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      {/* Notification Bell */}

      <IconButton
        onClick={(event) =>
          setAnchorEl(event.currentTarget)
        }
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          width: 36,
          height: 36,

          // Bell animation
          ...(isRinging && {
            animation:
              "notificationBellRing 0.8s ease-in-out",
          }),

          "@keyframes notificationBellRing": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "10%": {
              transform: "rotate(18deg)",
            },
            "20%": {
              transform: "rotate(-18deg)",
            },
            "30%": {
              transform: "rotate(14deg)",
            },
            "40%": {
              transform: "rotate(-14deg)",
            },
            "50%": {
              transform: "rotate(8deg)",
            },
            "60%": {
              transform: "rotate(-8deg)",
            },
            "70%": {
              transform: "rotate(4deg)",
            },
            "80%": {
              transform: "rotate(-4deg)",
            },
            "100%": {
              transform: "rotate(0deg)",
            },
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "9px",
              height: 15,
              minWidth: 15,
            },
          }}
        >
          <NotificationsIcon
            sx={{
              fontSize: 18,
              color: "#64748b",
            }}
          />
        </Badge>
      </IconButton>

      {/* Notification Menu */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 440,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden !important",
            },
          },

          list: {
            sx: {
              p: 0,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              flex: 1,
              overflow: "hidden !important",
            },
          },
        }}
      >
        {/* Header */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1.5,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Notifications
          </Typography>

          <Box sx={{ flex: 1 }} />

          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllRead}
              sx={{
                textTransform: "none",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#7c3aed",
                minWidth: "auto",
                p: 0.5,
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Notifications */}

        {notifications.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "#94a3b8",
              }}
            >
              You're all caught up
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              overflowY: "auto",
              minHeight: 0,
              flex: 1,
              maxHeight: 320,

              "&::-webkit-scrollbar": {
                width: "4px",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "999px",
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },

              scrollbarWidth: "thin",
              scrollbarColor:
                "#cbd5e1 transparent",
            }}
          >
            {notifications.map((notification) => {
              const config =
                TYPE_CONFIG[notification.type] ||
                TYPE_CONFIG.DIRECT;

              const Icon = config.icon;

              const notificationId =
                notification.notificationId ||
                notification._id ||
                notification.id;

              return (
                <Box
                  key={notificationId}
                  onClick={() =>
                    handleItemClick(notification)
                  }
                  sx={{
                    display: "flex",
                    gap: 1.25,
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",

                    backgroundColor:
                      notification.isRead
                        ? "transparent"
                        : "#faf9ff",

                    borderBottom:
                      "1px solid #f1f5f9",

                    "&:hover": {
                      backgroundColor:
                        "#f8fafc",
                    },
                  }}
                >
                  {/* Icon */}

                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      flexShrink: 0,

                      backgroundColor:
                        config.bg,

                      color:
                        config.color,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 15,
                      }}
                    />
                  </Box>

                  {/* Content */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {notification.title}
                      </Typography>

                      {!notification.isRead && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor:
                              "#7c3aed",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        color: "#64748b",
                        mt: 0.25,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient:
                          "vertical",
                      }}
                    >
                      {notification.summary}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#94a3b8",
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
            })}
          </Box>
        )}

        <Divider />

        {/* View All */}

        <Box
          sx={{
            px: 1,
            py: 1,
            flexShrink: 0,
          }}
        >
          <Button
            fullWidth
            onClick={() => {
              setAnchorEl(null);
              navigate(
                "/dashboard/notifications"
              );
            }}
            sx={{
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
}

