
import { Box, Typography, IconButton, Button, Drawer as MuiDrawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

/**
 * Generic side Drawer shell.
 * Handles: header (title + optional guide link + close), scrollable body, footer actions.
 * Content is passed in as children — this component knows nothing about
 * webhooks, tasks, notes, etc. Reuse it anywhere you need a right-side panel.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - onClose: () => void
 * - width: number (optional, default 460)
 * - guideLink: string (optional) - if provided, shows a "View setup guide" button that opens this URL
 * - primaryAction: { label, onClick, disabled? } (optional) - main footer button
 * - secondaryAction: { label, onClick } (optional) - e.g. "Discard"
 * - extraFooterActions: ReactNode (optional) - e.g. a delete icon button, right-aligned
 * - children: form/body content
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
}) {
    return (
        <MuiDrawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 2, borderBottom: '1px solid #e2e8f0' }}>
                    <IconButton size="small" onClick={onClose}>
                        <ChevronRightIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
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
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '999px',
                                px: 1.5,
                            }}
                        >
                            View setup guide
                        </Button>
                    )}

                    <IconButton size="small" onClick={onClose} sx={{ ml: guideLink ? 0 : 'auto' }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {children}
                </Box>

                {/* Footer */}
                {(primaryAction || secondaryAction || extraFooterActions) && (
                    <Box sx={{ borderTop: '1px solid #e2e8f0', px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {primaryAction && (
                            <Button
                                onClick={primaryAction.onClick}
                                disabled={primaryAction.disabled}
                                variant="contained"
                                sx={{ textTransform: 'none', backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
                            >
                                {primaryAction.label}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button onClick={secondaryAction.onClick} sx={{ textTransform: 'none', color: '#64748b' }}>
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