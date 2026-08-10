
import { useState } from 'react';
import { Box, Typography, Chip, Button, TextField, Select, FormControl, MenuItem, Collapse } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const EVENT_OPTIONS = [
    'task.created',
    'task.updated',
    'task.deleted',
    'task.archived',
    'note.created',
    'chat.message',
];

/**
 * Controlled form for adding/editing a webhook.
 * This is pure body content — no drawer chrome, no footer buttons.
 * It's meant to be rendered as children of <Drawer />, with the
 * parent page owning the `draft` state and passing it down.
 *
 * Props:
 * - draft: { name, url, event, headers, active, id? }
 * - onChange: (field, value) => void
 */
export default function WebhookForm({ draft, onChange }) {
    const [headersOpen, setHeadersOpen] = useState(false);
    const [headerKey, setHeaderKey] = useState('');
    const [headerValue, setHeaderValue] = useState('');

    const addHeader = () => {
        if (!headerKey.trim()) return;
        onChange('headers', [...(draft.headers || []), { key: headerKey.trim(), value: headerValue.trim() }]);
        setHeaderKey('');
        setHeaderValue('');
    };

    const removeHeader = (idx) => onChange('headers', draft.headers.filter((_, i) => i !== idx));

    return (
        <>
            <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>Name</Typography>
                <TextField
                    placeholder="Enter Webhook Name"
                    value={draft.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    fullWidth
                    size="small"
                />
            </Box>

            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Webhook URL</Typography>
                    <HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                </Box>
                <TextField
                    placeholder="https://"
                    value={draft.url}
                    onChange={(e) => onChange('url', e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                />
                <Typography sx={{ fontSize: '12px', color: '#94a3b8', mt: 0.75 }}>
                    Enter the URL where your webhook should send data
                </Typography>
            </Box>

            {/* HTTP Headers (collapsible) */}
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <Box
                    onClick={() => setHeadersOpen((v) => !v)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1.25,
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc',
                    }}
                >
                    <ChevronRightIcon
                        sx={{
                            fontSize: 18,
                            color: '#64748b',
                            transform: headersOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease',
                        }}
                    />
                    <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>HTTP Headers</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>Optional</Typography>
                    <HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                </Box>
                <Collapse in={headersOpen}>
                    <Box sx={{ px: 1.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {(draft.headers || []).map((h, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={`${h.key}: ${h.value}`}
                                    size="small"
                                    onDelete={() => removeHeader(idx)}
                                    sx={{ fontSize: '12px', maxWidth: '100%' }}
                                />
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                placeholder="Header key"
                                value={headerKey}
                                onChange={(e) => setHeaderKey(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                placeholder="Value"
                                value={headerValue}
                                onChange={(e) => setHeaderValue(e.target.value)}
                                size="small"
                                fullWidth
                            />
                            <Button
                                onClick={addHeader}
                                sx={{ textTransform: 'none', fontSize: '12.5px', fontWeight: 600, flexShrink: 0 }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>Event to Send</Typography>
                <FormControl fullWidth size="small">
                    <Select
                        displayEmpty
                        value={draft.event}
                        onChange={(e) => onChange('event', e.target.value)}
                        renderValue={(val) => val || <Typography sx={{ fontSize: '13.5px', color: '#94a3b8' }}>Select</Typography>}
                    >
                        {EVENT_OPTIONS.map((ev) => (
                            <MenuItem key={ev} value={ev}>{ev}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography sx={{ fontSize: '12px', color: '#94a3b8', mt: 0.75 }}>
                    Select the events that should trigger your webhook
                </Typography>
            </Box>
        </>
    );
}

export { EVENT_OPTIONS };