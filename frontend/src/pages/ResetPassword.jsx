import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Typography,
    TextField,
    Stack,
    InputAdornment,
    IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AuthPageWrapper from "./AuthPageWrapper";
import APICallService from "../services/APICallService";
import PasswordValidationPopup from "../components/PasswordValidationPopup";

const VIBRANT_PURPLE = "#7c3aed";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordAnchor, setPasswordAnchor] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    // Get token from:
    // http://localhost:3000/reset-password?token=xxxxx
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    // ------------------------------------------
    // Password validation rules
    // ------------------------------------------

    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const isPasswordValid =
        passwordRules.length &&
        passwordRules.uppercase &&
        passwordRules.lowercase &&
        passwordRules.number &&
        passwordRules.special;

    // ------------------------------------------
    // Confirm password validation
    // ------------------------------------------

    const isConfirmPasswordValid =
        confirmPassword.length > 0 &&
        password === confirmPassword;

    // ------------------------------------------
    // Final button validation
    // ------------------------------------------

    const isFormValid =
        Boolean(token) &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        !loading;

    // ------------------------------------------
    // Password change
    // ------------------------------------------

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        setPassword(value);

        // Clear previous errors while typing
        if (error) {
            setError("");
        }

        // Keep popup attached to password field
        setPasswordAnchor(e.currentTarget);
    };

    // ------------------------------------------
    // Confirm password change
    // ------------------------------------------

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;

        setConfirmPassword(value);

        if (error) {
            setError("");
        }
    };

    // ------------------------------------------
    // Submit reset password
    // ------------------------------------------

    const handleReset = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Token validation
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        // Password validation
        if (!isPasswordValid) {
            setError("Please create a strong password.");
            return;
        }

        // Confirm password
        if (!confirmPassword) {
            setError("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await APICallService.resetPassword({
                token,
                newPassword: password,
            });

            const payload = response?.data;

            if (!payload?.success) {
                throw new Error(
                    payload?.message || "Unable to reset password."
                );
            }

            setSuccess(
                payload.message || "Password reset successful."
            );

            // Redirect to login
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);

        } catch (error) {
            console.error("Reset password error:", error);

            // Backend validation errors
            if (error.response?.data?.errors) {
                const firstError = error.response.data.errors[0];

                setError(
                    firstError?.message || "Invalid password."
                );
            }

            // Backend normal error
            else if (error.response?.data?.message) {
                setError(error.response.data.message);
            }

            // Network error
            else if (
                error.code === "ERR_NETWORK" ||
                error.message === "Network Error"
            ) {
                setError("No Internet connection.");
            }

            // Other errors
            else {
                setError(
                    error.message ||
                    "Unable to reset password."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------
    // Illustration
    // ------------------------------------------

    const ResetIllustration = () => (
        <svg
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            stroke={VIBRANT_PURPLE}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.15 }}
        >
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    );

    return (
        <AuthPageWrapper
            title="Create New Password"
            subtitle="Enter your new password below."
            illustration={<ResetIllustration />}
            onSubmit={handleReset}
            buttonText={
                loading
                    ? "Updating..."
                    : "Update Password"
            }
            buttonDisabled={!isFormValid}
        >

            {/* -------------------------------- */}
            {/* Error Message */}
            {/* -------------------------------- */}

            {error && (
                <Typography
                    sx={{
                        color: "#dc2626",
                        backgroundColor: "#fef2f2",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        mb: 2,
                    }}
                >
                    {error}
                </Typography>
            )}

            {/* -------------------------------- */}
            {/* Success Message */}
            {/* -------------------------------- */}

            {success && (
                <Typography
                    sx={{
                        color: "#16a34a",
                        backgroundColor: "#f0fdf4",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        mb: 2,
                    }}
                >
                    {success}
                </Typography>
            )}

            {/* -------------------------------- */}
            {/* New Password */}
            {/* -------------------------------- */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    New Password
                </Typography>

                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <TextField
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={password}
                        onFocus={(e) => {
                            setPasswordFocused(true);
                            setPasswordAnchor(
                                e.currentTarget
                            );
                        }}
                        onChange={handlePasswordChange}
                        onBlur={() => {
                            // Do not immediately close.
                            // Popper should remain while typing.
                        }}
                        fullWidth
                        placeholder="••••••••"
                        disabled={loading}
                        sx={{
                            backgroundColor: "#f8fafc",
                            borderRadius: "8px",

                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                    border: `1px solid ${VIBRANT_PURPLE}`,
                                },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword(
                                                (show) => !show
                                            )
                                        }
                                        edge="end"
                                        sx={{
                                            color: "#94a3b8",
                                        }}
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Password Validation Popup */}

                    <PasswordValidationPopup
                        open={
                            passwordFocused &&
                            password.length > 0 &&
                            !isPasswordValid
                        }
                        anchorEl={passwordAnchor}
                        password={password}
                    />
                </div>
            </Stack>

            {/* -------------------------------- */}
            {/* Confirm Password */}
            {/* -------------------------------- */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    Confirm Password
                </Typography>

                <TextField
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    fullWidth
                    placeholder="••••••••"
                    disabled={loading}
                    sx={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",

                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },

                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },

                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                border: `1px solid ${VIBRANT_PURPLE}`,
                            },
                    }}
                />

                {/* Confirm password message */}

                {confirmPassword.length > 0 &&
                    password !== confirmPassword && (
                        <Typography
                            sx={{
                                color: "#dc2626",
                                fontSize: "0.78rem",
                                mt: 0.5,
                            }}
                        >
                            Passwords do not match.
                        </Typography>
                    )}

                {confirmPassword.length > 0 &&
                    password === confirmPassword && (
                        <Typography
                            sx={{
                                color: "#16a34a",
                                fontSize: "0.78rem",
                                mt: 0.5,
                            }}
                        >
                            Passwords match.
                        </Typography>
                    )}
            </Stack>

        </AuthPageWrapper>
    );
}