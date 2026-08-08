import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    InputAdornment,
    IconButton,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function ChangePassword() {
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

    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChangePassword = () => {
        console.log("Change password:", passwordData);

        // API call will be added here
    };

    const passwordsMatch =
        passwordData.newPassword ===
        passwordData.confirmPassword;

    const canSubmit =
        passwordData.currentPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword &&
        passwordsMatch;

    return (
        <Box
            sx={{
                maxWidth: "650px",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2.5 }}>
                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#1e293b",
                        }}
                    >
                        Change Password
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            mt: 0.5,
                        }}
                    >
                        Update your password to keep your account
                        secure.
                    </Typography>
                </Box>

                <Divider />

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
                                    backgroundColor: "#e2e8f0",
                                    color: "#94a3b8",
                                },
                            }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}