import { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TagIcon from '@mui/icons-material/Tag';

const TYPE_CONFIG = {
    DIGEST: { icon: AutoAwesomeIcon, color: '#7c3aed', bg: '#f3f0fe' },
    DIRECT: { icon: AlternateEmailIcon, color: '#3b82f6', bg: '#eff6ff' },
};

// TEMP mock data, shaped exactly like the Notification model.
// The DIGEST entries mirror the digestHistory content in Digest.jsx so the
// notification actually matches what the AI Digest page shows — once the
// backend cron job exists, these get replaced by real Notification docs
// created every time a digest is generated (see DigestSettings + ActivityLog).
const mockNotifications = [
    {
        id: '1',
        type: 'DIGEST',
        title: 'Your digest is ready · Last 24h',
        summary: 'Prioritize wrapping up the "Fix sidebar overlap" review — it\'s been sitting the longest and is blocking two other tasks.',
        isRead: false,
        sentToSlack: true,
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
        id: '2',
        type: 'DIRECT',
        title: 'Aisha Khan mentioned you',
        summary: '"@John can you review the sidebar fix before EOD?"',
        isRead: false,
        sentToSlack: false,
        createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
        id: '3',
        type: 'DIGEST',
        title: 'Your digest is ready · This Week',
        summary: 'Reply to Priya\'s open question in #general — it\'s been unanswered for over 12 hours and may be blocking her work.',
        isRead: true,
        sentToSlack: true,
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    },
    {
        id: '4',
        type: 'DIRECT',
        title: 'Task overdue',
        summary: '"Fix sidebar overlap" was due yesterday and is still In Progress.',
        isRead: true,
        sentToSlack: false,
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
        id: '5',
        type: 'DIGEST',
        title: 'Your digest is ready · Last 24h',
        summary: 'Consider re-enabling the Analytics Sync webhook so your dashboard reflects up-to-date numbers.',
        isRead: true,
        sentToSlack: false,
        createdAt: new Date(Date.now() - 33 * 3600000).toISOString(),
    },
    {
        id: '6',
        type: 'DIGEST',
        title: 'Your digest is ready · This Week',
        summary: 'Good pace this week — no urgent blockers. Keep an eye on upcoming deadlines in the next 3 days.',
        isRead: true,
        sentToSlack: true,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
];

const FILTERS = ['All', 'Unread', 'Digests', 'Mentions & Direct'];

const Notifications = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [tab, setTab] = useState(0);

    const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const filtered = notifications.filter((n) => {
        if (tab === 1) return !n.isRead;
        if (tab === 2) return n.type === 'DIGEST';
        if (tab === 3) return n.type === 'DIRECT';
        return true;
    });

    const timeAgo = (dateStr) => {
        const diffMs = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
            <Box sx={{ maxWidth: '760px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>Notifications</Typography>
                <Box sx={{ flex: 1 }} />
                {unreadCount > 0 && (
                    <Button onClick={markAllRead} sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>
                        Mark all as read
                    </Button>
                )}
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 2 }}>
                Digest summaries, mentions, and task alerts in one place
            </Typography>

            <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                sx={{ mb: 2, minHeight: '36px', '& .MuiTab-root': { textTransform: 'none', fontSize: '13px', fontWeight: 600, minHeight: '36px', color: '#64748b' }, '& .Mui-selected': { color: '#7c3aed !important' }, '& .MuiTabs-indicator': { backgroundColor: '#7c3aed' } }}
            >
                {FILTERS.map((f) => <Tab key={f} label={f} />)}
            </Tabs>

            <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
                {filtered.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>Nothing here</Typography>
                    </Box>
                ) : (
                    filtered.map((n, i) => {
                        const cfg = TYPE_CONFIG[n.type];
                        const Icon = cfg.icon;
                        return (
                            <Box
                                key={n.id}
                                onClick={() => markRead(n.id)}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    px: 2.5,
                                    py: 2,
                                    cursor: 'pointer',
                                    backgroundColor: n.isRead ? 'transparent' : '#faf9ff',
                                    borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9',
                                    '&:hover': { backgroundColor: '#f8fafc' },
                                }}
                            >
                                <Box sx={{ width: 34, height: 34, borderRadius: '8px', flexShrink: 0, backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon sx={{ fontSize: 16 }} />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{n.title}</Typography>
                                        {!n.isRead && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7c3aed' }} />}
                                        {n.sentToSlack && <TagIcon sx={{ fontSize: 13, color: '#0891b2', ml: 0.25 }} />}
                                    </Box>
                                    <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.35 }}>{n.summary}</Typography>
                                    <Typography sx={{ fontSize: '11.5px', color: '#94a3b8', mt: 0.5 }}>{timeAgo(n.createdAt)}</Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
            </Box>
        </Box>
    );
}

export { mockNotifications };
export default Notifications;