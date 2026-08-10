import { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Avatar, Divider, ListItemIcon, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Workspace switcher — sits in the sidebar above "OVERVIEW".
 * Shows the active workspace's logo/name, opens a menu to switch
 * between workspaces the user belongs to (via Membership), or create a new one.
 * Also hosts the sidebar collapse/expand toggle on the same row (saves a row of space).
 *
 * Props:
 * - workspaces: [{ id, name, logo }] // from GET /api/workspaces (user's memberships)
 * - activeWorkspaceId: string
 * - onSwitch: (workspaceId) => void
 * - onCreateNew: () => void // opens "Create Workspace" flow
 * - collapsed: boolean // sidebar collapsed state, hides text if true
 * - isOpen: boolean // sidebar open state (inverse of collapsed), drives chevron direction
 * - onToggle: () => void // toggles sidebar open/collapsed
 */
export default function WorkspaceSwitcher({
  workspaces = [],
  activeWorkspaceId,
  onSwitch,
  onCreateNew,
  collapsed = false,
  isOpen,
  onToggle,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const active = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  if (!active) return null;

  const initials = active.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mx: 1,
          mb: 0.75,
        }}
      >
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: collapsed ? 0.75 : 1.25,
            py: 0.75,
            flex: 1,
            minWidth: 0,
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            '&:hover': { backgroundColor: '#f1f5f9' },
          }}
        >
          <Avatar
            src={active.logo || undefined}
            sx={{
              width: 26,
              height: 26,
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#ede9fe',
              color: '#7c3aed',
              flexShrink: 0,
            }}
          >
            {!active.logo && initials}
          </Avatar>

          {!collapsed && (
            <>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1e293b',
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {active.name}
              </Typography>
              <ExpandMoreIcon sx={{ fontSize: 18, color: '#94a3b8', flexShrink: 0 }} />
            </>
          )}
        </Box>

        {/* Collapse/expand toggle — lives on the same row as the workspace name when expanded */}
        {!collapsed && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '7px',
              width: 28,
              height: 28,
              color: '#64748b',
              flexShrink: 0,
            }}
          >
            {isOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>

      {/* When collapsed, there's no room next to the avatar, so show a small centered toggle below it */}
      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.75 }}>
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '7px',
              width: 28,
              height: 28,
              color: '#64748b',
            }}
          >
            {isOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { width: 240, mt: 0.5 } }}
      >
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            px: 2,
            py: 1,
          }}
        >
          Your workspaces
        </Typography>

        {workspaces.map((w) => {
          const isActive = w.id === active.id;
          const wInitials = w.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <MenuItem
              key={w.id}
              selected={isActive}
              onClick={() => {
                onSwitch(w.id);
                setAnchorEl(null);
              }}
              sx={{ fontSize: '13px', gap: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <Avatar
                  src={w.logo || undefined}
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: '#ede9fe',
                    color: '#7c3aed',
                  }}
                >
                  {!w.logo && wInitials}
                </Avatar>
              </ListItemIcon>
              <Typography
                sx={{
                  fontSize: '13px',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {w.name}
              </Typography>
              {isActive && <CheckIcon sx={{ fontSize: 16, color: '#7c3aed' }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            onCreateNew();
            setAnchorEl(null);
          }}
          sx={{ fontSize: '13px', gap: 1, color: '#7c3aed', fontWeight: 600 }}
        >
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <AddIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
          </ListItemIcon>
          Create workspace
        </MenuItem>
      </Menu>
    </>
  );
}