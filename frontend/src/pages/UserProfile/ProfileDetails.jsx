import { useRef, useState } from "react";

import {
    Box,
    Typography,
    Avatar,
    Chip,
    Divider,
    Button,
    TextField,
    IconButton,
    Tooltip,
} from "@mui/material";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

export default function ProfileDetails({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || ""
    );

    const fileInputRef = useRef(null);

    const handleChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ==============================
    // Avatar Upload
    // ==============================

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Allow only image files
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        // Optional size validation: 5 MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB.");
            return;
        }

        // Create preview
        const imageUrl = URL.createObjectURL(file);

        setAvatarPreview(imageUrl);

        // Later send `file` to backend API
        console.log("Selected avatar:", file);
    };

    const handleUpdateProfile = () => {
        console.log("Updated profile:", {
            name: profileData.name,
            avatar: avatarPreview,
        });

        // API call will be added here later

        setIsEditing(false);
    };

    const handleCancel = () => {
        setProfileData({
            name: user?.name || "",
        });

        setAvatarPreview(user?.avatar || "");

        setIsEditing(false);
    };

    return (
        <Box
            sx={{
                maxWidth: "900px",
            }}
        >
            {/* ================= PROFILE AVATAR ================= */}

           
            {/* ================= PERSONAL INFORMATION ================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    mb: 2,
                }}
            >
                {/* Header */}

                <Box
                    sx={{
                        p: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
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
                            onClick={() => setIsEditing(true)}
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

                {isEditing ? (
                    /* ================= EDIT PROFILE ================= */

                    <Box
                        sx={{
                            p: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {/* Name */}

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
                        />

                        {/* Email - Cannot Change */}

                        <TextField
                            label="Email"
                            value={user?.email || ""}
                            fullWidth
                            size="small"
                            disabled
                            helperText="Email cannot be changed."
                        />

                        {/* Buttons */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                                mt: 1,
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{
                                    height: "38px",
                                    px: 2.5,
                                    textTransform: "none",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#475569",
                                    borderColor: "#cbd5e1",
                                    borderRadius: "8px",

                                    "&:hover": {
                                        borderColor: "#94a3b8",
                                        backgroundColor: "#f8fafc",
                                    },
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleUpdateProfile}
                                disabled={
                                    !profileData.name.trim()
                                }
                                sx={{
                                    height: "38px",
                                    px: 2.5,
                                    textTransform: "none",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    backgroundColor: "#7c3aed",
                                    borderRadius: "8px",
                                    boxShadow: "none",

                                    "&:hover": {
                                        backgroundColor: "#6d28d9",
                                        boxShadow: "none",
                                    },

                                    "&:disabled": {
                                        backgroundColor: "#e2e8f0",
                                        color: "#94a3b8",
                                    },
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    /* ================= VIEW PROFILE ================= */

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                        }}
                    >
                        {/* Name */}

                        <Box
                            sx={{
                                p: 2.5,
                                borderRight: {
                                    xs: "none",
                                    sm: "1px solid #e2e8f0",
                                },
                                borderBottom:
                                    "1px solid #e2e8f0",
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
                                Name
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color: "#334155",
                                    fontWeight: 500,
                                }}
                            >
                                {user?.name || "-"}
                            </Typography>
                        </Box>

                        {/* Email */}

                        <Box
                            sx={{
                                p: 2.5,
                                borderBottom:
                                    "1px solid #e2e8f0",
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
                                Email
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color: "#334155",
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                }}
                            >
                                {user?.email || "-"}
                            </Typography>
                        </Box>

                        {/* Authentication */}

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
                                Authentication
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color: "#334155",
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                }}
                            >
                                {user?.authProvider || "-"}
                            </Typography>
                        </Box>

                        {/* Email Status */}

                        <Box sx={{ p: 2.5 }}>
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
                                    color: user?.isEmailVerified
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

            {/* ================= WORKSPACE INFORMATION ================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    mb: 2,
                }}
            >
                <Box sx={{ p: 2.5 }}>
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
                    {/* Workspace */}

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
                            {user?.workspace || "-"}
                        </Typography>
                    </Box>

                    {/* Role */}

                    <Box sx={{ p: 2.5 }}>
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
                            label={user?.role || "Member"}
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

            {/* ================= ACCOUNT INFORMATION ================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                }}
            >
                <Box sx={{ p: 2.5 }}>
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
                    {/* Last Login */}

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
                            Last Login
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "#334155",
                            }}
                        >
                            {user?.lastLogin || "-"}
                        </Typography>
                    </Box>

                    {/* Created */}

                    <Box sx={{ p: 2.5 }}>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                mb: 0.75,
                            }}
                        >
                            Created
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "#334155",
                            }}
                        >
                            {user?.createdAt || "-"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}