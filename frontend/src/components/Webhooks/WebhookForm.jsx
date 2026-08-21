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
 * - darkMode: boolean
 */
export default function WebhookForm({ draft, onChange, darkMode }) {
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

    // Shared MenuProps for Select dropdowns
    const darkMenuProps = {
        PaperProps: {
            sx: {
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                color: darkMode ? '#f8fafc' : '#1e293b',
                border: darkMode ? '1px solid #334155' : 'none'
            }
        }
    };

    // Style for Select component
    const selectSx = {
        backgroundColor: darkMode ? '#0f172a' : '#fff',
        color: darkMode ? '#f8fafc' : 'inherit',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#334155' : '#e2e8f0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#475569' : '#cbd5e1',
        },
        '& .MuiSvgIcon-root': {
            color: darkMode ? '#94a3b8' : undefined,
        }
    };

    // Style for TextField components
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: darkMode ? '#0f172a' : '#fff',
            '& fieldset': {
                borderColor: darkMode ? '#334155' : '#e2e8f0',
            },
            '&:hover fieldset': {
                borderColor: darkMode ? '#475569' : '#cbd5e1',
            },
        },
        '& .MuiInputBase-input': {
            color: darkMode ? '#f8fafc' : '#1e293b',
            '&::placeholder': {
                color: darkMode ? '#64748b' : '#94a3b8',
                opacity: 1,
            }
        }
    };

    return (
        <>
            <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#cbd5e1' : '#334155', mb: 0.75 }}>Name</Typography>
                <TextField
                    placeholder="Enter Webhook Name"
                    value={draft.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                />
            </Box>

            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#cbd5e1' : '#334155' }}>Webhook URL</Typography>
                    <HelpOutlineIcon sx={{ fontSize: 14, color: darkMode ? '#64748b' : '#94a3b8' }} />
                </Box>
                <TextField
                    placeholder="https://"
                    value={draft.url}
                    onChange={(e) => onChange('url', e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    sx={textFieldSx}
                />
                <Typography sx={{ fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8', mt: 0.75 }}>
                    Enter the URL where your webhook should send data
                </Typography>
            </Box>

            {/* HTTP Headers (collapsible) */}
            <Box sx={{ border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', overflow: 'hidden' }}>
                <Box
                    onClick={() => setHeadersOpen((v) => !v)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1.25,
                        cursor: 'pointer',
                        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                        '&:hover': {
                            backgroundColor: darkMode ? '#334155' : '#f1f5f9'
                        }
                    }}
                >
                    <ChevronRightIcon
                        sx={{
                            fontSize: 18,
                            color: darkMode ? '#94a3b8' : '#64748b',
                            transform: headersOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease',
                        }}
                    />
                    <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: darkMode ? '#f8fafc' : '#1e293b' }}>HTTP Headers</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8' }}>Optional</Typography>
                    <HelpOutlineIcon sx={{ fontSize: 14, color: darkMode ? '#64748b' : '#94a3b8' }} />
                </Box>
                <Collapse in={headersOpen}>
                    <Box sx={{ px: 1.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: darkMode ? '#0f172a' : 'transparent' }}>
                        {(draft.headers || []).map((h, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={`${h.key}: ${h.value}`}
                                    size="small"
                                    onDelete={() => removeHeader(idx)}
                                    sx={{
                                        fontSize: '12px',
                                        maxWidth: '100%',
                                        backgroundColor: darkMode ? '#334155' : '#f1f5f9',
                                        color: darkMode ? '#e2e8f0' : '#475569',
                                        '& .MuiChip-deleteIcon': {
                                            color: darkMode ? '#94a3b8' : undefined,
                                            '&:hover': { color: darkMode ? '#f87171' : undefined }
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', gap: 1, mt: (draft.headers?.length ? 1 : 0) }}>
                            <TextField
                                placeholder="Header key"
                                value={headerKey}
                                onChange={(e) => setHeaderKey(e.target.value)}
                                size="small"
                                fullWidth
                                sx={textFieldSx}
                            />
                            <TextField
                                placeholder="Value"
                                value={headerValue}
                                onChange={(e) => setHeaderValue(e.target.value)}
                                size="small"
                                fullWidth
                                sx={textFieldSx}
                            />
                            <Button
                                onClick={addHeader}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    flexShrink: 0,
                                    color: darkMode ? '#a78bfa' : '#7c3aed'
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#cbd5e1' : '#334155', mb: 0.75 }}>Event to Send</Typography>
                <FormControl fullWidth size="small">
                    <Select
                        displayEmpty
                        value={draft.event}
                        onChange={(e) => onChange('event', e.target.value)}
                        sx={{ fontSize: '13px', ...selectSx }}
                        MenuProps={darkMenuProps}
                        renderValue={(val) => val || <Typography sx={{ fontSize: '13.5px', color: darkMode ? '#64748b' : '#94a3b8' }}>Select</Typography>}
                    >
                        {EVENT_OPTIONS.map((ev) => (
                            <MenuItem
                                key={ev}
                                value={ev}
                                sx={{ '&:hover': { backgroundColor: darkMode ? '#334155' : undefined } }}
                            >
                                {ev}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography sx={{ fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8', mt: 0.75 }}>
                    Select the events that should trigger your webhook
                </Typography>
            </Box>
        </>
    );
}

export { EVENT_OPTIONS };