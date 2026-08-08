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
    const [role, setRole] = useState("Member");

    // Reset form whenever drawer opens
    useEffect(() => {
        if (open) {
            setEmail("");
            setRole("Member");
        }
    }, [open]);

    // Add User
    const handleSubmit = () => {
        if (!email.trim()) return;

        onAdd({
            email: email.trim(),
            role,
        });

        onClose();
    };

    // Clear form
    const handleClear = () => {
        setEmail("");
        setRole("Member");
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: "100%",
                        sm: "420px",
                    },
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                },
            }}
        >
            {/* Header */}
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
                    {/* Left Arrow */}
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

                {/* Close */}
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

            {/* Content */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2.5,
                }}
            >
                {/* Email */}
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
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontSize: "13px",
                            },
                        }}
                    />
                </Box>

                {/* Role */}
                <Box>
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

                    <FormControl fullWidth size="small">
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            sx={{
                                borderRadius: "8px",
                                fontSize: "13px",
                            }}
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
                    </FormControl>
                </Box>
            </Box>

            {/* Bottom Actions */}
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
                {/* Add User */}
                <Button
                    onClick={handleSubmit}
                    disabled={!email.trim()}
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
                    Add User
                </Button>

                {/* Clear */}
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