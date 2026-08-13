import { useCallback, useEffect, useState } from "react";

import {
    Box,
    Typography,
    Avatar,
    CircularProgress,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ProfileDetails from "./ProfileDetails";
import ChangePassword from "./ChangePassword";

import APICallService from "../../services/APICallService";

export default function Profile() {
    const [activeTab, setActiveTab] = useState(0);

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);

    // =====================================================
    // ACTIVE WORKSPACE
    // =====================================================

    const [workspace, setWorkspace] = useState(null);

    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            // -------------------------------------------------
            // 1. GET LOGGED-IN USER
            // -------------------------------------------------

            const meResponse =
                await APICallService.getMe();

            console.log(
                "GET ME RESPONSE:",
                meResponse
            );

            const userData =
                meResponse?.data?.data;

            if (!userData) {
                throw new Error(
                    "User information not found"
                );
            }

            setUser(userData);

            // -------------------------------------------------
            // 2. GET ACTIVE WORKSPACE ID
            // -------------------------------------------------

            const activeWorkspaceId =
                localStorage.getItem(
                    "activeWorkspaceId"
                );

            console.log(
                "ACTIVE WORKSPACE ID:",
                activeWorkspaceId
            );

            // -------------------------------------------------
            // 3. NO ACTIVE WORKSPACE
            // -------------------------------------------------

            if (!activeWorkspaceId) {
                setWorkspace(null);
                return;
            }

            // -------------------------------------------------
            // 4. GET ACTIVE WORKSPACE
            // -------------------------------------------------

            const workspaceResponse =
                await APICallService.getWorkspaceById(
                    activeWorkspaceId
                );

            console.log(
                "WORKSPACE RESPONSE:",
                workspaceResponse
            );

            const workspaceData =
                workspaceResponse?.data?.data;

            if (!workspaceData) {
                throw new Error(
                    "Workspace information not found"
                );
            }

            setWorkspace(workspaceData);

        } catch (error) {
            console.error(
                "Failed to load profile:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load profile"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // =====================================================
    // LISTEN FOR WORKSPACE CHANGE
    // =====================================================

    useEffect(() => {
        const handleWorkspaceChange = () => {
            console.log(
                "Workspace changed - refreshing profile"
            );

            fetchProfile();
        };

        window.addEventListener(
            "workspaceChanged",
            handleWorkspaceChange
        );

        return () => {
            window.removeEventListener(
                "workspaceChanged",
                handleWorkspaceChange
            );
        };
    }, [fetchProfile]);

    // =====================================================
    // NAVIGATION
    // =====================================================

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

    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress
                    size={28}
                    sx={{
                        color: "#7c3aed",
                    }}
                />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Box
                sx={{
                    p: 3,
                    color: "#dc2626",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100%",
                minHeight: 0,
                p: 3,
                overflow: "hidden",
            }}
        >
            {/* =================================================
                MAIN TWO COLUMN LAYOUT
            ================================================= */}

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
                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <Box
                    sx={{
                        minWidth: 0,
                    }}
                >
                    {/* PAGE TITLE */}

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

                    {/* AVATAR + USERNAME */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 3,
                        }}
                    >
                        <Avatar
                            src={
                                user?.avatar ||
                                undefined
                            }
                            sx={{
                                width: 40,
                                height: 40,
                                fontSize: "16px",
                                fontWeight: 700,
                                backgroundColor:
                                    "#ede9fe",
                                color: "#7c3aed",
                            }}
                        >
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </Avatar>

                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#334155",
                            }}
                        >
                            {user?.name || "-"}
                        </Typography>
                    </Box>

                    {/* ACCOUNT */}

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

                    {/* NAVIGATION */}

                    <Box>
                        {navigationItems.map(
                            (item, index) => {
                                const Icon = item.icon;

                                const isActive =
                                    activeTab === index;

                                return (
                                    <Box
                                        key={item.label}
                                        onClick={() =>
                                            setActiveTab(
                                                index
                                            )
                                        }
                                        sx={{
                                            height: "40px",
                                            px: 1,
                                            mb: 0.5,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 1,
                                            borderRadius:
                                                "6px",
                                            cursor: "pointer",

                                            backgroundColor:
                                                isActive
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
                                                fontSize:
                                                    "13px",
                                                fontWeight:
                                                    isActive
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
                                                    color:
                                                        "#7c3aed",
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            }
                        )}
                    </Box>
                </Box>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <Box
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        overflowY: "auto",
                    }}
                >
                    {activeTab === 0 && (
                        <ProfileDetails
                            user={user}
                            workspace={workspace}
                            onUserUpdated={setUser}
                        />
                    )}

                    {activeTab === 1 && (
                        <ChangePassword />
                    )}
                </Box>
            </Box>
        </Box>
    );
}