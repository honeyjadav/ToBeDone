import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    InputAdornment,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import APICallService from "../../services/APICallService";

export default function ChangePassword({ darkMode }) {
    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // =====================================================
    // SUBMIT STATE
    // =====================================================

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // =====================================================
    // NEW PASSWORD VALIDATION (mirrors backend Joi rules)
    // =====================================================

    const validateNewPassword = (value) => {
        if (!value) return "";

        if (value.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one digit";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return "Password must contain at least one special character";
        }

        return "";
    };

    const newPasswordError = validateNewPassword(
        passwordData.newPassword
    );

    const handleChangePassword = async () => {
        try {
            setIsSubmitting(true);

            const response = await APICallService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setSnackbar({
                open: true,
                message:
                    response?.data?.message ||
                    "Password changed successfully.",
                severity: "success",
            });

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Change password error:", error);

            const message =
                error?.response?.data?.errors?.[0]?.message ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to change password.";

            setSnackbar({
                open: true,
                message,
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordsMatch =
        passwordData.newPassword ===
        passwordData.confirmPassword;

    const canSubmit =
        passwordData.currentPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword &&
        passwordsMatch &&
        !newPasswordError &&
        !isSubmitting;

    // Shared input styling for TextFields
    const textFieldSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: darkMode ? "#0f172a" : "#fff",
            "& fieldset": {
                borderColor: darkMode ? "#334155" : "#e2e8f0",
            },
            "&:hover fieldset": {
                borderColor: darkMode ? "#475569" : "#cbd5e1",
            },
            "&.Mui-disabled": {
                backgroundColor: darkMode ? "#1e293b" : "rgba(0, 0, 0, 0.03)",
                "& fieldset": { borderColor: darkMode ? "#334155" : "#e2e8f0" },
            },
        },
        "& .MuiInputBase-input": {
            color: darkMode ? "#f8fafc" : "#1e293b",
            "&.Mui-disabled": {
                color: darkMode ? "#94a3b8" : "rgba(0, 0, 0, 0.38)",
                WebkitTextFillColor: darkMode ? "#94a3b8" : "rgba(0, 0, 0, 0.38)",
            },
        },
        "& .MuiInputLabel-root": {
            color: darkMode ? "#94a3b8" : undefined,
        },
    };

    return (
        <Box
            sx={{
                maxWidth: "650px",
            }}
        >
            <Box
                sx={{
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: "8px",
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2.5 }}>
                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: darkMode ? "#f8fafc" : "#1e293b",
                        }}
                    >
                        Change Password
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: darkMode ? "#94a3b8" : "#94a3b8",
                            mt: 0.5,
                        }}
                    >
                        Update your password to keep your account
                        secure.
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }} />

                {/* Form */}
                <Box
                    sx={{
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {/* Current Password */}
                    <TextField
                        label="Current Password"
                        type={
                            showCurrentPassword
                                ? "text"
                                : "password"
                        }
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                            handlePasswordChange(
                                "currentPassword",
                                e.target.value
                            )
                        }
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        sx={textFieldSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        sx={{ color: darkMode ? '#94a3b8' : undefined }}
                                    >
                                        {showCurrentPassword ? (
                                            <VisibilityOffOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        ) : (
                                            <VisibilityOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* New Password */}
                    <TextField
                        label="New Password"
                        type={
                            showNewPassword
                                ? "text"
                                : "password"
                        }
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            handlePasswordChange(
                                "newPassword",
                                e.target.value
                            )
                        }
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        error={
                            passwordData.newPassword.length > 0 &&
                            Boolean(newPasswordError)
                        }
                        helperText={
                            passwordData.newPassword.length > 0
                                ? newPasswordError
                                : ""
                        }
                        sx={textFieldSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowNewPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        sx={{ color: darkMode ? '#94a3b8' : undefined }}
                                    >
                                        {showNewPassword ? (
                                            <VisibilityOffOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        ) : (
                                            <VisibilityOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        label="Confirm New Password"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                            handlePasswordChange(
                                "confirmPassword",
                                e.target.value
                            )
                        }
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        error={
                            passwordData.confirmPassword.length > 0 &&
                            !passwordsMatch
                        }
                        helperText={
                            passwordData.confirmPassword.length > 0 &&
                                !passwordsMatch
                                ? "Passwords do not match"
                                : ""
                        }
                        sx={textFieldSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        sx={{ color: darkMode ? '#94a3b8' : undefined }}
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityOffOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        ) : (
                                            <VisibilityOutlinedIcon
                                                sx={{
                                                    fontSize: 19,
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Action */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            disabled={!canSubmit}
                            onClick={handleChangePassword}
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
                                    backgroundColor: darkMode ? "#334155" : "#e2e8f0",
                                    color: darkMode ? "#64748b" : "#94a3b8",
                                },
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress
                                    size={16}
                                    sx={{ color: "#94a3b8" }}
                                />
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#ffffff",

                        "& .MuiAlert-icon": {
                            color: "#ffffff",
                        },

                        "& .MuiAlert-action": {
                            color: "#ffffff",
                        },

                        "& .MuiIconButton-root": {
                            color: "#ffffff",
                        },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}