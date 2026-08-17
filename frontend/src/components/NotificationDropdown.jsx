import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Menu, Badge, Divider, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useNavigate } from 'react-router-dom';

// type: "DIGEST" | "DIRECT" — mirrors the Notification model
const TYPE_CONFIG = {
    DIGEST: { icon: AutoAwesomeIcon, color: '#7c3aed', bg: '#f3f0fe' },
    DIRECT: { icon: AlternateEmailIcon, color: '#3b82f6', bg: '#eff6ff' },
};

/**
 * Notification bell + dropdown, for the top header.
 * Reads from the Notification model: { id, type, title, summary, isRead, createdAt }
 *
 * Props:
 * - notifications: array of notification objects (most recent first, already sliced to ~10)
 * - onMarkRead: (id) => void
 * - onMarkAllRead: () => void
 * - onOpenNotification: (notification) => void   // navigate to source (task/digest/chat)
 */
export default function NotificationDropdown({ notifications = [], onMarkRead, onMarkAllRead, onOpenNotification }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleItemClick = (n) => {
        const notificationId = n.notificationId || n._id || n.id;
        if (!n.isRead) onMarkRead(notificationId);
        onOpenNotification?.(n);
        setAnchorEl(null);
    };

    const timeAgo = (dateStr) => {
        const diffMs = now - new Date(dateStr).getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ border: '1px solid #e5e7eb', borderRadius: '8px', width: 36, height: 36 }}>
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '9px', height: 15, minWidth: 15 } }}>
                    <NotificationsIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360,
                            maxHeight: 440,
                            display: 'flex',
                            flexDirection: 'column',
                            // Popover sets its own inline overflow-y:auto for auto-positioning —
                            // '!important' is needed to actually override that inline style.
                            overflow: 'hidden !important',
                        },
                    },
                    list: { sx: { p: 0, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1, overflow: 'hidden !important' } },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Notifications</Typography>
                    <Box sx={{ flex: 1 }} />
                    {unreadCount > 0 && (
                        <Button
                            onClick={onMarkAllRead}
                            sx={{ textTransform: 'none', fontSize: '11.5px', fontWeight: 600, color: '#7c3aed', minWidth: 'auto', p: 0.5 }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>
                <Divider sx={{ flexShrink: 0 }} />

                {notifications.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>You're all caught up</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            overflowY: 'auto',
                            minHeight: 0,
                            flex: 1,
                            maxHeight: 320, // forces scroll once items exceed this, instead of silently clipping
                            // slim, unobtrusive scrollbar instead of the browser default
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '999px' },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#94a3b8' },
                            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 transparent',
                        }}
                    >
                        {notifications.map((n) => {
                            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.DIRECT;
                            const Icon = cfg.icon;
                            const notificationId = n.notificationId || n._id || n.id;
                            return (
                                <Box
                                    key={notificationId}
                                    onClick={() => handleItemClick(n)}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.25,
                                        px: 2,
                                        py: 1.5,
                                        cursor: 'pointer',
                                        backgroundColor: n.isRead ? 'transparent' : '#faf9ff',
                                        borderBottom: '1px solid #f1f5f9',
                                        '&:hover': { backgroundColor: '#f8fafc' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                                            backgroundColor: cfg.bg, color: cfg.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <Icon sx={{ fontSize: 15 }} />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{n.title}</Typography>
                                            {!n.isRead && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7c3aed', flexShrink: 0 }} />}
                                        </Box>
                                        <Typography sx={{ fontSize: '12.5px', color: '#64748b', mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {n.summary}
                                        </Typography>
                                        <Typography sx={{ fontSize: '11px', color: '#94a3b8', mt: 0.5 }}>{timeAgo(n.createdAt)}</Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                <Divider sx={{ flexShrink: 0 }} />
                <Box sx={{ px: 1, py: 1, flexShrink: 0 }}>
                    <Button
                        fullWidth
                        onClick={() => { setAnchorEl(null); navigate('/dashboard/notifications'); }}
                        sx={{ textTransform: 'none', fontSize: '12.5px', fontWeight: 600, color: '#475569' }}
                    >
                        View all notifications
                    </Button>
                </Box>
            </Menu>
        </>
    );
}