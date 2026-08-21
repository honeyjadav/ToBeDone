import { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    Button,
    IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// 1. Import settings utility
import { getAppSettings } from "../utils/preferences";

const ROLES = ["Admin", "Manager", "Member"];

// 2. Pass darkMode prop to the shared label
const FieldLabel = ({ children, darkMode }) => (
    <Typography sx={{ fontSize: "12px", fontWeight: 700, color: darkMode ? "#cbd5e1" : "#334155", mb: 0.75 }}>
        {children}
    </Typography>
);

export default function AddUser({ open, onClose, onAdd, onUpdate, user = null, }) {
    // 3. Initialize dark mode state and event listener
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

    const isEditMode = Boolean(user);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [emailError, setEmailError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);

    useEffect(() => {
        if (open) {
            if (user) {
                // Update mode
                setEmail(user.email || "");
                setRole(user.role || "");
            } else {
                // Add mode
                setEmail("");
                setRole("");
            }

            setEmailError("");
            setRoleError("");
            setSubmitError("");
            setEmailTouched(false);
        }
    }, [open, user]);

    const validateEmail = (value) => {
        if (!value.trim()) {
            return "Email is required";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) {
            return "Please enter a valid email address";
        }

        return "";
    };

    const validateForm = () => {
        const emailValidation = validateEmail(email);

        let valid = true;

        if (emailValidation) {
            setEmailError(emailValidation);
            valid = false;
        } else {
            setEmailError("");
        }

        if (!role) {
            setRoleError("Role is required");
            valid = false;
        } else {
            setRoleError("");
        }

        return valid;
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;

        setEmail(value);
        setSubmitError("");
        setEmailTouched(true);

        if (value.trim()) {
            setEmailError(validateEmail(value));
        } else {
            setEmailError("");
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setRoleError("");
        setSubmitError("");
    };

    const handleSubmit = async () => {
        setEmailTouched(true);

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        try {
            let result;

            if (isEditMode) {
                // Update ONLY role
                result = await onUpdate({
                    memberId: user.id,
                    role,
                });
            } else {
                // Add user
                result = await onAdd({
                    email: email.trim(),
                    role,
                });
            }

            if (result?.success) {
                onClose();
            } else {
                setSubmitError(
                    result?.message ||
                    (isEditMode
                        ? "Unable to update user."
                        : "Unable to send invite.")
                );
            }
        } catch (error) {
            setSubmitError(
                error?.message ||
                (isEditMode
                    ? "Unable to update user."
                    : "Unable to send invite.")
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        if (isEditMode) {
            // Restore original role
            setRole(user?.role || "");
            setRoleError("");
            setSubmitError("");
            return;
        }

        setEmail("");
        setRole("");
        setEmailError("");
        setRoleError("");
        setSubmitError("");
        setEmailTouched(false);
    };

    // Shared MenuProps for dropdowns to enforce dark mode background
    const darkMenuProps = {
        PaperProps: {
            sx: {
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                color: darkMode ? '#f8fafc' : '#1e293b',
                border: darkMode ? '1px solid #334155' : 'none'
            }
        }
    };

    // Shared input styling for TextField
    const textFieldSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "13px",
            backgroundColor: darkMode ? '#0f172a' : '#fff',
            "& fieldset": {
                borderColor: darkMode ? '#334155' : '#e2e8f0',
            },
            "&:hover fieldset": {
                borderColor: darkMode ? '#475569' : '#cbd5e1',
            },
            "&.Mui-disabled": {
                backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
            }
        },
        "& .MuiInputBase-input": {
            color: darkMode ? '#f8fafc' : '#1e293b',
            "&.Mui-disabled": {
                color: darkMode ? '#94a3b8' : '#94a3b8',
                WebkitTextFillColor: darkMode ? '#94a3b8' : '#94a3b8',
            }
        },
        "& .MuiFormHelperText-root": {
            marginLeft: 0,
            fontSize: "12px",
        },
    };

    // Shared input styling for Select
    const selectSx = {
        borderRadius: "10px",
        fontSize: "13px",
        backgroundColor: darkMode ? '#0f172a' : '#fff',
        color: darkMode ? '#f8fafc' : 'inherit',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#334155' : '#e2e8f0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#475569' : '#cbd5e1',
        },
        '& .MuiSvgIcon-root': {
            color: darkMode ? '#94a3b8' : undefined,
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: {
                            xs: "100%",
                            sm: "460px",
                        },
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    height: "70px",
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <IconButton size="small" sx={{ color: darkMode ? "#94a3b8" : "#64748b", p: 0.5 }}>
                        <ChevronRightIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: darkMode ? "#f8fafc" : "#1e293b"
                        }}
                    >
                        {isEditMode ? "Update User" : "Add User"}
                    </Typography>
                </Box>

                <IconButton size="small" onClick={onClose} sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                    <CloseIcon sx={{ fontSize: 19 }} />
                </IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Box>
                        <FieldLabel darkMode={darkMode}>Email</FieldLabel>
                        <TextField
                            autoFocus={!isEditMode}
                            type="email"
                            placeholder="Enter user email"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isEditMode}
                            onBlur={() => {
                                if (!emailTouched) return;

                                if (email.trim()) {
                                    setEmailError(validateEmail(email));
                                } else {
                                    setEmailError("Email is required");
                                }
                            }}
                            fullWidth
                            size="small"
                            error={Boolean(emailError)}
                            helperText={emailError}
                            sx={textFieldSx}
                        />
                    </Box>

                    <Box>
                        <FieldLabel darkMode={darkMode}>Role</FieldLabel>
                        <FormControl fullWidth size="small" error={Boolean(roleError)}>
                            <Select
                                displayEmpty
                                value={role}
                                onChange={handleRoleChange}
                                sx={selectSx}
                                MenuProps={darkMenuProps}
                                renderValue={(selected) => selected || <Typography sx={{ fontSize: "13px", color: darkMode ? "#64748b" : "#94a3b8" }}>Select role</Typography>}
                            >
                                {ROLES.map((r) => (
                                    <MenuItem
                                        key={r}
                                        value={r}
                                        sx={{
                                            fontSize: "13px",
                                            '&:hover': { backgroundColor: darkMode ? '#334155' : undefined }
                                        }}
                                    >
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>

                            {roleError && (
                                <Typography
                                    sx={{
                                        color: darkMode ? "#f87171" : "#d32f2f",
                                        fontSize: "12px",
                                        mt: 0.5,
                                        ml: 1.75,
                                    }}
                                >
                                    {roleError}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    height: "70px",
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    flexShrink: 0,
                }}
            >
                <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    variant="contained"
                    sx={{
                        height: "40px",
                        px: 2.5,
                        textTransform: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        backgroundColor: "#7c3aed",
                        borderRadius: "10px",
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
                    {submitting ? (isEditMode ? "Updating..." : "Sending...") : (isEditMode ? "Update User" : "Add User")}
                </Button>

                <Button
                    onClick={handleClear}
                    sx={{
                        height: "40px",
                        px: 2,
                        textTransform: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: darkMode ? "#94a3b8" : "#64748b",
                        borderRadius: "10px",

                        "&:hover": {
                            backgroundColor: darkMode ? "#1e293b" : "#f8fafc",
                        },
                    }}
                >
                    {isEditMode ? "Reset" : "Clear"}
                </Button>
            </Box>
        </Drawer>
    );
}