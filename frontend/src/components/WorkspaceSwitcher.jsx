import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  IconButton,
  InputBase,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PURPLE = '#7c3aed';
const SEARCH_THRESHOLD = 7;

const AVATAR_PALETTE = [
  { bg: '#ede9fe', color: '#7c3aed' },
  { bg: '#dbeafe', color: '#2563eb' },
  { bg: '#dcfce7', color: '#16a34a' },
  { bg: '#fef3c7', color: '#d97706' },
  { bg: '#fce7f3', color: '#db2777' },
  { bg: '#e0e7ff', color: '#4f46e5' },
  { bg: '#ffe4e6', color: '#e11d48' },
];

function colorFor(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function WorkspaceAvatar({ workspace, size = 26, fontSize = '11px' }) {
  const { bg, color } = colorFor(workspace.id);
  return (
    <Avatar
      src={workspace.logo || undefined}
      variant="rounded"
      sx={{ width: size, height: size, fontSize, fontWeight: 700, borderRadius: '7px', backgroundColor: bg, color, flexShrink: 0 }}
    >
      {!workspace.logo && getInitials(workspace.name)}
    </Avatar>
  );
}

// Row shown when the user belongs to zero workspaces
function EmptyWorkspaceRow({ collapsed, onCreateNew }) {
  return (
    <Box
      onClick={onCreateNew}
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
        border: `1px dashed ${PURPLE}55`,
        backgroundColor: '#faf5ff',
        '&:hover': { backgroundColor: '#f3e8ff' },
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ede9fe',
          color: PURPLE,
          flexShrink: 0,
        }}
      >
        <AddBusinessIcon sx={{ fontSize: 15 }} />
      </Box>
      {!collapsed && (
        <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: PURPLE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Create a workspace
        </Typography>
      )}
    </Box>
  );
}

export default function WorkspaceSwitcher({
  workspaces = [],
  activeWorkspaceId,
  onSwitch,
  onCreateNew,
  collapsed = false,
  isOpen,
  onToggle,
  darkMode = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const theme = darkMode
    ? {
      surface: '#0f172a',
      panel: '#111827',
      soft: '#1e293b',
      border: 'rgba(148, 163, 184, 0.18)',
      text: '#e2e8f0',
      muted: '#94a3b8',
      hover: '#1e293b',
      input: '#0b1220',
    }
    : {
      surface: '#f8fafc',
      panel: '#ffffff',
      soft: '#f8fafc',
      border: '#e2e8f0',
      text: '#1e293b',
      muted: '#94a3b8',
      hover: '#f1f5f9',
      input: '#f8fafc',
    };

  const active = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const hasWorkspaces = workspaces.length > 0;

  const filtered = useMemo(() => {
    if (!query.trim()) return workspaces;
    const q = query.trim().toLowerCase();
    return workspaces.filter((w) => w.name.toLowerCase().includes(q));
  }, [workspaces, query]);

  const handleClose = () => {
    setAnchorEl(null);
    setQuery('');
  };

  const CollapseToggle = (
    <IconButton
      onClick={onToggle}
      size="small"
      sx={{ border: `1px solid ${theme.border}`, borderRadius: '7px', width: 28, height: 28, color: theme.muted, flexShrink: 0, backgroundColor: darkMode ? '#0f172a' : '#ffffff' }}
    >
      {isOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
    </IconButton>
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 1, mb: 0.75 }}>
        {hasWorkspaces ? (
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
              border: `1px solid ${theme.border}`,
              backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
              '&:hover': { backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' },
            }}
          >
            <WorkspaceAvatar workspace={active} />
            {!collapsed && (
              <>
                <Typography
                  sx={{ fontSize: '13px', fontWeight: 700, color: theme.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {active.name}
                </Typography>
                <ExpandMoreIcon sx={{ fontSize: 18, color: '#94a3b8', flexShrink: 0 }} />
              </>
            )}
          </Box>
        ) : (
          <EmptyWorkspaceRow collapsed={collapsed} onCreateNew={onCreateNew} />
        )}

        {!collapsed && CollapseToggle}
      </Box>

      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.75 }}>
          {CollapseToggle}
        </Box>
      )}

      {hasWorkspaces && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ sx: { width: 260, mt: 0.5, maxHeight: 420, display: 'flex', flexDirection: 'column' } }}
          MenuListProps={{ sx: { py: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } }}
        >
          <Typography
            sx={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', px: 2, pt: 1, pb: workspaces.length > SEARCH_THRESHOLD ? 0.5 : 1, flexShrink: 0 }}
          >
            Your workspaces
          </Typography>

          {workspaces.length > SEARCH_THRESHOLD && (
            <Box sx={{ px: 1.5, pb: 1, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.5, borderRadius: '7px', border: `1px solid ${theme.border}`, backgroundColor: darkMode ? '#0b1220' : '#f8fafc' }}>
                <SearchIcon sx={{ fontSize: 16, color: theme.muted }} />
                <InputBase
                  autoFocus
                  placeholder="Search workspaces..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  sx={{ fontSize: '13px', flex: 1, color: theme.text }}
                />
              </Box>
            </Box>
          )}

          <Box
            sx={{
              overflowY: 'auto',
              flex: 1,
              minHeight: 0,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#e2e8f0', borderRadius: '3px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            {filtered.length === 0 ? (
              <Typography sx={{ fontSize: '13px', color: theme.muted, textAlign: 'center', py: 2 }}>
                No workspaces match "{query}"
              </Typography>
            ) : (
              filtered.map((w) => {
                const isActive = w.id === active?.id;
                return (
                  <MenuItem
                    key={w.id}
                    selected={isActive}
                    onClick={() => { onSwitch(w.id); handleClose(); }}
                    sx={{ fontSize: '13px', gap: 1, py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <WorkspaceAvatar workspace={w} size={24} fontSize="10px" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.name}
                    </Typography>
                    {isActive && <CheckIcon sx={{ fontSize: 16, color: PURPLE, flexShrink: 0 }} />}
                  </MenuItem>
                );
              })
            )}
          </Box>

          <Divider sx={{ my: 0.5, flexShrink: 0 }} />

          <MenuItem
            onClick={() => { onCreateNew(); handleClose(); }}
            sx={{ fontSize: '13px', gap: 1, color: PURPLE, fontWeight: 600, flexShrink: 0 }}
          >
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <AddIcon sx={{ fontSize: 18, color: PURPLE }} />
            </ListItemIcon>
            Create workspace
          </MenuItem>
        </Menu>
      )}
    </>
  );
}