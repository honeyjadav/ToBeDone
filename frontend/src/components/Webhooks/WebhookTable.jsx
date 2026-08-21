import { useState } from 'react';
import { Box, Typography, Chip, Checkbox, Switch } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LinkIcon from '@mui/icons-material/Link';

const HEADERS = [
    { key: 'id', label: 'ID', width: '90px' },
    { key: 'name', label: 'Name', width: 'auto' },
    { key: 'url', label: 'Webhook URL', width: '280px' },
    { key: 'event', label: 'Event', width: '160px' },
    { key: 'active', label: 'Status', width: '110px' },
];

export default function WebhookTable({ webhooks, selected, onToggleSelect, onToggleSelectAll, onRowClick, onToggleActive, darkMode }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (key) => {
        if (key === 'active') return;
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedWebhooks = [...webhooks].sort((a, b) => {
        if (!sortKey) return 0;
        const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const allSelected = webhooks.length > 0 && webhooks.every((w) => selected.includes(w.id));
    const someSelected = webhooks.some((w) => selected.includes(w.id));

    return (
        <Box
            sx={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                minWidth: 0,
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, backgroundColor: darkMode ? '#1e293b' : '#f8fafc', flexShrink: 0, minWidth: 820, width: '100%' }}>
                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() => onToggleSelectAll(webhooks.map((w) => w.id))}
                        sx={{ color: darkMode ? '#64748b' : undefined }}
                    />
                </Box>
                <Box sx={{ width: '36px' }} />
                {HEADERS.map((h) => (
                    <Box
                        key={h.key}
                        onClick={() => handleSort(h.key)}
                        sx={{
                            width: h.width,
                            flex: h.width === 'auto' ? 1 : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 1.25,
                            cursor: h.key === 'active' ? 'default' : 'pointer',
                            userSelect: 'none',
                            '&:hover': h.key === 'active' ? {} : { backgroundColor: darkMode ? '#334155' : '#f1f5f9' },
                        }}
                    >
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: darkMode ? '#94a3b8' : '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                            {h.label}
                        </Typography>
                        {sortKey === h.key && (
                            sortDir === 'asc'
                                ? <ArrowUpwardIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                                : <ArrowDownwardIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Body */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {sortedWebhooks.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '13px', color: darkMode ? '#64748b' : '#94a3b8' }}>No webhooks to show</Typography>
                    </Box>
                ) : (
                    sortedWebhooks.map((wh) => {
                        const isChecked = selected.includes(wh.id);
                        return (
                            <Box
                                key={wh.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}`,
                                    cursor: 'pointer',
                                    backgroundColor: isChecked ? (darkMode ? '#2e1065' : '#f5f3ff') : 'transparent',
                                    minWidth: 820,
                                    width: '100%',
                                    '&:hover': { backgroundColor: isChecked ? (darkMode ? '#2e1065' : '#f5f3ff') : (darkMode ? '#1e293b' : '#f8fafc') },
                                    '&:last-of-type': { borderBottom: 'none' },
                                }}
                            >
                                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center', py: 1, flexShrink: 0 }}>
                                    <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => onToggleSelect(wh.id)}
                                        sx={{ color: darkMode ? '#64748b' : undefined }}
                                    />
                                </Box>
                                <Box sx={{ width: '36px', display: 'flex', justifyContent: 'center', flexShrink: 0 }} onClick={() => onRowClick(wh)}>
                                    <LinkIcon sx={{ fontSize: 17, color: darkMode ? '#a78bfa' : '#7c3aed' }} />
                                </Box>
                                <Box sx={{ width: '90px', px: 1.5, py: 1.25, flexShrink: 0 }} onClick={() => onRowClick(wh)}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#a78bfa' : '#7c3aed' }}>{wh.id}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, px: 1.5, py: 1.25, minWidth: 0 }} onClick={() => onRowClick(wh)}>
                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 500, color: darkMode ? '#f8fafc' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {wh.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '280px', px: 1.5, py: 1.25, flexShrink: 0 }} onClick={() => onRowClick(wh)}>
                                    <Typography sx={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {wh.url}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '160px', px: 1.5, py: 1.25, flexShrink: 0 }} onClick={() => onRowClick(wh)}>
                                    <Chip
                                        label={wh.event}
                                        size="small"
                                        sx={{
                                            height: '20px',
                                            fontSize: '11px',
                                            backgroundColor: darkMode ? '#334155' : '#f1f5f9',
                                            color: darkMode ? '#cbd5e1' : '#475569'
                                        }}
                                    />
                                </Box>
                                <Box sx={{ width: '110px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                                    <Switch
                                        size="small"
                                        checked={wh.active}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => onToggleActive(wh.id)}
                                        sx={{ '& .MuiSwitch-track': { backgroundColor: wh.active && darkMode ? '#7c3aed' : undefined } }}
                                    />
                                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: wh.active ? '#16a34a' : (darkMode ? '#64748b' : '#94a3b8') }}>
                                        {wh.active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}