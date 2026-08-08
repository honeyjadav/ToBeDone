import { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ProfileDetails from "./ProfileDetails";
import ChangePassword from "./ChangePassword";

export default function Profile() {
    const [activeTab, setActiveTab] = useState(0);

    const user = {
        name: "John Doe",
        email: "john@example.com",
        avatar: "",
        authProvider: "local",
        isEmailVerified: true,
        isActive: true,
        role: "Admin",
        workspace: "My Workspace",
        lastLogin: "Aug 08, 2026",
        createdAt: "Aug 01, 2026",
    };

    const navigationItems = [
        {
            label: "Profile",
            icon: PersonOutlineIcon,
        },
        {
            label: "Change Password",
            icon: LockOutlinedIcon,
        },
    ];

    return (
        <Box
            sx={{
                height: "100%",
                minHeight: 0,
                p: 3,
                overflow: "hidden",
            }}
        >
            {/* ================= MAIN TWO COLUMN LAYOUT ================= */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "190px minmax(0, 1fr)",
                    },
                    columnGap: 4,
                    height: "100%",
                    minHeight: 0,
                }}
            >
                {/* ================= LEFT SIDE ================= */}
                <Box
                    sx={{
                        minWidth: 0,
                    }}
                >
                    {/* Page Title */}
                    <Typography
                        sx={{
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "#1e293b",
                            mb: 1.5,
                        }}
                    >
                        Profile
                    </Typography>

                    {/* Avatar + Username */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 3,
                        }}
                    >
                        <Avatar
                            src={user.avatar || undefined}
                            sx={{
                                width: 40,
                                height: 40,
                                fontSize: "16px",
                                fontWeight: 700,
                                backgroundColor: "#ede9fe",
                                color: "#7c3aed",
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#334155",
                            }}
                        >
                            {user.name}
                        </Typography>
                    </Box>

                    {/* Account */}
                    <Typography
                        sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            mb: 1,
                            px: 1,
                        }}
                    >
                        Account
                    </Typography>

                    {/* Navigation */}
                    <Box>
                        {navigationItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = activeTab === index;

                            return (
                                <Box
                                    key={item.label}
                                    onClick={() =>
                                        setActiveTab(index)
                                    }
                                    sx={{
                                        height: "40px",
                                        px: 1,
                                        mb: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        borderRadius: "6px",
                                        cursor: "pointer",

                                        backgroundColor: isActive
                                            ? "#f3f0fe"
                                            : "transparent",

                                        "&:hover": {
                                            backgroundColor:
                                                isActive
                                                    ? "#f3f0fe"
                                                    : "#f8fafc",
                                        },
                                    }}
                                >
                                    <Icon
                                        sx={{
                                            fontSize: 18,
                                            color: isActive
                                                ? "#7c3aed"
                                                : "#64748b",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            flex: 1,
                                            fontSize: "13px",
                                            fontWeight: isActive
                                                ? 600
                                                : 500,
                                            color: isActive
                                                ? "#7c3aed"
                                                : "#475569",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>

                                    {isActive && (
                                        <ChevronRightIcon
                                            sx={{
                                                fontSize: 16,
                                                color: "#7c3aed",
                                            }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* ================= RIGHT SIDE ================= */}
                <Box
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        overflowY: "auto",
                    }}
                >
                    {activeTab === 0 && (
                        <ProfileDetails user={user} />
                    )}

                    {activeTab === 1 && (
                        <ChangePassword />
                    )}
                </Box>
            </Box>
        </Box>
    );
}