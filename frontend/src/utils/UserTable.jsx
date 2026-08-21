import {
    Box,
    Typography,
    Avatar,
    Chip,
    Checkbox,
} from "@mui/material";

// Provide dynamic role styles based on dark mode
const getRoleConfig = (darkMode) => ({
    Admin: {
        backgroundColor: darkMode ? "#7f1d1d" : "#fee2e2",
        color: darkMode ? "#fca5a5" : "#dc2626",
    },
    Manager: {
        backgroundColor: darkMode ? "#78350f" : "#fef3c7",
        color: darkMode ? "#fcd34d" : "#d97706",
    },
    Member: {
        backgroundColor: darkMode ? "#14532d" : "#dcfce7",
        color: darkMode ? "#86efac" : "#16a34a",
    },
});

export default function UserTable({
    users,
    selected,
    onToggleSelect,
    onToggleSelectAll,
    onUserClick,
    darkMode,
}) {
    const allSelected =
        users.length > 0 &&
        users.every((user) => selected.includes(user.id));

    const someSelected = users.some((user) =>
        selected.includes(user.id)
    );

    const ROLE_CONFIG = getRoleConfig(darkMode);

    return (
        <Box
            sx={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                    backgroundColor: darkMode ? "#1e293b" : "#f8fafc",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() =>
                            onToggleSelectAll(
                                users.map((user) => user.id)
                            )
                        }
                        sx={{ color: darkMode ? '#64748b' : undefined }}
                    />
                </Box>

                <Box sx={{ width: "120px", px: 1.5, py: 1.25 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: darkMode ? "#94a3b8" : "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        ID
                    </Typography>
                </Box>

                <Box sx={{ width: "180px", px: 1.5, py: 1.25 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: darkMode ? "#94a3b8" : "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Name
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, px: 1.5, py: 1.25 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: darkMode ? "#94a3b8" : "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Email
                    </Typography>
                </Box>

                <Box sx={{ width: "140px", px: 1.5, py: 1.25 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: darkMode ? "#94a3b8" : "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Is Active
                    </Typography>
                </Box>

                <Box sx={{ width: "180px", px: 1.5, py: 1.25 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: darkMode ? "#94a3b8" : "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Role
                    </Typography>
                </Box>
            </Box>

            {/* Rows */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                {users.length === 0 ? (
                    <Box
                        sx={{
                            py: 5,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: darkMode ? "#64748b" : "#94a3b8",
                            }}
                        >
                            No users to show
                        </Typography>
                    </Box>
                ) : (
                    users.map((user) => {
                        const roleStyle =
                            ROLE_CONFIG[user.role] ||
                            ROLE_CONFIG.Member;

                        const isChecked =
                            selected.includes(user.id);

                        return (
                            <Box
                                key={user.id}
                                onClick={() => onUserClick?.(user)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`,
                                    backgroundColor: isChecked
                                        ? (darkMode ? "#2e1065" : "#f5f3ff")
                                        : "transparent",

                                    cursor: "pointer",

                                    "&:hover": {
                                        backgroundColor: isChecked
                                            ? (darkMode ? "#2e1065" : "#f5f3ff")
                                            : (darkMode ? "#1e293b" : "#f8fafc"),
                                    },

                                    "&:last-of-type": {
                                        borderBottom: "none",
                                    },
                                }}
                            >
                                {/* Checkbox */}
                                <Box
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                    sx={{
                                        width: "50px",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onChange={() =>
                                            onToggleSelect(user.id)
                                        }
                                        sx={{ color: darkMode ? '#64748b' : undefined }}
                                    />
                                </Box>

                                {/* ID */}
                                <Box
                                    sx={{
                                        width: "120px",
                                        px: 1.5,
                                        py: 1.25,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: darkMode ? "#a78bfa" : "#7c3aed",
                                        }}
                                    >
                                        {user.id}
                                    </Typography>
                                </Box>

                                {/* Name */}
                                <Box
                                    sx={{
                                        width: "180px",
                                        px: 1.5,
                                        py: 1.25,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: darkMode ? "#f8fafc" : "#334155",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user.name || "—"}
                                    </Typography>
                                </Box>

                                {/* Email */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        px: 1.5,
                                        py: 1.25,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            backgroundColor: darkMode ? "#312e81" : "#ede9fe",
                                            color: darkMode ? "#c4b5fd" : "#7c3aed",
                                        }}
                                    >
                                        {user.email
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontSize: "13px",
                                            color: darkMode ? "#cbd5e1" : "#334155",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user.email}
                                    </Typography>
                                </Box>

                                {/* Is Active */}
                                <Box
                                    sx={{
                                        width: "140px",
                                        px: 1.5,
                                        py: 1.25,
                                    }}
                                >
                                    <Chip
                                        label={
                                            user.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        size="small"
                                        sx={{
                                            height: "22px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            backgroundColor:
                                                user.isActive
                                                    ? (darkMode ? "#14532d" : "#dcfce7")
                                                    : (darkMode ? "#334155" : "#f1f5f9"),
                                            color:
                                                user.isActive
                                                    ? (darkMode ? "#86efac" : "#16a34a")
                                                    : (darkMode ? "#94a3b8" : "#64748b"),
                                        }}
                                    />
                                </Box>

                                {/* Role */}
                                <Box
                                    sx={{
                                        width: "180px",
                                        px: 1.5,
                                        py: 1.25,
                                    }}
                                >
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        sx={{
                                            height: "22px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            backgroundColor:
                                                roleStyle.backgroundColor,
                                            color:
                                                roleStyle.color,
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}