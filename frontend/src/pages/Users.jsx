import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import UserTable from "../utils/UserTable";
import AddUser from "./AddUser";
import APICallService from "../services/APICallService";
import { LOCAL_STORAGE_KEYS } from "../constants/Constants";
import { useAuth } from "../hooks/useAuth";

// 1. Import settings utility
import { getAppSettings } from "../utils/preferences";

const ROLES = ["Admin", "Manager", "Member"];

// --------------------------------------------------
// Role Filter Dropdown
// --------------------------------------------------

function FilterDropdown({ label, options, selected, onToggle, darkMode }) {
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
          color: selected.length ? (darkMode ? '#c4b5fd' : '#7c3aed') : (darkMode ? '#e2e8f0' : '#334155'),
          backgroundColor: selected.length ? (darkMode ? '#2e1065' : '#f3f0fe') : (darkMode ? '#0f172a' : '#ffffff'),
          border: "1px solid",
          borderColor: selected.length ? (darkMode ? '#4c1d95' : '#ddd6fe') : (darkMode ? '#334155' : '#e2e8f0'),
          borderRadius: "8px",
          px: 1.5,
          height: "36px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
        {selected.length ? ` (${selected.length})` : ""}
      </Button>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#f8fafc' : '#1e293b',
            border: darkMode ? '1px solid #334155' : 'none'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => onToggle(option)}
            sx={{
              py: 0.25,
              '&:hover': { backgroundColor: darkMode ? '#334155' : undefined }
            }}
          >
            <Checkbox
              size="small"
              checked={selected.includes(option)}
              sx={{
                p: 0.5,
                mr: 0.5,
                color: darkMode ? '#94a3b8' : undefined,
                '&.Mui-checked': { color: '#7c3aed' }
              }}
            />

            <ListItemText
              primary={option}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "13px",
                },
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
  const { activeWorkspace } = useAuth();
  const currentWorkspaceRole = activeWorkspace?.role || "";
  const canAddUser = ["Admin", "Manager"].includes(currentWorkspaceRole);

  // 2. Initialize dark mode state and event listener
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

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState([]);
  const [selected, setSelected] = useState([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // --------------------------------------------------
  // Fetch Workspace Members
  // --------------------------------------------------

  useEffect(() => {
    fetchWorkspaceMembers();
  }, []);

  const fetchWorkspaceMembers = async () => {
    setLoading(true);

    try {
      const workspaceId = localStorage.getItem(
        LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID,
      );

      if (!workspaceId) {
        setSnackbar({
          open: true,
          message: "No active workspace selected.",
          severity: "error",
        });

        return;
      }

      const response =
        await APICallService.getWorkspaceMembers(workspaceId);

      const payload = response?.data;

      if (!payload?.success) {
        setSnackbar({
          open: true,
          message:
            payload?.message ||
            "Failed to fetch workspace members.",
          severity: "error",
        });

        return;
      }

      const members = payload?.data || [];

      const formattedUsers = members.map((member) => ({
        // IMPORTANT:
        // This is WorkspaceMember.memberId
        id: member.memberId,

        // User information
        name: member.name,
        email: member.email,

        // Workspace role
        role: member.role,

        // No archive functionality anymore
        isActive: true,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error(
        "Error fetching workspace members:",
        error
      );

      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch workspace members.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Role Filter
  // --------------------------------------------------

  const toggleRoleFilter = (role) => {
    setRoleFilter((prev) =>
      prev.includes(role)
        ? prev.filter((item) => item !== role)
        : [...prev, role],
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
  // Filter Users
  // --------------------------------------------------

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      user.name?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.id?.toLowerCase().includes(keyword);

    const matchesRole =
      roleFilter.length === 0 ||
      roleFilter.includes(user.role);

    return matchesSearch && matchesRole;
  });

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
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = (ids) => {
    const allSelected =
      ids.length > 0 &&
      ids.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !ids.includes(id)),
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...ids]),
      ]);
    }
  };

  const hasSelection = selected.length > 0;

  // --------------------------------------------------
  // Add User
  // --------------------------------------------------

  const handleAddUser = async (newUser) => {
    const workspaceId = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID,
    );

    if (!workspaceId) {
      const message =
        "No active workspace selected. Please choose a workspace first.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });

      return {
        success: false,
        message,
      };
    }

    try {
      const response =
        await APICallService.sendWorkspaceInvite(
          workspaceId,
          newUser,
        );

      const payload = response?.data;

      if (!payload?.success) {
        const message =
          payload?.message ||
          "Failed to send invite.";

        setSnackbar({
          open: true,
          message,
          severity: "error",
        });

        return {
          success: false,
          message,
        };
      }

      setSnackbar({
        open: true,
        message: "Invite sent successfully.",
        severity: "success",
      });

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send invite.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });

      return {
        success: false,
        message,
      };
    }
  };

  // --------------------------------------------------
  // Open Delete Confirmation
  // --------------------------------------------------

  const handleDeleteClick = () => {
    if (!selected.length) return;

    setDeleteDialogOpen(true);
  };

  // --------------------------------------------------
  // Delete Selected Members
  // --------------------------------------------------

  const handleDeleteSelected = async () => {
    if (!selected.length) return;

    const workspaceId = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID,
    );

    if (!workspaceId) {
      setSnackbar({
        open: true,
        message: "No active workspace selected.",
        severity: "error",
      });

      setDeleteDialogOpen(false);

      return;
    }

    try {
      setDeleteLoading(true);

      for (const memberId of selected) {
        await APICallService.removeMember(
          workspaceId,
          memberId,
        );
      }

      setSelected([]);

      setDeleteDialogOpen(false);

      setSnackbar({
        open: true,
        message: "Member(s) removed successfully.",
        severity: "success",
      });

      // Refresh member list
      await fetchWorkspaceMembers();
    } catch (error) {
      console.error(
        "Error removing workspace member:",
        error,
      );

      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove member.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateUser = async ({ memberId, role }) => {
    const workspaceId = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID
    );

    if (!workspaceId) {
      const message = "No active workspace selected.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });

      return {
        success: false,
        message,
      };
    }

    try {
      const response = await APICallService.updateMemberRole(
        workspaceId,
        memberId,
        role
      );

      const payload = response?.data;

      if (!payload?.success) {
        const message =
          payload?.message ||
          "Failed to update user role.";

        setSnackbar({
          open: true,
          message,
          severity: "error",
        });

        return {
          success: false,
          message,
        };
      }

      setSnackbar({
        open: true,
        message: "User role updated successfully.",
        severity: "success",
      });

      await fetchWorkspaceMembers();

      return {
        success: true,
      };
    } catch (error) {
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update user role.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });

      return {
        success: false,
        message,
      };
    }
  };

  const handleUserClick = (user) => {
    setEditUser(user);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        minHeight: 0,
        backgroundColor: darkMode ? '#020817' : '#f8fafc'
      }}
    >
      {/* ------------------------------------------------ */}
      {/* Title */}
      {/* ------------------------------------------------ */}

      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: 700,
          color: darkMode ? "#f8fafc" : "#1e293b",
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
        {canAddUser && (
          <Button
            onClick={() => setAddUserOpen(true)}
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

              backgroundColor: "#7c3aed",

              borderRadius: "8px",

              height: "36px",

              flexShrink: 0,

              "&:hover": {
                backgroundColor: "#6d28d9",
              },
            }}
          >
            Add User
          </Button>
        )}

        {/* Search */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
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
              setSearch(e.target.value)
            }
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              width: "100%",
              color: darkMode ? "#f8fafc" : "inherit"
            }}
          />
        </Box>

        {/* Role Filter */}

        <FilterDropdown
          label="Role"
          options={ROLES}
          selected={roleFilter}
          onToggle={toggleRoleFilter}
          darkMode={darkMode}
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
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: darkMode ? "#94a3b8" : "#64748b",

              "&:hover": {
                backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
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
        {/* Delete */}
        {/* ------------------------------------------------ */}

        <Button
          onClick={handleDeleteClick}
          disabled={!hasSelection || deleteLoading}
          startIcon={
            deleteLoading ? (
              <CircularProgress
                size={16}
                thickness={4}
              />
            ) : (
              <DeleteOutlineIcon
                sx={{
                  fontSize: 18,
                }}
              />
            )
          }
          sx={{
            textTransform: "none",
            fontSize: "13.5px",
            fontWeight: 600,

            color: hasSelection
              ? (darkMode ? '#fca5a5' : '#dc2626')
              : (darkMode ? '#64748b' : '#64748b'),

            backgroundColor: hasSelection
              ? (darkMode ? '#7f1d1d' : '#fee2e2')
              : "transparent",

            border: "1px solid",

            borderColor: hasSelection
              ? (darkMode ? '#991b1b' : '#fecaca')
              : (darkMode ? '#334155' : '#e2e8f0'),

            borderRadius: "8px",

            height: "36px",

            flexShrink: 0,

            "&:hover": {
              backgroundColor: hasSelection
                ? (darkMode ? '#991b1b' : '#fecaca')
                : (darkMode ? '#1e293b' : '#f1f5f9'),
            },

            "&:disabled": {
              color: darkMode ? '#475569' : '#cbd5e1',
              borderColor: darkMode ? '#1e293b' : '#e2e8f0',
            },
          }}
        >
          {deleteLoading
            ? "Deleting..."
            : "Delete"}

          {selected.length
            ? ` (${selected.length})`
            : ""}
        </Button>
      </Box>

      {/* ------------------------------------------------ */}
      {/* User Table */}
      {/* ------------------------------------------------ */}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {loading ? (
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
              size={32}
              thickness={4}
              sx={{
                color: "#7c3aed",
              }}
            />
          </Box>
        ) : (
          <UserTable
            users={filteredUsers}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onUserClick={handleUserClick}
            darkMode={darkMode}
          />
        )}
      </Box>

      {/* ------------------------------------------------ */}
      {/* Invite Member Drawer */}
      {/* ------------------------------------------------ */}

      <AddUser
        open={addUserOpen || Boolean(editUser)}
        onClose={() => {
          setAddUserOpen(false);
          setEditUser(null);
        }}
        onAdd={handleAddUser}
        onUpdate={handleUpdateUser}
        user={editUser}
      />

      {/* ------------------------------------------------ */}
      {/* Delete Confirmation Dialog */}
      {/* ------------------------------------------------ */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteDialogOpen(false);
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            width: "400px",
            maxWidth: "calc(100% - 32px)",
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            backgroundImage: 'none'
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: darkMode ? '#f8fafc' : "#1e293b",
            pb: 1,
          }}
        >
          Remove Member
          {selected.length > 1 ? "s" : ""}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: "14px",
              color: darkMode ? '#94a3b8' : "#64748b",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to remove{" "}
            <strong style={{ color: darkMode ? '#f8fafc' : '#1e293b' }}>
              {selected.length}{" "}
              {selected.length === 1
                ? "member"
                : "members"}
            </strong>{" "}
            from this workspace?
          </Typography>

          <Typography
            sx={{
              fontSize: "13px",
              color: darkMode ? '#64748b' : "#94a3b8",
              mt: 1,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={() =>
              setDeleteDialogOpen(false)
            }
            disabled={deleteLoading}
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: darkMode ? '#94a3b8' : "#64748b",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteSelected}
            disabled={deleteLoading}
            variant="contained"
            startIcon={
              deleteLoading ? (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{
                    color: "#ffffff",
                  }}
                />
              ) : (
                <DeleteOutlineIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              )
            }
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#dc2626",
              borderRadius: "8px",
              minWidth: "100px",

              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            {deleteLoading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------------------------------ */}
      {/* Snackbar */}
      {/* ------------------------------------------------ */}

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