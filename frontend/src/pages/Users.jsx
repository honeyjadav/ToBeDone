import { useState } from "react";

import {
    Box,
    Typography,
    Button,
    Menu,
    MenuItem,
    Checkbox,
    ListItemText,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";

import UserTable from "../utils/UserTable";
import AddUser from "./AddUser";

const ROLES = ["Admin", "Manager", "Member"];

const initialUsers = [
    {
        id: "USR-101",
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        isActive: true,
        archived: false,
    },
    {
        id: "USR-102",
        name: "Alex Martin",
        email: "alex@example.com",
        role: "Manager",
        isActive: true,
        archived: false,
    },
    {
        id: "USR-103",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        role: "Member",
        isActive: false,
        archived: false,
    },
];

let userIdCounter = 104;

// --------------------------------------------------
// Role Filter Dropdown
// --------------------------------------------------

function FilterDropdown({
    label,
    options,
    selected,
    onToggle,
}) {
    const [anchor, setAnchor] = useState(null);

    return (
        <>
            <Button
                onClick={(e) => setAnchor(e.currentTarget)}
                endIcon={
                    <ExpandMoreIcon
                        sx={{
                            fontSize: 18,
                        }}
                    />
                }
                sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: selected.length
                        ? "#7c3aed"
                        : "#334155",
                    backgroundColor: selected.length
                        ? "#f3f0fe"
                        : "#ffffff",
                    border: "1px solid",
                    borderColor: selected.length
                        ? "#ddd6fe"
                        : "#e2e8f0",
                    borderRadius: "8px",
                    px: 1.5,
                    height: "36px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                }}
            >
                {label}
                {selected.length
                    ? ` (${selected.length})`
                    : ""}
            </Button>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => onToggle(option)}
                        sx={{
                            py: 0.25,
                        }}
                    >
                        <Checkbox
                            size="small"
                            checked={selected.includes(option)}
                            sx={{
                                p: 0.5,
                                mr: 0.5,
                            }}
                        />

                        <ListItemText
                            primary={option}
                            primaryTypographyProps={{
                                fontSize: "13px",
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

// --------------------------------------------------
// Users
// --------------------------------------------------

export default function Users() {
    const [users, setUsers] =
        useState(initialUsers);

    const [search, setSearch] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState([]);

    const [selected, setSelected] =
        useState([]);

    const [showArchived, setShowArchived] =
        useState(false);

    const [addUserOpen, setAddUserOpen] =
        useState(false);

    // --------------------------------------------------
    // Role Filter
    // --------------------------------------------------

    const toggleRoleFilter = (role) => {
        setRoleFilter((prev) =>
            prev.includes(role)
                ? prev.filter(
                      (item) => item !== role
                  )
                : [...prev, role]
        );
    };

    // --------------------------------------------------
    // Clear Filters
    // --------------------------------------------------

    const clearFilters = () => {
        setSearch("");
        setRoleFilter([]);
    };

    // --------------------------------------------------
    // Visible Users
    // --------------------------------------------------

    const visibleUsers = users.filter((user) =>
        showArchived
            ? user.archived
            : !user.archived
    );

    // --------------------------------------------------
    // Filter Users
    // --------------------------------------------------

    const filteredUsers = visibleUsers.filter(
        (user) => {
            const keyword =
                search.toLowerCase();

            const matchesSearch =
                user.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                user.email
                    .toLowerCase()
                    .includes(keyword) ||
                user.id
                    .toLowerCase()
                    .includes(keyword);

            const matchesRole =
                roleFilter.length === 0 ||
                roleFilter.includes(user.role);

            return (
                matchesSearch &&
                matchesRole
            );
        }
    );

    // --------------------------------------------------
    // Active Filters
    // --------------------------------------------------

    const hasActiveFilters =
        search || roleFilter.length > 0;

    // --------------------------------------------------
    // Selection
    // --------------------------------------------------

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter(
                      (item) => item !== id
                  )
                : [...prev, id]
        );
    };

    const toggleSelectAll = (ids) => {
        const allSelected =
            ids.length > 0 &&
            ids.every((id) =>
                selected.includes(id)
            );

        if (allSelected) {
            setSelected((prev) =>
                prev.filter(
                    (id) => !ids.includes(id)
                )
            );
        } else {
            setSelected((prev) => [
                ...new Set([
                    ...prev,
                    ...ids,
                ]),
            ]);
        }
    };

    const hasSelection =
        selected.length > 0;

    // --------------------------------------------------
    // Add User
    // --------------------------------------------------

    const handleAddUser = (newUser) => {
        const user = {
            id: `USR-${userIdCounter++}`,
            ...newUser,
            archived: false,
        };

        setUsers((prev) => [
            ...prev,
            user,
        ]);
    };

    // --------------------------------------------------
    // Archive / Restore Selected
    // --------------------------------------------------

    const handleArchiveSelected = () => {
        setUsers((prev) =>
            prev.map((user) =>
                selected.includes(user.id)
                    ? {
                          ...user,
                          archived:
                              !showArchived,
                      }
                    : user
            )
        );

        setSelected([]);
    };

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 3,
                minHeight: 0,
            }}
        >
            {/* Title */}
            <Typography
                sx={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 2,
                    flexShrink: 0,
                }}
            >
                Users
            </Typography>

            {/* ------------------------------------------------ */}
            {/* Filter Bar */}
            {/* ------------------------------------------------ */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 2,
                    flexWrap: "wrap",
                    flexShrink: 0,
                }}
            >

                {/* Add User - LEFT SIDE */}
                <Button
                    onClick={() =>
                        setAddUserOpen(true)
                    }
                    startIcon={
                        <AddIcon
                            sx={{
                                fontSize: 18,
                            }}
                        />
                    }
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        fontSize: "13.5px",
                        fontWeight: 600,

                        backgroundColor:
                            "#7c3aed",

                        borderRadius: "8px",

                        height: "36px",

                        flexShrink: 0,

                        "&:hover": {
                            backgroundColor:
                                "#6d28d9",
                        },
                    }}
                >
                    Add User
                </Button>


                {/* Search */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,

                        backgroundColor:
                            "#ffffff",

                        border:
                            "1px solid #e2e8f0",

                        borderRadius: "8px",

                        px: 1.5,

                        height: "36px",

                        minWidth: "220px",
                    }}
                >
                    <SearchIcon
                        sx={{
                            fontSize: 18,
                            color: "#94a3b8",
                        }}
                    />

                    <input
                        placeholder="Filter by keyword"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        style={{
                            border: "none",
                            outline: "none",
                            background:
                                "transparent",
                            fontSize: "13px",
                            width: "100%",
                        }}
                    />
                </Box>


                {/* Role Filter */}
                <FilterDropdown
                    label="Role"
                    options={ROLES}
                    selected={roleFilter}
                    onToggle={
                        toggleRoleFilter
                    }
                />


                {/* Clear */}
                {hasActiveFilters && (
                    <Button
                        onClick={clearFilters}
                        startIcon={
                            <ClearIcon
                                sx={{
                                    fontSize: 16,
                                }}
                            />
                        }
                        sx={{
                            textTransform:
                                "none",

                            fontSize: "13px",

                            fontWeight: 600,

                            color: "#64748b",

                            "&:hover": {
                                backgroundColor:
                                    "#f1f5f9",
                            },
                        }}
                    >
                        Clear
                    </Button>
                )}


                {/* Spacer */}
                <Box
                    sx={{
                        flex: 1,
                    }}
                />


                {/* ------------------------------------------------ */}
                {/* View Archived / View Active */}
                {/* ------------------------------------------------ */}

                <Button
                    onClick={() => {
                        setShowArchived(
                            (value) =>
                                !value
                        );

                        // Clear selected users
                        setSelected([]);

                        // Clear filters
                        setSearch("");
                        setRoleFilter([]);
                    }}
                    startIcon={
                        <ArchiveOutlinedIcon
                            sx={{
                                fontSize: 17,
                            }}
                        />
                    }
                    sx={{
                        textTransform: "none",

                        fontSize: "13.5px",

                        fontWeight: 600,

                        color: showArchived
                            ? "#7c3aed"
                            : "#64748b",

                        backgroundColor:
                            showArchived
                                ? "#f3f0fe"
                                : "transparent",

                        border: "1px solid",

                        borderColor:
                            showArchived
                                ? "#ddd6fe"
                                : "#e2e8f0",

                        borderRadius: "8px",

                        height: "36px",

                        flexShrink: 0,

                        "&:hover": {
                            backgroundColor:
                                showArchived
                                    ? "#ede9fe"
                                    : "#f8fafc",
                        },
                    }}
                >
                    {showArchived
                        ? "View Active"
                        : "View Archived"}
                </Button>


                {/* ------------------------------------------------ */}
                {/* Archive / Restore Selected */}
                {/* ------------------------------------------------ */}

                <Button
                    onClick={
                        handleArchiveSelected
                    }
                    disabled={!hasSelection}
                    startIcon={
                        <ArchiveOutlinedIcon
                            sx={{
                                fontSize: 17,
                            }}
                        />
                    }
                    sx={{
                        textTransform: "none",

                        fontSize: "13.5px",

                        fontWeight: 600,

                        color: hasSelection
                            ? "#dc2626"
                            : "#64748b",

                        backgroundColor:
                            hasSelection
                                ? "#fee2e2"
                                : "transparent",

                        border: "1px solid",

                        borderColor:
                            hasSelection
                                ? "#fecaca"
                                : "#e2e8f0",

                        borderRadius: "8px",

                        height: "36px",

                        flexShrink: 0,

                        "&:hover": {
                            backgroundColor:
                                hasSelection
                                    ? "#fecaca"
                                    : "#f1f5f9",
                        },

                        "&:disabled": {
                            color: "#cbd5e1",
                            borderColor:
                                "#e2e8f0",
                        },
                    }}
                >
                    {showArchived
                        ? "Restore"
                        : "Archive"}

                    {selected.length
                        ? ` (${selected.length})`
                        : ""}
                </Button>
            </Box>


            {/* User Table */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <UserTable
                    users={filteredUsers}
                    selected={selected}
                    onToggleSelect={
                        toggleSelect
                    }
                    onToggleSelectAll={
                        toggleSelectAll
                    }
                />
            </Box>

            {/* Add User Drawer */}
            <AddUser
                open={addUserOpen}
                onClose={() =>
                    setAddUserOpen(false)
                }
                onAdd={handleAddUser}
            />
        </Box>
    );
}