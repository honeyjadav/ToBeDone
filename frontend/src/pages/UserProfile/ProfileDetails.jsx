import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Chip,
    Divider,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";

import APICallService from "../../services/APICallService";

export default function ProfileDetails({
    user,
    workspace,
    onUserUpdated,
}) {
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // UPDATE FORM WHEN USER CHANGES
    // =====================================================

    useEffect(() => {
        setProfileData({
            name: user?.name || "",
        });
    }, [user]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleUpdateProfile = async () => {
        try {
            setError("");

            const updatedName = profileData.name.trim();

            // Validate name
            if (!updatedName) {
                setError("Name is required.");
                return;
            }

            // Prevent unnecessary API call
            if (updatedName === user?.name) {
                setIsEditing(false);
                return;
            }

            setIsUpdating(true);

            console.log("PATCH PROFILE REQUEST:", {
                name: updatedName,
            });

            // =================================================
            // PATCH /api/auth/me
            //
            // Only name is sent
            // =================================================

            const response =
                await APICallService.updateProfile(
                    updatedName
                );

            console.log(
                "PATCH PROFILE RESPONSE:",
                response
            );

            // =================================================
            // Get updated user
            // =================================================

            const updatedUser =
                response?.data?.data;

            if (!updatedUser) {
                throw new Error(
                    "Updated user information not found."
                );
            }

            console.log(
                "UPDATED USER:",
                updatedUser
            );

            // =================================================
            // Update parent Profile component
            // =================================================

            if (onUserUpdated) {
                onUserUpdated(updatedUser);
            }

            // Update local form state
            setProfileData({
                name: updatedUser.name || "",
            });

            // Exit edit mode
            setIsEditing(false);
            window.location.reload();

        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update profile."
            );
        } finally {
            setIsUpdating(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        setProfileData({
            name: user?.name || "",
        });

        setError("");

        setIsEditing(false);
    };

    return (
        <Box
            sx={{
                maxWidth: "900px",
            }}
        >
            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    mb: 2,
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        p: 2.5,
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
                            Personal Information
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "#94a3b8",
                                mt: 0.5,
                            }}
                        >
                            Your basic account information
                        </Typography>
                    </Box>

                    {!isEditing && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setError("");
                                setIsEditing(true);
                            }}
                            sx={{
                                height: "36px",
                                px: 2,
                                textTransform: "none",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#7c3aed",
                                borderColor: "#c4b5fd",
                                borderRadius: "8px",

                                "&:hover": {
                                    borderColor: "#7c3aed",
                                    backgroundColor: "#f5f3ff",
                                },
                            }}
                        >
                            Update Profile
                        </Button>
                    )}
                </Box>

                <Divider />

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <Box
                        sx={{
                            mx: 2.5,
                            mt: 2,
                            p: 1.5,
                            borderRadius: "6px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </Box>
                )}

                {/* =================================================
                    EDIT MODE
                ================================================= */}

                {isEditing ? (
                    <Box
                        sx={{
                            p: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {/* NAME */}

                        <TextField
                            label="Name"
                            value={profileData.name}
                            onChange={(e) =>
                                handleChange(
                                    "name",
                                    e.target.value
                                )
                            }
                            fullWidth
                            size="small"
                            disabled={isUpdating}
                        />

                        {/* EMAIL */}

                        <TextField
                            label="Email"
                            value={user?.email || ""}
                            fullWidth
                            size="small"
                            disabled
                            helperText="Email cannot be changed."
                        />

                        {/* BUTTONS */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={isUpdating}
                                sx={{
                                    textTransform: "none",
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleUpdateProfile}
                                disabled={
                                    isUpdating ||
                                    !profileData.name.trim()
                                }
                                sx={{
                                    backgroundColor: "#7c3aed",
                                    textTransform: "none",

                                    "&:hover": {
                                        backgroundColor:
                                            "#6d28d9",
                                    },
                                }}
                            >
                                {isUpdating ? (
                                    <CircularProgress
                                        size={18}
                                        sx={{
                                            color: "#ffffff",
                                        }}
                                    />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    /* =================================================
                       VIEW MODE
                    ================================================= */

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                        }}
                    >
                        <ProfileField
                            label="Name"
                            value={user?.name || "-"}
                            borderRight
                        />

                        <ProfileField
                            label="Email"
                            value={user?.email || "-"}
                        />

                        <ProfileField
                            label="Authentication"
                            value={
                                user?.authProvider || "-"
                            }
                            borderRight
                        />

                        <Box
                            sx={{
                                p: 2.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#94a3b8",
                                    textTransform: "uppercase",
                                    mb: 0.75,
                                }}
                            >
                                Email Status
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color:
                                        user?.isEmailVerified
                                            ? "#16a34a"
                                            : "#dc2626",
                                    fontWeight: 600,
                                }}
                            >
                                {user?.isEmailVerified
                                    ? "Verified"
                                    : "Not Verified"}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* =================================================
                WORKSPACE INFORMATION
            ================================================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        p: 2.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#1e293b",
                        }}
                    >
                        Workspace Information
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            mt: 0.5,
                        }}
                    >
                        Your current workspace access
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                        },
                    }}
                >
                    {/* WORKSPACE */}

                    <Box
                        sx={{
                            p: 2.5,
                            borderRight: {
                                xs: "none",
                                sm: "1px solid #e2e8f0",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                mb: 0.75,
                            }}
                        >
                            Workspace
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "#334155",
                                fontWeight: 500,
                            }}
                        >
                            {workspace?.name || "-"}
                        </Typography>
                    </Box>

                    {/* ROLE */}

                    <Box
                        sx={{
                            p: 2.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                mb: 0.75,
                            }}
                        >
                            Role
                        </Typography>

                        <Chip
                            label={
                                workspace?.role || "Member"
                            }
                            size="small"
                            sx={{
                                height: "22px",
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: "#ede9fe",
                                color: "#7c3aed",
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                }}
            >
                <Box
                    sx={{
                        p: 2.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#1e293b",
                        }}
                    >
                        Account Information
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                        },
                    }}
                >
                    <ProfileField
                        label="Created"
                        value={
                            user?.createdAt
                                ? new Date(
                                      user.createdAt
                                  ).toLocaleDateString()
                                : "-"
                        }
                        borderRight
                    />

                    <Box
                        sx={{
                            p: 2.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                mb: 0.75,
                            }}
                        >
                            Account Status
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: user?.isActive
                                    ? "#16a34a"
                                    : "#dc2626",
                                fontWeight: 600,
                            }}
                        >
                            {user?.isActive
                                ? "Active"
                                : "Inactive"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

// =====================================================
// REUSABLE PROFILE FIELD
// =====================================================

function ProfileField({
    label,
    value,
    borderRight = false,
}) {
    return (
        <Box
            sx={{
                p: 2.5,

                borderRight: {
                    xs: "none",
                    sm: borderRight
                        ? "1px solid #e2e8f0"
                        : "none",
                },

                borderBottom: "1px solid #e2e8f0",
            }}
        >
            <Typography
                sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    mb: 0.75,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: "13px",
                    color: "#334155",
                    fontWeight: 500,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}