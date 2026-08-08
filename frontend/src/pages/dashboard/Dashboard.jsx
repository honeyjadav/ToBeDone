import {
    Box,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
    Divider,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

/* =========================================================
   TEMPORARY DATA
   Later replace these with API data
========================================================= */

const tasks = [
    {
        id: "TB-101",
        title: "Set up authentication flow",
        status: "Done",
        priority: "High",
        assignee: "JD",
        dueDate: "Aug 08",
        progress: 100,
    },
    {
        id: "TB-102",
        title: "Design dashboard wireframes",
        status: "Done",
        priority: "Medium",
        assignee: "AK",
        dueDate: "Aug 09",
        progress: 100,
    },
    {
        id: "TB-103",
        title: "Build sticky notes feature",
        status: "In Progress",
        priority: "High",
        assignee: "JD",
        dueDate: "Aug 11",
        progress: 65,
    },
    {
        id: "TB-104",
        title: "Integrate AI digest summary",
        status: "In Progress",
        priority: "Medium",
        assignee: "RS",
        dueDate: "Aug 13",
        progress: 45,
    },
    {
        id: "TB-105",
        title: "Fix sidebar overlap on header",
        status: "In Review",
        priority: "High",
        assignee: "JD",
        dueDate: "Aug 14",
        progress: 85,
    },
    {
        id: "TB-106",
        title: "Write unit tests for chat module",
        status: "In Review",
        priority: "Low",
        assignee: "AK",
        dueDate: "Aug 16",
        progress: 75,
    },
];

const activities = [
    {
        id: 1,
        user: "JD",
        name: "John Doe",
        action: "completed",
        task: "Set up authentication flow",
        time: "10 minutes ago",
        icon: CheckCircleOutlineIcon,
    },
    {
        id: 2,
        user: "AK",
        name: "Alex Kumar",
        action: "updated",
        task: "Dashboard wireframes",
        time: "35 minutes ago",
        icon: TaskAltOutlinedIcon,
    },
    {
        id: 3,
        user: "RS",
        name: "Rahul Shah",
        action: "started",
        task: "AI digest summary",
        time: "1 hour ago",
        icon: AutoAwesomeOutlinedIcon,
    },
    {
        id: 4,
        user: "JD",
        name: "John Doe",
        action: "sent a message in",
        task: "Development Team",
        time: "2 hours ago",
        icon: ChatBubbleOutlineIcon,
    },
];

const notifications = [
    {
        id: 1,
        title: "Task deadline approaching",
        description: "Build sticky notes feature is due in 2 days.",
        priority: "High",
        icon: WarningAmberOutlinedIcon,
    },
    {
        id: 2,
        title: "New team member",
        description: "Rahul Shah joined My Workspace.",
        priority: "Medium",
        icon: PersonAddAltOutlinedIcon,
    },
    {
        id: 3,
        title: "Task completed",
        description: "Authentication flow was completed.",
        priority: "Low",
        icon: CheckCircleOutlineIcon,
    },
];

/* =========================================================
   HELPERS
========================================================= */

const statusColors = {
    Backlog: {
        background: "#f1f5f9",
        color: "#64748b",
    },
    "In Progress": {
        background: "#eff6ff",
        color: "#2563eb",
    },
    "In Review": {
        background: "#fffbeb",
        color: "#d97706",
    },
    Done: {
        background: "#ecfdf5",
        color: "#16a34a",
    },
};

const priorityColors = {
    High: {
        background: "#fee2e2",
        color: "#dc2626",
    },
    Medium: {
        background: "#fef3c7",
        color: "#d97706",
    },
    Low: {
        background: "#dcfce7",
        color: "#16a34a",
    },
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
}) {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
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
                            color: "#64748b",
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
                            color: "#1e293b",
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
   MONTHLY COMPLETED TASKS SVG CHART
========================================================= */

function MonthlyCompletedChart() {
    const data = [
        { month: "Mar", value: 8 },
        { month: "Apr", value: 13 },
        { month: "May", value: 11 },
        { month: "Jun", value: 18 },
        { month: "Jul", value: 22 },
        { month: "Aug", value: 28 },
    ];

    const maxValue = 30;

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
                            stroke="#e2e8f0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Y axis labels */}
                {[30, 20, 15, 10, 0].map((value, index) => (
                    <text
                        key={value}
                        x="8"
                        y={40 + index * 45}
                        fontSize="11"
                        fill="#94a3b8"
                    >
                        {value}
                    </text>
                ))}

                {/* Bars */}
                {data.map((item, index) => {
                    const barHeight =
                        (item.value / maxValue) * 180;

                    const x = 65 + index * 93;

                    const y = 215 - barHeight;

                    return (
                        <g key={item.month}>
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
                                fill="#475569"
                            >
                                {item.value}
                            </text>

                            <text
                                x={x + 24}
                                y="240"
                                textAnchor="middle"
                                fontSize="11"
                                fill="#94a3b8"
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
   TASK STATUS SVG CHART
========================================================= */

function TaskStatusChart() {
    const total = tasks.length;

    const statusData = [
        {
            label: "Done",
            value: tasks.filter(
                (task) => task.status === "Done"
            ).length,
            color: "#22c55e",
        },
        {
            label: "In Progress",
            value: tasks.filter(
                (task) => task.status === "In Progress"
            ).length,
            color: "#3b82f6",
        },
        {
            label: "In Review",
            value: tasks.filter(
                (task) => task.status === "In Review"
            ).length,
            color: "#f59e0b",
        },
        {
            label: "Backlog",
            value: tasks.filter(
                (task) => task.status === "Backlog"
            ).length,
            color: "#94a3b8",
        },
    ];

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
                    style={{
                        transform: "rotate(-90deg)",
                    }}
                >
                    <circle
                        cx="95"
                        cy="95"
                        r="72"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="22"
                    />

                    {statusData.map((item) => {
                        const percentage =
                            total > 0
                                ? item.value / total
                                : 0;

                        const dash =
                            percentage * circumference;

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
                            color: "#1e293b",
                        }}
                    >
                        {total}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94a3b8",
                        }}
                    >
                        Total Tasks
                    </Typography>
                </Box>
            </Box>

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
                                color: "#475569",
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#1e293b",
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

function UpcomingTasks() {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
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
                            color: "#1e293b",
                        }}
                    >
                        Upcoming Tasks
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            mt: 0.3,
                        }}
                    >
                        Tasks that need your attention
                    </Typography>
                </Box>

                <ScheduleOutlinedIcon
                    sx={{
                        fontSize: 20,
                        color: "#7c3aed",
                    }}
                />
            </Box>

            <Divider />

            <Box>
                {tasks.slice(2, 6).map((task) => {
                    const statusStyle =
                        statusColors[task.status];

                    const priorityStyle =
                        priorityColors[task.priority];

                    return (
                        <Box
                            key={task.id}
                            sx={{
                                px: 2,
                                py: 1.5,
                                borderBottom:
                                    "1px solid #f1f5f9",

                                "&:last-child": {
                                    borderBottom: "none",
                                },
                            }}
                        >
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
                                        color: "#334155",
                                        flex: 1,
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap",
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
                                        backgroundColor:
                                            priorityStyle.background,
                                        color:
                                            priorityStyle.color,
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0.7,
                                }}
                            >
                                <Chip
                                    label={task.status}
                                    size="small"
                                    sx={{
                                        height: "20px",
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        backgroundColor:
                                            statusStyle.background,
                                        color:
                                            statusStyle.color,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        color: "#94a3b8",
                                    }}
                                >
                                    Due {task.dueDate}
                                </Typography>

                                <Box sx={{ flex: 1 }} />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: "#64748b",
                                    }}
                                >
                                    {task.progress}%
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={task.progress}
                                sx={{
                                    height: 5,
                                    borderRadius: 10,
                                    backgroundColor:
                                        "#f1f5f9",

                                    "& .MuiLinearProgress-bar":
                                        {
                                            borderRadius: 10,
                                            backgroundColor:
                                                "#7c3aed",
                                        },
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

/* =========================================================
   RECENT ACTIVITY
========================================================= */

function RecentActivity() {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
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
                            color: "#1e293b",
                        }}
                    >
                        Recent Activity
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            mt: 0.3,
                        }}
                    >
                        Latest team activity
                    </Typography>
                </Box>

                <AccessTimeOutlinedIcon
                    sx={{
                        fontSize: 19,
                        color: "#7c3aed",
                    }}
                />
            </Box>

            <Divider />

            {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                    <Box
                        key={activity.id}
                        sx={{
                            px: 2,
                            py: 1.4,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            borderBottom:
                                "1px solid #f1f5f9",

                            "&:last-child": {
                                borderBottom: "none",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                                fontSize: "10px",
                                fontWeight: 700,
                                backgroundColor:
                                    "#ede9fe",
                                color: "#7c3aed",
                            }}
                        >
                            {activity.user}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    lineHeight: 1.5,
                                    color: "#475569",
                                }}
                            >
                                <strong>
                                    {activity.name}
                                </strong>{" "}
                                {activity.action}{" "}
                                <strong>
                                    {activity.task}
                                </strong>
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "10.5px",
                                    color: "#94a3b8",
                                    mt: 0.3,
                                }}
                            >
                                {activity.time}
                            </Typography>
                        </Box>

                        <Icon
                            sx={{
                                fontSize: 17,
                                color: "#94a3b8",
                            }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationsPanel() {
    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <NotificationsNoneOutlinedIcon
                    sx={{
                        fontSize: 20,
                        color: "#7c3aed",
                    }}
                />

                <Box>
                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#1e293b",
                        }}
                    >
                        Notifications
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            mt: 0.3,
                        }}
                    >
                        Important updates
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {notifications.map((notification) => {
                const Icon = notification.icon;

                const colors = {
                    High: {
                        background: "#fee2e2",
                        color: "#dc2626",
                    },
                    Medium: {
                        background: "#fef3c7",
                        color: "#d97706",
                    },
                    Low: {
                        background: "#dcfce7",
                        color: "#16a34a",
                    },
                };

                const style =
                    colors[notification.priority];

                return (
                    <Box
                        key={notification.id}
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: "flex",
                            gap: 1.2,
                            borderBottom:
                                "1px solid #f1f5f9",

                            "&:last-child": {
                                borderBottom: "none",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                backgroundColor:
                                    style.background,
                                color: style.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{ fontSize: 17 }} />
                        </Box>

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
                                    gap: 0.8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#334155",
                                        flex: 1,
                                    }}
                                >
                                    {notification.title}
                                </Typography>

                                <Chip
                                    label={
                                        notification.priority
                                    }
                                    size="small"
                                    sx={{
                                        height: "19px",
                                        fontSize: "9px",
                                        fontWeight: 600,
                                        backgroundColor:
                                            style.background,
                                        color:
                                            style.color,
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "10.5px",
                                    color: "#94a3b8",
                                    lineHeight: 1.5,
                                    mt: 0.4,
                                }}
                            >
                                {notification.description}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Done"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const completionRate =
        totalTasks > 0
            ? Math.round(
                  (completedTasks / totalTasks) * 100
              )
            : 0;

    const teamMembers = 3;

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                backgroundColor: "#f8fafc",
            }}
        >
            <Box
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                    },
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
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        gap: 2,
                        mb: 2.5,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "20px",
                                    md: "23px",
                                },
                                fontWeight: 700,
                                color: "#1e293b",
                            }}
                        >
                            Good evening, John 👋
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "12.5px",
                                color: "#64748b",
                                mt: 0.5,
                            }}
                        >
                            Here's what's happening
                            with your workspace today.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            backgroundColor:
                                "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius:
                                    "50%",
                                backgroundColor:
                                    "#22c55e",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#475569",
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
                    />

                    <SummaryCard
                        title="Completed"
                        value={completedTasks}
                        subtitle="Tasks marked as done"
                        icon={CheckCircleOutlineIcon}
                        iconBackground="#dcfce7"
                        iconColor="#16a34a"
                    />

                    <SummaryCard
                        title="In Progress"
                        value={inProgressTasks}
                        subtitle="Currently being worked on"
                        icon={TrendingUpIcon}
                        iconBackground="#dbeafe"
                        iconColor="#2563eb"
                    />

                    <SummaryCard
                        title="Team Members"
                        value={teamMembers}
                        subtitle="Active workspace members"
                        icon={GroupOutlinedIcon}
                        iconBackground="#fef3c7"
                        iconColor="#d97706"
                    />

                    <SummaryCard
                        title="Completion Rate"
                        value={`${completionRate}%`}
                        subtitle="Overall project progress"
                        icon={TrendingUpIcon}
                        iconBackground="#f3e8ff"
                        iconColor="#9333ea"
                    />
                </Box>

                {/* =================================================
                    ANALYTICS
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1.6fr 1fr",
                        },
                        gap: 1.5,
                        mb: 1.5,
                    }}
                >
                    {/* Monthly chart */}

                    <Box
                        sx={{
                            backgroundColor:
                                "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                mb: 1,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize:
                                            "15px",
                                        fontWeight: 700,
                                        color: "#1e293b",
                                    }}
                                >
                                    Completed Tasks
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "11px",
                                        color: "#94a3b8",
                                        mt: 0.3,
                                    }}
                                >
                                    Monthly completion
                                    trend
                                </Typography>
                            </Box>

                            <Chip
                                label="+18%"
                                size="small"
                                sx={{
                                    height: "23px",
                                    fontSize:
                                        "10px",
                                    fontWeight: 600,
                                    backgroundColor:
                                        "#dcfce7",
                                    color: "#16a34a",
                                }}
                            />
                        </Box>

                        <MonthlyCompletedChart />
                    </Box>

                    {/* Status chart */}

                    <Box
                        sx={{
                            backgroundColor:
                                "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            p: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#1e293b",
                            }}
                        >
                            Task Status
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: "#94a3b8",
                                mt: 0.3,
                            }}
                        >
                            Current project distribution
                        </Typography>

                        <TaskStatusChart />
                    </Box>
                </Box>

                {/* =================================================
                    LOWER CONTENT
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1.5fr 1fr",
                        },
                        gap: 1.5,
                    }}
                >
                    {/* LEFT */}

                    <Box>
                        <UpcomingTasks />
                    </Box>

                    {/* RIGHT */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        <RecentActivity />

                        <NotificationsPanel />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}