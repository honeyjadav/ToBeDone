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

const ROLES = ["Admin", "Manager", "Member"];

export default function AddUser({ open, onClose, onAdd }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [emailError, setEmailError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (open) {
            setEmail("");
            setRole("");
            setEmailError("");
            setRoleError("");
            setSubmitError("");
        }
    }, [open]);

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
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        try {
            const result = await onAdd({
                email: email.trim(),
                role,
            });

            if (result?.success) {
                onClose();
            } else {
                setSubmitError(
                    result?.message || "Unable to send invite."
                );
            }
        } catch (error) {
            setSubmitError(
                error?.message || "Unable to send invite."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        setEmail("");
        setRole("");
        setEmailError("");
        setRoleError("");
        setSubmitError("");
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
                            sm: "420px",
                        },
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                    },
                },
            }}
        >
            <Box
                sx={{
                    height: "70px",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e2e8f0",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                    }}
                >
                    <IconButton
                        size="small"
                        sx={{
                            color: "#64748b",
                            p: 0.5,
                        }}
                    >
                        <ChevronRightIcon
                            sx={{
                                fontSize: 20,
                            }}
                        />
                    </IconButton>

                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#1e293b",
                        }}
                    >
                        Add User
                    </Typography>
                </Box>

                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        color: "#64748b",
                    }}
                >
                    <CloseIcon
                        sx={{
                            fontSize: 19,
                        }}
                    />
                </IconButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2.5,
                }}
            >
                <Box sx={{ mb: 2.5 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#334155",
                            mb: 0.75,
                        }}
                    >
                        Email
                    </Typography>

                    <TextField
                        autoFocus
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => {
                            if (email.trim()) {
                                setEmailError(
                                    validateEmail(email)
                                );
                            } else {
                                setEmailError(
                                    "Email is required"
                                );
                            }
                        }}
                        fullWidth
                        size="small"
                        error={Boolean(emailError)}
                        helperText={emailError}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontSize: "13px",
                            },
                            "& .MuiFormHelperText-root": {
                                marginLeft: 0,
                                fontSize: "12px",
                            },
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#334155",
                            mb: 0.75,
                        }}
                    >
                        Role
                    </Typography>

                    <FormControl
                        fullWidth
                        size="small"
                        error={Boolean(roleError)}
                    >
                        <Select
                            displayEmpty
                            value={role}
                            onChange={handleRoleChange}
                            sx={{
                                borderRadius: "8px",
                                fontSize: "13px",
                            }}
                            renderValue={(selected) =>
                                selected || "Select role"
                            }
                        >
                            {ROLES.map((r) => (
                                <MenuItem
                                    key={r}
                                    value={r}
                                    sx={{
                                        fontSize: "13px",
                                    }}
                                >
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>

                        {roleError && (
                            <Typography
                                sx={{
                                    color: "#d32f2f",
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

                {/* {submitError && (
                    <Typography
                        sx={{
                            color: "#dc2626",
                            fontSize: "0.85rem",
                            mb: 1,
                        }}
                    >
                        {submitError}
                    </Typography>
                )} */}
            </Box>

            <Box
                sx={{
                    height: "70px",
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderTop: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
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
                    {submitting ? "Sending..." : "Add User"}
                </Button>

                <Button
                    onClick={handleClear}
                    sx={{
                        height: "40px",
                        px: 2,
                        textTransform: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#64748b",
                        borderRadius: "8px",

                        "&:hover": {
                            backgroundColor: "#f8fafc",
                        },
                    }}
                >
                    Clear
                </Button>
            </Box>
        </Drawer>
    );
}