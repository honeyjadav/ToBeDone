import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { formatActivityAction } from "../../utils/activityMessages";
import APICallService from "../../services/APICallService";

/* =========================================================
   TEMPORARY NOTIFICATIONS
   Dashboard API currently does not return notifications
========================================================= */

const notifications = [
  {
    id: 1,
    title: "Task deadline approaching",
    description: "Build sticky notes feature is due soon.",
    priority: "High",
    icon: WarningAmberOutlinedIcon,
  },
  {
    id: 2,
    title: "New team member",
    description: "A new member joined your workspace.",
    priority: "Medium",
    icon: PersonAddAltOutlinedIcon,
  },
  {
    id: 3,
    title: "Task completed",
    description: "A task was marked as completed.",
    priority: "Low",
    icon: CheckCircleOutlineIcon,
  },
];

/* =========================================================
   STATUS / PRIORITY COLORS
========================================================= */

const statusColors = {
  "To Do": { background: "#f1f5f9", color: "#64748b" },
  Backlog: { background: "#f1f5f9", color: "#64748b" },
  "In Progress": { background: "#eff6ff", color: "#2563eb" },
  "In Review": { background: "#fffbeb", color: "#d97706" },
  Done: { background: "#ecfdf5", color: "#16a34a" },
};

const priorityColors = {
  High: { background: "#fee2e2", color: "#dc2626" },
  Medium: { background: "#fef3c7", color: "#d97706" },
  Low: { background: "#dcfce7", color: "#16a34a" },
};

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBackground,
  iconColor,
  isDark,
}) {
  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
        borderRadius: "10px",
        p: 2,
        minWidth: 0,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              color: isDark ? "#cbd5e1" : "#64748b",
              fontWeight: 600,
              mb: 0.75,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: "25px",
              lineHeight: 1.2,
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#1e293b",
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "9px",
            backgroundColor: iconBackground,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: "11px",
          color: "#94a3b8",
          mt: 1,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

/* =========================================================
   MONTHLY COMPLETED TASKS
========================================================= */

function MonthlyCompletedChart({ data = [], isDark }) {
  const chartData =
    data.length > 0
      ? data.map((item) => ({
          month: item.month,
          value: Number(item.value ?? item.count ?? item.completed ?? 0) || 0,
        }))
      : [{ month: "No Data", value: 0 }];

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  const gridColor = isDark ? "rgba(148, 163, 184, 0.18)" : "#e2e8f0";
  const labelColor = "#94a3b8";

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <svg
        viewBox="0 0 650 260"
        width="100%"
        height="260"
        preserveAspectRatio="none"
      >
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map((line) => {
          const y = 35 + line * 45;

          return (
            <line
              key={line}
              x1="45"
              y1={y}
              x2="625"
              y2={y}
              stroke={gridColor}
              strokeWidth="1"
            />
          );
        })}

        {/* Y axis labels */}
        {[
          maxValue,
          Math.round(maxValue * 0.75),
          Math.round(maxValue * 0.5),
          Math.round(maxValue * 0.25),
          0,
        ].map((value, index) => (
          <text
            key={index}
            x="8"
            y={40 + index * 45}
            fontSize="11"
            fill={labelColor}
          >
            {value}
          </text>
        ))}

        {/* Bars */}
        {chartData.map((item, index) => {
          const barHeight = (item.value / maxValue) * 180;

          const x = chartData.length === 1 ? 301 : 65 + index * 93;

          const y = 215 - barHeight;

          return (
            <g key={`${item.month}-${index}`}>
              <rect
                x={x}
                y={y}
                width="48"
                height={barHeight}
                rx="6"
                fill="#7c3aed"
                opacity="0.9"
              />

              <text
                x={x + 24}
                y={y - 8}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={isDark ? "#e2e8f0" : "#475569"}
              >
                {item.value}
              </text>

              <text
                x={x + 24}
                y="240"
                textAnchor="middle"
                fontSize="11"
                fill={labelColor}
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
}

/* =========================================================
   TASK STATUS CHART
========================================================= */

function TaskStatusChart({ statusBreakdown = [], isDark }) {
  const total = statusBreakdown.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0,
  );

  const statusChartColors = {
    "To Do": "#94a3b8",
    Backlog: "#94a3b8",
    "In Progress": "#3b82f6",
    "In Review": "#f59e0b",
    Done: "#22c55e",
  };

  const statusData = statusBreakdown.map((item) => ({
    label: item.status,
    value: Number(item.value || 0),
    color: statusChartColors[item.status] || "#94a3b8",
  }));

  let currentOffset = 0;

  const circumference = 2 * Math.PI * 72;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        flexWrap: "wrap",
        py: 1,
      }}
    >
      <Box
        sx={{
          width: 190,
          height: 190,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 190 190"
          width="190"
          height="190"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx="95"
            cy="95"
            r="72"
            fill="none"
            stroke={isDark ? "rgba(148, 163, 184, 0.12)" : "#f1f5f9"}
            strokeWidth="22"
          />

          {/* Status circles */}
          {statusData.map((item) => {
            const percentage = total > 0 ? item.value / total : 0;

            const dash = percentage * circumference;

            const offset = currentOffset;

            currentOffset += dash;

            return (
              <circle
                key={item.label}
                cx="95"
                cy="95"
                r="72"
                fill="none"
                stroke={item.color}
                strokeWidth="22"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>

        {/* Center */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "27px",
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#1e293b",
            }}
          >
            {total}
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              color: isDark ? "#cbd5e1" : "#94a3b8",
            }}
          >
            Total Tasks
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ minWidth: 160 }}>
        {statusData.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.2,
            }}
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                flex: 1,
                fontSize: "12px",
                color: isDark ? "#e2e8f0" : "#475569",
              }}
            >
              {item.label}
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: isDark ? "#f8fafc" : "#1e293b",
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   UPCOMING TASKS
========================================================= */

function UpcomingTasks({ tasks = [], isDark }) {
  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#1e293b",
            }}
          >
            Upcoming Tasks
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              color: isDark ? "#cbd5e1" : "#94a3b8",
              mt: 0.3,
            }}
          >
            Tasks that need your attention
          </Typography>
        </Box>

        <ScheduleOutlinedIcon sx={{ fontSize: 20, color: "#7c3aed" }} />
      </Box>

      <Divider />

      {tasks.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
            No upcoming tasks
          </Typography>
        </Box>
      ) : (
        <Box>
          {tasks.map((task) => {
            const statusStyle =
              statusColors[task.status] || statusColors["To Do"];

            const priorityStyle =
              priorityColors[task.priority] || priorityColors.Low;

            return (
              <Box
                key={task.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: isDark
                    ? "1px solid rgba(148, 163, 184, 0.15)"
                    : "1px solid #f1f5f9",

                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {/* Title + Priority */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.8,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isDark ? "#e2e8f0" : "#334155",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.title}
                  </Typography>

                  <Chip
                    label={task.priority}
                    size="small"
                    sx={{
                      height: "21px",
                      fontSize: "10px",
                      fontWeight: 600,
                      backgroundColor: priorityStyle.background,
                      color: priorityStyle.color,
                    }}
                  />
                </Box>

                {/* Assignee + Status/Due date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  {/* LEFT — Avatar + Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.7,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {task.assignees?.length > 0 ? (
                      <>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: "9px",
                            fontWeight: 700,
                            backgroundColor: "#ede9fe",
                            color: "#7c3aed",
                            flexShrink: 0,
                          }}
                        >
                          {task.assignees[0].initials}
                        </Avatar>

                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: isDark ? "#cbd5e1" : "#475569",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {task.assignees[0].name}
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
                        Unassigned
                      </Typography>
                    )}
                  </Box>

                  {/* RIGHT — Status + Due Date */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "10px",
                        fontWeight: 600,
                        backgroundColor: statusStyle.background,
                        color: statusStyle.color,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        color: isDark ? "#cbd5e1" : "#94a3b8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Due{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress bar (if provided by API) */}
                {typeof task.progress === "number" && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        height: 5,
                        borderRadius: 10,
                        backgroundColor: isDark
                          ? "rgba(148, 163, 184, 0.15)"
                          : "#f1f5f9",

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          backgroundColor: "#7c3aed",
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

/* =========================================================
   RECENT ACTIVITY
========================================================= */

function RecentActivity({ activities = [], isDark }) {
  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#1e293b",
            }}
          >
            Recent Activity
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              color: isDark ? "#cbd5e1" : "#94a3b8",
              mt: 0.3,
            }}
          >
            Latest team activity
          </Typography>
        </Box>

        <AccessTimeOutlinedIcon sx={{ fontSize: 19, color: "#7c3aed" }} />
      </Box>

      <Divider />

      {/* Activities */}
      {activities.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
            No recent activity
          </Typography>
        </Box>
      ) : (
        activities.map((activity) => {
          /*
           * formatActivityAction receives the
           * complete activity object.
           *
           * Example:
           *
           * {
           *   action: "MEMBER_INVITED",
           *   metadata: {
           *      invitedUserName: "John Doe"
           *   }
           * }
           */
          const { action, target } = formatActivityAction(activity);

          return (
            <Box
              key={activity.id || activity._id}
              sx={{
                px: 2,
                py: 1.4,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
                borderBottom: isDark
                  ? "1px solid rgba(148, 163, 184, 0.15)"
                  : "1px solid #f1f5f9",

                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: "#ede9fe",
                  color: "#7c3aed",
                  flexShrink: 0,
                }}
              >
                {activity.initials ||
                  activity.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ||
                  "?"}
              </Avatar>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Activity Message */}
                <Typography
                  sx={{
                    fontSize: "12px",
                    lineHeight: 1.5,
                    color: isDark ? "#e2e8f0" : "#475569",
                  }}
                >
                  {/* Actor */}
                  <strong
                    style={{
                      color: isDark ? "#f8fafc" : "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {activity.name || "Unknown user"}
                  </strong>{" "}
                  {/* Action */}
                  {action}
                  {/* Target */}
                  {target && (
                    <>
                      {" "}
                      <strong
                        style={{
                          color: isDark ? "#f8fafc" : "#334155",
                          fontWeight: 700,
                        }}
                      >
                        {target}
                      </strong>
                    </>
                  )}
                </Typography>

                {/* Time */}
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    color: "#94a3b8",
                    mt: 0.3,
                  }}
                >
                  {activity.time
                    ? new Date(activity.time).toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : ""}
                </Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  const userName = user?.name || "User";

  /* =====================================================
       FETCH DASHBOARD
    ===================================================== */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const workspaceId = localStorage.getItem("activeWorkspaceId");

        if (!workspaceId) {
          setError("Workspace ID not found in localStorage.");
          return;
        }

        const response = await APICallService.getDashboard(workspaceId);

        if (response.data?.success) {
          setDashboardData(response.data.data);
        } else {
          setError(response.data?.message || "Unable to load dashboard.");
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);

        setError(
          error.response?.data?.message || "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* =====================================================
       LOADING
    ===================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#020817" : "#f8fafc",
        }}
      >
        <CircularProgress size={32} thickness={4} sx={{ color: "#7c3aed" }} />
      </Box>
    );
  }

  /* =====================================================
       ERROR
    ===================================================== */

  if (error) {
    return (
      <Box
        sx={{
          height: "100%",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#020817" : "#f8fafc",
          p: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            p: 3,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#dc2626",
              mb: 1,
            }}
          >
            Unable to load dashboard
          </Typography>

          <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  /* =====================================================
       SAFETY
    ===================================================== */

  if (!dashboardData) {
    return null;
  }

  /* =====================================================
       API DATA
    ===================================================== */

  const {
    summary = {},
    statusBreakdown = [],
    monthlyCompleted = [],
    upcomingTasks = [],
    recentActivity = [],
  } = dashboardData;

  const {
    totalTasks = 0,
    completedTasks = 0,
    inProgressTasks = 0,
    teamMembers = 0,
    completionRate = 0,
  } = summary;

  /* =====================================================
       RENDER
    ===================================================== */

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: isDark ? "#020817" : "#f8fafc",
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* =================================================
                    HEADER
                ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2.5,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "20px", md: "23px" },
                fontWeight: 700,
                color: isDark ? "#f8fafc" : "#1e293b",
              }}
            >
              {getGreeting()}, {userName} 👋
            </Typography>

            <Typography
              sx={{
                fontSize: "12.5px",
                color: isDark ? "#cbd5e1" : "#64748b",
                mt: 0.5,
              }}
            >
              Here's what's happening with your workspace today.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
              borderRadius: "8px",
              px: 1.5,
              py: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
              }}
            />

            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: isDark ? "#e2e8f0" : "#475569",
              }}
            >
              Workspace active
            </Typography>
          </Box>
        </Box>

        {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <SummaryCard
            title="Total Tasks"
            value={totalTasks}
            subtitle="All active work items"
            icon={AssignmentOutlinedIcon}
            iconBackground="#ede9fe"
            iconColor="#7c3aed"
            isDark={isDark}
          />

          <SummaryCard
            title="Completed"
            value={completedTasks}
            subtitle="Tasks marked as done"
            icon={CheckCircleOutlineIcon}
            iconBackground="#dcfce7"
            iconColor="#16a34a"
            isDark={isDark}
          />

          <SummaryCard
            title="In Progress"
            value={inProgressTasks}
            subtitle="Currently being worked on"
            icon={TrendingUpIcon}
            iconBackground="#dbeafe"
            iconColor="#2563eb"
            isDark={isDark}
          />

          <SummaryCard
            title="Team Members"
            value={teamMembers}
            subtitle="Active workspace members"
            icon={GroupOutlinedIcon}
            iconBackground="#fef3c7"
            iconColor="#d97706"
            isDark={isDark}
          />

          <SummaryCard
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle="Overall project progress"
            icon={TrendingUpIcon}
            iconBackground="#f3e8ff"
            iconColor="#9333ea"
            isDark={isDark}
          />
        </Box>

        {/* =================================================
                    ANALYTICS
                ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
            gap: 1.5,
            mb: 1.5,
          }}
        >
          {/* Monthly Completed */}

          <Box
            sx={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
              borderRadius: "10px",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: isDark ? "#f8fafc" : "#1e293b",
                  }}
                >
                  Completed Tasks
                </Typography>

                <Typography
                  sx={{
                    fontSize: "11px",
                    color: isDark ? "#cbd5e1" : "#94a3b8",
                    mt: 0.3,
                  }}
                >
                  Monthly completion trend
                </Typography>
              </Box>

              <Chip
                label={`${completionRate}%`}
                size="small"
                sx={{
                  height: "23px",
                  fontSize: "10px",
                  fontWeight: 600,
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                }}
              />
            </Box>

            <MonthlyCompletedChart data={monthlyCompleted} isDark={isDark} />
          </Box>

          {/* Status Chart */}

          <Box
            sx={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.2)" : "#e2e8f0"}`,
              borderRadius: "10px",
              p: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: isDark ? "#f8fafc" : "#1e293b",
              }}
            >
              Task Status
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: isDark ? "#cbd5e1" : "#94a3b8",
                mt: 0.3,
              }}
            >
              Current project distribution
            </Typography>

            <TaskStatusChart
              statusBreakdown={statusBreakdown}
              isDark={isDark}
            />
          </Box>
        </Box>

        {/* =================================================
                    LOWER CONTENT
                ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
            gap: 1.5,
          }}
        >
          {/* LEFT */}

          <Box>
            <UpcomingTasks tasks={upcomingTasks} isDark={isDark} />
          </Box>

          {/* RIGHT */}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <RecentActivity activities={recentActivity} isDark={isDark} />

            {/* <NotificationsPanel isDark={isDark} /> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}