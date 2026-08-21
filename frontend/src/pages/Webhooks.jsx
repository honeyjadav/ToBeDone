import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Drawer from '../components/Drawer';
import WebhookTable from '../components/Webhooks/WebhookTable';
import WebhookForm from '../components/Webhooks/WebhookForm';
import APICallService from '../services/APICallService';
import { useAuth } from '../hooks/useAuth';

// 1. Import getAppSettings for dark mode state
import { getAppSettings } from '../utils/preferences';

const EMPTY_DRAFT = { id: '', name: '', url: '', event: '', headers: [], active: true };

const normalizeWebhook = (payload) => {
    const item = payload || {};
    const id = item.webhookId || item.id || item._id || '';
    return {
        id,
        name: item.name || '',
        url: item.url || '',
        event: item.event || '',
        headers: Array.isArray(item.headers) ? item.headers : [],
        active: item.active !== false,
    };
};

export default function Webhooks() {
    const { activeWorkspace } = useAuth();
    const workspaceId = activeWorkspace?.workspaceId;

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

    const [webhooks, setWebhooks] = useState([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [draft, setDraft] = useState(EMPTY_DRAFT);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [deleteSelectedConfirm, setDeleteSelectedConfirm] = useState(false);

    const isEdit = Boolean(draft.id);

    const fetchWebhooks = async () => {
        if (!workspaceId) return;

        setLoading(true);
        setError('');

        try {
            const response = await APICallService.getWebhooks(workspaceId);
            const payload = response?.data?.data || [];
            setWebhooks((Array.isArray(payload) ? payload : []).map(normalizeWebhook));
        } catch (err) {
            console.error('Failed to load webhooks:', err);
            setError(err?.response?.data?.message || 'Unable to load webhooks');
            setWebhooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    const filteredWebhooks = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return webhooks;

        return webhooks.filter((w) => {
            return (
                (w.name || '').toLowerCase().includes(term) ||
                (w.id || '').toLowerCase().includes(term) ||
                (w.event || '').toLowerCase().includes(term)
            );
        });
    }, [search, webhooks]);

    const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleSelectAll = (ids) => {
        const allSelected = ids.every((id) => selected.includes(id));
        setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
    };

    const toggleActive = async (id) => {
        if (!workspaceId) return;

        const current = webhooks.find((w) => w.id === id);
        if (!current) return;

        try {
            const response = await APICallService.updateWebhook(workspaceId, id, { active: !current.active });
            const updated = normalizeWebhook(response?.data?.data || { ...current, active: !current.active });
            setWebhooks((prev) => prev.map((w) => (w.id === id ? updated : w)));
        } catch (err) {
            console.error('Failed to update webhook status:', err);
            setError(err?.response?.data?.message || 'Unable to update webhook status');
        }
    };

    const openAddDrawer = () => {
        setDraft(EMPTY_DRAFT);
        setDrawerOpen(true);
        setError('');
    };

    const openEditDrawer = (webhook) => {
        setDraft(normalizeWebhook(webhook));
        setDrawerOpen(true);
        setError('');
    };

    const closeDrawer = () => setDrawerOpen(false);

    const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

    const handleSaveWebhook = async () => {
        if (!workspaceId) return;
        if (!draft.name?.trim() || !draft.url?.trim() || !draft.event?.trim()) {
            setError('Name, URL and event are required');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const payload = {
                name: draft.name.trim(),
                url: draft.url.trim(),
                event: draft.event.trim(),
                headers: Array.isArray(draft.headers) ? draft.headers : [],
                active: draft.active !== false,
            };

            if (draft.id) {
                const response = await APICallService.updateWebhook(workspaceId, draft.id, payload);
                const updated = normalizeWebhook(response?.data?.data || { ...draft, ...payload });
                setWebhooks((prev) => prev.map((w) => (w.id === draft.id ? updated : w)));
            } else {
                const response = await APICallService.createWebhook(workspaceId, payload);
                const created = normalizeWebhook(response?.data?.data || { ...payload, id: Date.now().toString() });
                setWebhooks((prev) => [created, ...prev]);
            }

            setDrawerOpen(false);
            setDraft(EMPTY_DRAFT);
        } catch (err) {
            console.error('Failed to save webhook:', err);
            setError(err?.response?.data?.message || 'Unable to save webhook');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWebhook = async (id) => {
        if (!workspaceId || !id) return;

        try {
            setSaving(true);
            await APICallService.deleteWebhook(workspaceId, id);
            setWebhooks((prev) => prev.filter((w) => w.id !== id));
            setSelected((prev) => prev.filter((x) => x !== id));
            setDrawerOpen(false);
            setDraft(EMPTY_DRAFT);
        } catch (err) {
            console.error('Failed to delete webhook:', err);
            setError(err?.response?.data?.message || 'Unable to delete webhook');
        } finally {
            setSaving(false);
            setDeleteConfirmId(null);
        }
    };

    const handleDeleteSelected = async () => {
        if (!workspaceId || !selected.length) return;

        try {
            setSaving(true);
            await Promise.all(selected.map((id) => APICallService.deleteWebhook(workspaceId, id)));
            setWebhooks((prev) => prev.filter((w) => !selected.includes(w.id)));
            setSelected([]);
            setDeleteSelectedConfirm(false);
        } catch (err) {
            console.error('Failed to delete selected webhooks:', err);
            setError(err?.response?.data?.message || 'Unable to delete selected webhooks');
        } finally {
            setSaving(false);
        }
    };

    const confirmDeleteWebhook = () => {
        if (!deleteConfirmId) return;
        handleDeleteWebhook(deleteConfirmId);
    };

    const requestDeleteWebhook = (id) => {
        setDeleteConfirmId(id);
    };

    const requestDeleteSelected = () => {
        if (!selected.length) return;
        setDeleteSelectedConfirm(true);
    };

    const hasSelection = selected.length > 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, minHeight: 0, backgroundColor: darkMode ? '#020817' : '#f8fafc' }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', mb: 2, flexShrink: 0 }}>
                Webhooks
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Button
                    onClick={openAddDrawer}
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    variant="contained"
                    disabled={!workspaceId || saving}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        backgroundColor: '#7c3aed',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        mr: 0.75,
                        '&:hover': { backgroundColor: '#6d28d9' },
                        '&:disabled': { opacity: 0.6 },
                    }}
                >
                    Add Webhook
                </Button>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    px: 1.5,
                    height: '36px',
                    minWidth: '220px'
                }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <input
                        placeholder="Filter by keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%', color: darkMode ? '#f8fafc' : '#1e293b' }}
                    />
                </Box>

                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={requestDeleteSelected}
                    disabled={!hasSelection || saving || !workspaceId}
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: hasSelection ? (darkMode ? '#fca5a5' : '#dc2626') : (darkMode ? '#64748b' : '#64748b'),
                        backgroundColor: hasSelection ? (darkMode ? '#7f1d1d' : '#fee2e2') : 'transparent',
                        border: '1px solid',
                        borderColor: hasSelection ? (darkMode ? '#991b1b' : '#fecaca') : (darkMode ? '#334155' : '#e2e8f0'),
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: hasSelection ? (darkMode ? '#991b1b' : '#fecaca') : (darkMode ? '#1e293b' : '#f1f5f9') },
                        '&:disabled': { color: darkMode ? '#475569' : '#cbd5e1', borderColor: darkMode ? '#1e293b' : '#e2e8f0' },
                    }}
                >
                    Delete{selected.length ? ` (${selected.length})` : ''}
                </Button>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={28} sx={{ color: '#7c3aed' }} />
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
                        <WebhookTable
                            darkMode={darkMode}
                            webhooks={filteredWebhooks}
                            selected={selected}
                            onToggleSelect={toggleSelect}
                            onToggleSelectAll={toggleSelectAll}
                            onRowClick={openEditDrawer}
                            onToggleActive={toggleActive}
                        />
                    </Box>
                )}
            </Box>

            <Drawer
                open={drawerOpen}
                darkMode={darkMode}
                title={isEdit ? 'Edit Webhook' : 'Add Webhook'}
                onClose={closeDrawer}
                guideLink="https://example.com/docs/webhooks"
                primaryAction={{ label: isEdit ? 'Save' : 'Add Webhook', onClick: handleSaveWebhook, disabled: saving }}
                secondaryAction={{ label: 'Discard', onClick: closeDrawer }}
                extraFooterActions={
                    isEdit && (
                        <IconButton onClick={() => requestDeleteWebhook(draft.id)} size="small" title="Delete" sx={{ color: darkMode ? '#f87171' : '#dc2626' }} disabled={saving}>
                            <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    )
                }
            >
                <WebhookForm draft={draft} onChange={updateDraft} darkMode={darkMode} />
            </Drawer>

            <Dialog
                open={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px', p: 1, width: 320, bgcolor: darkMode ? '#0f172a' : '#ffffff', backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', fontSize: '1rem', pb: 1 }}>Delete Webhook</DialogTitle>
                <DialogContent sx={{ pb: 1.5 }}>
                    <DialogContentText sx={{ color: darkMode ? '#94a3b8' : '#475569', fontSize: '0.875rem', m: 0 }}>
                        Are you sure you want to delete this webhook? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 2, pb: 1.5, pt: 0 }}>
                    <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600, minWidth: 'auto', px: 1.5 }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteWebhook} variant="contained" color="error" sx={{ fontWeight: 600, borderRadius: '8px', textTransform: 'none', minWidth: 'auto', px: 1.5 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteSelectedConfirm}
                onClose={() => setDeleteSelectedConfirm(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px', p: 1, width: 320, bgcolor: darkMode ? '#0f172a' : '#ffffff', backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', fontSize: '1rem', pb: 1 }}>Delete Selected</DialogTitle>
                <DialogContent sx={{ pb: 1.5 }}>
                    <DialogContentText sx={{ color: darkMode ? '#94a3b8' : '#475569', fontSize: '0.875rem', m: 0 }}>
                        Are you sure you want to delete {selected.length} selected webhook{selected.length > 1 ? 's' : ''}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 2, pb: 1.5, pt: 0 }}>
                    <Button onClick={() => setDeleteSelectedConfirm(false)} sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600, minWidth: 'auto', px: 1.5 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSelected} variant="contained" color="error" sx={{ fontWeight: 600, borderRadius: '8px', textTransform: 'none', minWidth: 'auto', px: 1.5 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}