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

// 1. Import settings utility
import { getAppSettings } from "../../utils/preferences";

export default function Profile() {
    const [activeTab, setActiveTab] = useState(0);

    // =====================================================
    // DARK MODE STATE
    // =====================================================
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
                    backgroundColor: darkMode ? '#020817' : '#f8fafc',
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
                    color: darkMode ? "#fca5a5" : "#dc2626",
                    backgroundColor: darkMode ? '#020817' : '#f8fafc',
                    height: '100%',
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
                backgroundColor: darkMode ? '#020817' : '#f8fafc',
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
                            color: darkMode ? "#f8fafc" : "#1e293b",
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
                                backgroundColor: darkMode ? "#312e81" : "#ede9fe",
                                color: darkMode ? "#c4b5fd" : "#7c3aed",
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
                                color: darkMode ? "#cbd5e1" : "#334155",
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
                            color: darkMode ? "#64748b" : "#94a3b8",
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
                                                    ? (darkMode ? "#2e1065" : "#f3f0fe")
                                                    : "transparent",

                                            "&:hover": {
                                                backgroundColor:
                                                    isActive
                                                        ? (darkMode ? "#2e1065" : "#f3f0fe")
                                                        : (darkMode ? "#1e293b" : "#f8fafc"),
                                            },
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 18,
                                                color: isActive
                                                    ? (darkMode ? "#a78bfa" : "#7c3aed")
                                                    : (darkMode ? "#94a3b8" : "#64748b"),
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
                                                    ? (darkMode ? "#c4b5fd" : "#7c3aed")
                                                    : (darkMode ? "#cbd5e1" : "#475569"),
                                            }}
                                        >
                                            {item.label}
                                        </Typography>

                                        {isActive && (
                                            <ChevronRightIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: darkMode ? "#a78bfa" : "#7c3aed",
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
                        <ChangePassword darkMode={darkMode} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}