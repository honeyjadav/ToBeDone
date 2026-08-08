
import { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Drawer from '../components/Drawer';
import WebhookTable from '../components/webhooks/WebhookTable';
import WebhookForm from '../components/webhooks/WebhookForm';

const initialWebhooks = [
    { id: 'WH-101', name: 'Slack Notifications', url: 'https://hooks.slack.com/services/xxx', event: 'task.created', headers: [], active: true },
    { id: 'WH-102', name: 'CI Pipeline Trigger', url: 'https://ci.example.com/hooks/build', event: 'task.updated', headers: [{ key: 'Authorization', value: 'Bearer xxx' }], active: true },
    { id: 'WH-103', name: 'Analytics Sync', url: 'https://analytics.example.com/ingest', event: 'note.created', headers: [], active: false },
];

let idCounter = 104;

const EMPTY_DRAFT = { name: '', url: '', event: '', headers: [], active: true };

export default function Webhooks() {
    const [webhooks, setWebhooks] = useState(initialWebhooks);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [draft, setDraft] = useState(EMPTY_DRAFT);

    const isEdit = Boolean(draft.id);

    const filteredWebhooks = webhooks.filter(
        (w) => w.name.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleSelectAll = (ids) => {
        const allSelected = ids.every((id) => selected.includes(id));
        setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
    };

    const toggleActive = (id) => setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)));

    const openAddDrawer = () => {
        setDraft(EMPTY_DRAFT);
        setDrawerOpen(true);
    };

    const openEditDrawer = (webhook) => {
        setDraft(webhook);
        setDrawerOpen(true);
    };

    const closeDrawer = () => setDrawerOpen(false);

    const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

    const handleSaveWebhook = () => {
        if (!draft.name.trim() || !draft.url.trim()) return;
        if (draft.id) {
            setWebhooks((prev) => prev.map((w) => (w.id === draft.id ? draft : w)));
        } else {
            const newWebhook = { ...draft, id: `WH-${idCounter++}` };
            setWebhooks((prev) => [...prev, newWebhook]);
        }
        setDrawerOpen(false);
    };

    const handleDeleteWebhook = (id) => {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
        setSelected((prev) => prev.filter((x) => x !== id));
        setDrawerOpen(false);
    };

    const handleDeleteSelected = () => {
        setWebhooks((prev) => prev.filter((w) => !selected.includes(w.id)));
        setSelected([]);
    };

    const hasSelection = selected.length > 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, minHeight: 0 }}>
            {/* Title */}
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', mb: 2, flexShrink: 0 }}>
                Webhooks
            </Typography>

            {/* Action bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Button
                    onClick={openAddDrawer}
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        backgroundColor: '#7c3aed',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: '#6d28d9' },
                    }}
                >
                    Add Webhook
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, height: '36px', minWidth: '220px' }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <input
                        placeholder="Filter by keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }}
                    />
                </Box>

                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={handleDeleteSelected}
                    disabled={!hasSelection}
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: hasSelection ? '#dc2626' : '#64748b',
                        backgroundColor: hasSelection ? '#fee2e2' : 'transparent',
                        border: '1px solid',
                        borderColor: hasSelection ? '#fecaca' : '#e2e8f0',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: hasSelection ? '#fecaca' : '#f1f5f9' },
                        '&:disabled': { color: '#cbd5e1', borderColor: '#e2e8f0' },
                    }}
                >
                    Delete{selected.length ? ` (${selected.length})` : ''}
                </Button>
            </Box>

            {/* Table */}
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <WebhookTable
                    webhooks={filteredWebhooks}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onRowClick={openEditDrawer}
                    onToggleActive={toggleActive}
                />
            </Box>

            {/* Generic Drawer holding the webhook form */}
            <Drawer
                open={drawerOpen}
                title={isEdit ? 'Edit Webhook' : 'Add Webhook'}
                onClose={closeDrawer}
                guideLink="https://example.com/docs/webhooks"
                primaryAction={{ label: isEdit ? 'Save' : 'Add Webhook', onClick: handleSaveWebhook }}
                secondaryAction={{ label: 'Discard', onClick: closeDrawer }}
                extraFooterActions={
                    isEdit && (
                        <IconButton onClick={() => handleDeleteWebhook(draft.id)} size="small" title="Delete" sx={{ color: '#dc2626' }}>
                            <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    )
                }
            >
                <WebhookForm draft={draft} onChange={updateDraft} />
            </Drawer>
        </Box>
    );
}