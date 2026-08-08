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
import { useState } from "react";
import {
  DashboardOutlined as DashboardOutlinedIcon,
  ViewKanbanOutlined as ViewKanbanOutlinedIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  StickyNote2Outlined as StickyNote2OutlinedIcon,
  AutoAwesomeOutlined as AutoAwesomeOutlinedIcon,
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
];

// TEMP mock data — swap for `GET /api/workspaces` (workspaces the user has a Membership in)
// once the backend endpoint exists. Kept local to Nav so nothing else needs to change yet.
const MOCK_WORKSPACES = [
  { id: "ws-1", name: "ToBeDone Team", logo: "" },
  { id: "ws-2", name: "Campus Project Group", logo: "" },
];

export default function Nav({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const width = isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  // TEMP local state for which workspace is active — replace with real
  // workspace context / API call once the backend supports it.
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    MOCK_WORKSPACES[0].id,
  );

  const navItemSx = (isActive) => ({
    borderRadius: "7px",
    mx: 1,
    mb: "2px",
    py: "7px",
    px: isOpen ? "10px" : "0px",
    minHeight: "auto",
    justifyContent: isOpen ? "flex-start" : "center",
    color: isActive ? "#7c3aed" : "#475569",
    backgroundColor: isActive ? "#f3f0fe" : "transparent",
    "&:hover": {
      backgroundColor: isActive ? "#f3f0fe" : "#f8fafc",
    },
  });

  const renderItem = (item, isActive, onClick, key) => {
    const button = (
      <ListItemButton onClick={onClick} sx={navItemSx(isActive)}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isOpen ? 1.25 : 0,
            color: isActive ? "#7c3aed" : item.danger ? "#dc2626" : "#94a3b8",
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
          borderRight: "1px solid #e5e7eb",
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
            workspaces={MOCK_WORKSPACES}
            activeWorkspaceId={activeWorkspaceId}
            onSwitch={setActiveWorkspaceId}
            onCreateNew={() => navigate("/dashboard/workspaces/new")}
            collapsed={!isOpen}
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#94a3b8",
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
              () => {
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
              },
              "logout",
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
