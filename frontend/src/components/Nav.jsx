import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  DashboardOutlined as DashboardOutlinedIcon,
  ViewKanbanOutlined as ViewKanbanOutlinedIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  StickyNote2Outlined as StickyNote2OutlinedIcon,
  AutoAwesomeOutlined as AutoAwesomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon,
  WebhookOutlined as WebhookOutlinedIcon,
} from "@mui/icons-material";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export const EXPANDED_WIDTH = 224;
export const COLLAPSED_WIDTH = 68;
export const HEADER_HEIGHT = 60;

const links = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: "Tasks",
    path: "/dashboard/tasks",
    icon: <ViewKanbanOutlinedIcon fontSize="small" />,
  },
  {
    label: "Chats",
    path: "/dashboard/chat",
    icon: <ChatBubbleOutlineIcon fontSize="small" />,
  },
  {
    label: "Sticky Notes",
    path: "/dashboard/notes",
    icon: <StickyNote2OutlinedIcon fontSize="small" />,
  },
  {
    label: "AI Digest",
    path: "/dashboard/digest",
    icon: <AutoAwesomeOutlinedIcon fontSize="small" />,
  },
  {
    label: "Webhooks",
    path: "/dashboard/webhooks",
    icon: <WebhookOutlinedIcon fontSize="small" />,
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <PeopleOutlinedIcon fontSize="small" />,
  },
];

export default function Nav({ isOpen, setIsOpen, darkMode = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const width = isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const { workspaces, activeWorkspace, selectWorkspace, logout } = useAuth();
  const palette = darkMode
    ? {
      paper: '#0f172a',
      panel: '#111827',
      border: 'rgba(148, 163, 184, 0.18)',
      text: '#e2e8f0',
      muted: '#94a3b8',
      hover: '#1e293b',
      activeBackground: '#312e81',
      activeText: '#c4b5fd',
      itemBackground: '#111827',
    }
    : {
      paper: '#ffffff',
      panel: '#f8fafc',
      border: '#e5e7eb',
      text: '#1e293b',
      muted: '#64748b',
      hover: '#f8fafc',
      activeBackground: '#f3f0fe',
      activeText: '#7c3aed',
      itemBackground: '#ffffff',
    };

  const handleSwitchWorkspace = async (workspaceId) => {
    try {
      await selectWorkspace(workspaceId);

      // Reload the CURRENT page
      window.location.reload();
    } catch (err) {
      console.error("Failed to switch workspace:", err);
    }
  };

  const navItemSx = (isActive) => ({
    borderRadius: "7px",
    mx: 1,
    mb: "2px",
    py: "7px",
    px: isOpen ? "10px" : "0px",
    minHeight: "auto",
    justifyContent: isOpen ? "flex-start" : "center",
    color: isActive ? palette.activeText : palette.muted,
    backgroundColor: isActive ? palette.activeBackground : "transparent",
    "&:hover": {
      backgroundColor: isActive ? palette.activeBackground : palette.hover,
    },
  });

  const renderItem = (item, isActive, onClick, key) => {
    const button = (
      <ListItemButton onClick={onClick} sx={navItemSx(isActive)}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isOpen ? 1.25 : 0,
            color: isActive ? palette.activeText : item.danger ? "#dc2626" : palette.muted,
            justifyContent: "center",
          }}
        >
          {item.icon}
        </ListItemIcon>
        {isOpen && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: "13.5px",
              fontWeight: isActive ? 600 : 500,
            }}
          />
        )}
      </ListItemButton>
    );
    return isOpen ? (
      <Box key={key}>{button}</Box>
    ) : (
      <Tooltip title={item.label} placement="right" key={key}>
        {button}
      </Tooltip>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "width 0.2s ease",
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          borderRight: `1px solid ${palette.border}`,
          backgroundColor: palette.paper,
          position: "fixed",
          top: `${HEADER_HEIGHT}px`,
          left: 0,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflowX: "hidden",
          transition: "width 0.2s ease",
          zIndex: 90,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: 1.5,
        }}
      >
        <Box>
          {/* Workspace switcher — sits above the Overview label */}
          <WorkspaceSwitcher
            workspaces={workspaces.map((w) => ({
              id: w.workspaceId,
              name: w.name,
              logo: w.logo,
            }))}
            activeWorkspaceId={activeWorkspace?.workspaceId}
            onSwitch={handleSwitchWorkspace}
            onCreateNew={() => navigate("/workspace")}
            collapsed={!isOpen}
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            darkMode={darkMode}
          />

          {isOpen && (
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: palette.muted,
                px: 2,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Overview
            </Typography>
          )}

          <List sx={{ py: 0 }}>
            {links.map((item) =>
              renderItem(
                item,
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.path),
                () => navigate(item.path),
                item.path,
              ),
            )}
          </List>
        </Box>

        <Box>
          <Divider sx={{ mx: isOpen ? 2 : 1, mb: 1.5 }} />
          <List sx={{ py: 0 }}>
            {renderItem(
              {
                label: "Settings",
                icon: <SettingsOutlinedIcon fontSize="small" />,
              },
              location.pathname.startsWith("/dashboard/settings"),
              () => navigate("/dashboard/settings"),
              "settings",
            )}
            {renderItem(
              {
                label: "Logout",
                icon: <LogoutOutlinedIcon fontSize="small" />,
                danger: true,
              },
              false,
              async () => {
                try {
                  await logout();

                  navigate("/login", {
                    replace: true,
                  });
                } catch (error) {
                  console.error("Logout failed:", error);

                  // Even if API logout fails, remove the user from the dashboard
                  navigate("/login", {
                    replace: true,
                  });
                }
              },
              "logout",
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
