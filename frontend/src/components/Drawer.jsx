import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Drawer as MuiDrawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

// 1. Import settings utility
import { getAppSettings } from '../utils/preferences';

/**
 * Generic side Drawer shell.
 * Handles: header (title + optional guide link + close), scrollable body, footer actions.
 */
export default function Drawer({
    open,
    title,
    onClose,
    width = 460,
    guideLink,
    primaryAction,
    secondaryAction,
    extraFooterActions,
    children,
    darkMode: darkModeProp, // Optional prop override
}) {
    // 2. Track dark mode state from global settings & events
    const [darkModeState, setDarkModeState] = useState(() => getAppSettings().darkMode);

    useEffect(() => {
        const handleSettingsChange = (event) => {
            const nextSettings = event.detail ?? getAppSettings();
            setDarkModeState(Boolean(nextSettings.darkMode));
        };

        window.addEventListener('tobedone-settings-changed', handleSettingsChange);
        return () => window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
    }, []);

    // Use prop if explicitly passed, otherwise use state
    const darkMode = darkModeProp !== undefined ? darkModeProp : darkModeState;

    return (
        <MuiDrawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    color: darkMode ? '#f8fafc' : '#1e293b',
                },
            }}
        >
            <Box
                sx={{
                    width,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2.5,
                        py: 2,
                        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    }}
                >
                    <IconButton size="small" onClick={onClose} sx={{ color: darkMode ? '#94a3b8' : 'inherit' }}>
                        <ChevronRightIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b' }}>
                        {title}
                    </Typography>

                    {guideLink && (
                        <Button
                            size="small"
                            href={guideLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<MenuBookOutlinedIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                ml: 'auto',
                                textTransform: 'none',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                color: darkMode ? '#cbd5e1' : '#475569',
                                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                                backgroundColor: darkMode ? '#1e293b' : 'transparent',
                                borderRadius: '999px',
                                px: 1.5,
                                '&:hover': {
                                    backgroundColor: darkMode ? '#334155' : '#f1f5f9',
                                },
                            }}
                        >
                            View setup guide
                        </Button>
                    )}

                    <IconButton size="small" onClick={onClose} sx={{ ml: guideLink ? 0 : 'auto', color: darkMode ? '#94a3b8' : 'inherit' }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {children}
                </Box>

                {/* Footer */}
                {(primaryAction || secondaryAction || extraFooterActions) && (
                    <Box
                        sx={{
                            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                            px: 2.5,
                            py: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {primaryAction && (
                            <Button
                                onClick={primaryAction.onClick}
                                disabled={primaryAction.disabled}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    backgroundColor: '#7c3aed',
                                    '&:hover': { backgroundColor: '#6d28d9' },
                                    '&:disabled': {
                                        backgroundColor: darkMode ? '#334155' : undefined,
                                        color: darkMode ? '#64748b' : undefined,
                                    },
                                }}
                            >
                                {primaryAction.label}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button
                                onClick={secondaryAction.onClick}
                                sx={{
                                    textTransform: 'none',
                                    color: darkMode ? '#94a3b8' : '#64748b',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                                    },
                                }}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                        {extraFooterActions && (
                            <>
                                <Box sx={{ flex: 1 }} />
                                {extraFooterActions}
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </MuiDrawer>
    );
}