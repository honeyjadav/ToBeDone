import {
    Box,
    Typography,
    Avatar,
    Chip,
    Checkbox,
} from "@mui/material";

const ROLE_CONFIG = {
    Admin: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
    },
    Manager: {
        backgroundColor: "#fef3c7",
        color: "#d97706",
    },
    Member: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
    },
};

export default function UserTable({
    users,
    selected,
    onToggleSelect,
    onToggleSelectAll,
}) {
    const allSelected =
        users.length > 0 &&
        users.every((user) => selected.includes(user.id));

    const someSelected = users.some((user) =>
        selected.includes(user.id)
    );

    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
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
                    borderBottom: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    flexShrink: 0,
                }}
            >
                {/* Select All */}
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
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        ID
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
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Name
                    </Typography>
                </Box>

                {/* Email */}
                <Box
                    sx={{
                        flex: 1,
                        px: 1.5,
                        py: 1.25,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Email
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
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#475569",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                        }}
                    >
                        Is Active
                    </Typography>
                </Box>

                {/* Role */}
                <Box
                    sx={{
                        width: "180px",
                        px: 1.5,
                        py: 1.25,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#475569",
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
                                color: "#94a3b8",
                            }}
                        >
                            No users to show
                        </Typography>
                    </Box>
                ) : (
                    users.map((user) => {
                        const roleStyle =
                            ROLE_CONFIG[user.role];

                        const isChecked =
                            selected.includes(user.id);

                        return (
                            <Box
                                key={user.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom:
                                        "1px solid #f1f5f9",
                                    backgroundColor: isChecked
                                        ? "#f5f3ff"
                                        : "transparent",

                                    "&:hover": {
                                        backgroundColor: isChecked
                                            ? "#f5f3ff"
                                            : "#f8fafc",
                                    },

                                    "&:last-of-type": {
                                        borderBottom: "none",
                                    },
                                }}
                            >
                                {/* Checkbox */}
                                <Box
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
                                            color: "#7c3aed",
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
                                            color: "#334155",
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
                                            backgroundColor: "#ede9fe",
                                            color: "#7c3aed",
                                        }}
                                    >
                                        {user.email
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontSize: "13px",
                                            color: "#334155",
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
                                        label={user.isActive ? "Active" : "Inactive"}
                                        size="small"
                                        sx={{
                                            height: "22px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            backgroundColor: user.isActive
                                                ? "#dcfce7"
                                                : "#f1f5f9",
                                            color: user.isActive
                                                ? "#16a34a"
                                                : "#64748b",
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