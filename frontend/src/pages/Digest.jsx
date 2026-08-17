import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Chip,
  Slider,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Snackbar,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../hooks/useAuth';
import APICallService from '../services/APICallService';

const MIN_WINDOW_HOURS = 24;
const MAX_WINDOW_HOURS = 24 * 7;
const WINDOW_STEP = 24;

const WINDOW_MARKS = [
  { value: 24, label: '1d' },
  { value: 72, label: '3d' },
  { value: 120, label: '5d' },
  { value: 168, label: '7d' },
];

const formatWindowLabel = (hours) => {
  if (hours % 24 === 0) {
    const days = hours / 24;
    return days === 1 ? '1 Day' : `${days} Days`;
  }
  return `${hours}h`;
};

const SOURCE_CONFIG = {
  Task: { icon: AssignmentTurnedInOutlinedIcon, color: '#7c3aed', bg: '#f3f0fe' },
  Chat: { icon: ForumOutlinedIcon, color: '#3b82f6', bg: '#eff6ff' },
  Webhook: { icon: LinkOutlinedIcon, color: '#0891b2', bg: '#ecfeff' },
};

export default function Digest() {
  const { activeWorkspace } = useAuth();
  const workspaceId = activeWorkspace?.workspaceId;

  const [generating, setGenerating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [windowHours, setWindowHours] = useState(MIN_WINDOW_HOURS);
  const [pendingWindowHours, setPendingWindowHours] = useState(MIN_WINDOW_HOURS); // slider drag value
  const [windowAnchor, setWindowAnchor] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [availableWebhooks, setAvailableWebhooks] = useState([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState('');
  const [loadingWebhooks, setLoadingWebhooks] = useState(false);
  const [noActivityYet, setNoActivityYet] = useState(false);

  // digestHistory: each entry is one persisted, non-overlapping digest, most recent first.
  const [digestHistory, setDigestHistory] = useState([]);

  const activeDigest = digestHistory[selectedIndex] || null;

  const buildPlainTextSummary = (digest) => {
    const groups = Array.isArray(digest?.groups) ? digest.groups : [];
    const sections = groups
      .map((g) => `${g.title}:\n${(g.items || []).map((i) => `- ${i}`).join('\n')}`)
      .join('\n\n');
    return `${sections}\n\nSuggested Focus:\n${digest?.focus || 'No focus identified.'}`;
  };

  const handleCopySummary = async () => {
    if (!activeDigest) return;
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary(activeDigest));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy digest summary', err);
    }
  };

  const buildDigestWebhookPayload = (digest) => ({
    windowHours,
    summary: buildPlainTextSummary(digest),
    digest,
  });

  const fetchAvailableWebhooks = useCallback(async () => {
    if (!workspaceId) return;
    setLoadingWebhooks(true);
    setError(null);
    try {
      const response = await APICallService.getWebhooks(workspaceId);
      const normalized = Array.isArray(response?.data?.data) ? response.data.data : [];
      const activeWebhooks = normalized.filter((webhook) => webhook?.active !== false);
      setAvailableWebhooks(activeWebhooks);
      setSelectedWebhookId((prev) => (activeWebhooks.some((webhook) => webhook.webhookId === prev) ? prev : activeWebhooks[0]?.webhookId || ''));
    } catch (err) {
      console.error('Failed to load webhooks for digest send:', err);
      setAvailableWebhooks([]);
      setSelectedWebhookId('');
      setError(err?.response?.data?.message || 'Unable to load webhooks');
    } finally {
      setLoadingWebhooks(false);
    }
  }, [workspaceId]);

  const handleOpenSendDialog = async () => {
    if (!activeDigest || !workspaceId) return;
    setSuccessOpen(false);
    setError(null);
    setSendDialogOpen(true);
    await fetchAvailableWebhooks();
  };

  const handleSendSummary = async () => {
    if (!activeDigest || !workspaceId || !selectedWebhookId) return;
    try {
      setSending(true);
      setError(null);

      const selectedWebhook = availableWebhooks.find(
        (webhook) => (webhook.webhookId || webhook.id) === selectedWebhookId
      );

      await APICallService.sendDigestToWebhook(
        workspaceId,
        selectedWebhookId,
        buildDigestWebhookPayload(activeDigest)
      );

      setSendDialogOpen(false);
      setSelectedWebhookId('');
      setSuccessMessage(`Digest sent successfully to ${selectedWebhook?.name || 'webhook'}.`);
      setSuccessOpen(true);
    } catch (err) {
      console.error('Failed to send digest summary:', err);
      setError(err?.response?.data?.message || 'Unable to send summary');
    } finally {
      setSending(false);
    }
  };

  const handleCloseSuccess = (_event, reason) => {
    if (reason === 'clickaway') return;
    setSuccessOpen(false);
  };

  // Pull persisted digest history from the DB.
  const fetchDigestHistory = useCallback(async () => {
    if (!workspaceId) return;
    setLoadingHistory(true);
    try {
      const response = await APICallService.getDigestHistory(workspaceId);
      const items = Array.isArray(response?.data?.data) ? response.data.data : [];
      setDigestHistory(items);
      setSelectedIndex(0);
      setNoActivityYet(items.length === 0);
    } catch (err) {
      console.error('Failed to load digest history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [workspaceId]);

  const fetchDigest = useCallback(async (hours) => {
    if (!workspaceId) return;
    setGenerating(true);
    setError(null);
    try {
      const response = await APICallService.getDigest(workspaceId, hours);
      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to generate digest');
      }

      await fetchDigestHistory();
      setNoActivityYet(!payload.data);
      setLastUpdated(payload.data ? 'Just now' : null);
    } catch (err) {
      console.error('Failed to fetch digest:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to generate digest');
    } finally {
      setGenerating(false);
    }
  }, [workspaceId, fetchDigestHistory]);

  useEffect(() => {
    if (workspaceId) {
      fetchDigest(windowHours);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleRegenerateSummary = () => {
    fetchDigest(windowHours);
  };

  const handleWindowCommit = (_e, value) => {
    setWindowHours(value);
    setPendingWindowHours(value);
    setWindowAnchor(null);
    fetchDigest(value);
  };

  const selectHistoryItem = (idx) => {
    setSelectedIndex(idx);
  };

  if (!workspaceId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '14px', color: '#64748b' }}>
          Select a workspace to view its AI digest.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 22, color: '#7c3aed' }} />
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>AI Digest</Typography>
          </Box>
          <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
            Your activity, summarized{lastUpdated ? ` · Updated ${lastUpdated}` : ''}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Lookback window selector (24h - 7d) */}
          <Button
            onClick={(e) => {
              setPendingWindowHours(windowHours);
              setWindowAnchor(e.currentTarget);
            }}
            endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              px: 1.5,
              height: '36px',
            }}
          >
            Lookback: {formatWindowLabel(windowHours)}
          </Button>
          <Popover
            open={Boolean(windowAnchor)}
            anchorEl={windowAnchor}
            onClose={() => setWindowAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 3, pt: 3, pb: 2, width: 260 }}>
              <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', mb: 1 }}>
                Summarize activity from the last {formatWindowLabel(pendingWindowHours)}
              </Typography>
              <Slider
                value={pendingWindowHours}
                min={MIN_WINDOW_HOURS}
                max={MAX_WINDOW_HOURS}
                step={WINDOW_STEP}
                marks={WINDOW_MARKS}
                onChange={(_e, value) => setPendingWindowHours(value)}
                onChangeCommitted={handleWindowCommit}
                sx={{ color: '#7c3aed' }}
              />
              <Typography sx={{ fontSize: '11px', color: '#94a3b8', mt: 1 }}>
                Minimum 1 day, maximum 7 days.
              </Typography>
            </Box>
          </Popover>

          <Button
            onClick={handleRegenerateSummary}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#7c3aed',
              borderRadius: '8px',
              height: '36px',
              '&:hover': { backgroundColor: '#6d28d9' },
              '&.Mui-disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' },
            }}
          >
            {generating ? 'Generating…' : 'Regenerate Summary'}
          </Button>
        </Box>
      </Box>

      {activeDigest && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <Button
            onClick={handleOpenSendDialog}
            disabled={sending}
            startIcon={sending ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SendIcon sx={{ fontSize: 16 }} />}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#7c3aed',
              borderRadius: '8px',
              height: '36px',
              px: 2,
              '&:hover': { backgroundColor: '#6d28d9' },
              '&:disabled': { opacity: 0.6 },
            }}
          >
            {sending ? 'Sending…' : 'Send Summary'}
          </Button>

          <Tooltip title={copied ? 'Copied!' : 'Copy summary'}>
            <Button
              onClick={handleCopySummary}
              startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: copied ? '#16a34a' : '#334155',
                backgroundColor: '#ffffff',
                border: '1px solid',
                borderColor: copied ? '#bbf7d0' : '#e2e8f0',
                borderRadius: '8px',
                height: '36px',
                px: 2,
                '&:hover': { backgroundColor: copied ? '#f0fdf4' : '#f8fafc' },
              }}
            >
              {copied ? 'Copied' : 'Copy Summary'}
            </Button>
          </Tooltip>
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <Typography sx={{ fontSize: '12.5px', color: '#dc2626' }}>{error}</Typography>
        </Box>
      )}

      {/* Success toast */}
      <Snackbar
        open={successOpen}
        onClose={handleCloseSuccess}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            backgroundColor: '#16a34a',
            color: '#ffffff',
            borderRadius: '10px',
            px: 2.5,
            py: 1.5,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {successMessage}
          </Typography>
          <IconButton size="small" onClick={handleCloseSuccess} sx={{ color: '#ffffff', ml: 0.5, p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      </Snackbar>

      <Dialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', backgroundColor: '#ffffff' }}>
          Send digest to a webhook
        </DialogTitle>
        <DialogContent sx={{ pt: 1, backgroundColor: '#ffffff' }}>
          <Typography sx={{ fontSize: '13px', color: '#475569', mb: 1.5 }}>
            Select the webhook channel that should receive the current AI summary.
          </Typography>
          {loadingWebhooks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={22} sx={{ color: '#7c3aed' }} />
            </Box>
          ) : availableWebhooks.length === 0 ? (
            <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                No active webhooks are available in this workspace yet.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, maxHeight: 320, overflowY: 'auto' }}>
              {availableWebhooks.map((webhook, index) => (
                <Box key={webhook.webhookId || webhook.id || index}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedWebhookId === (webhook.webhookId || webhook.id)}
                      onClick={() => setSelectedWebhookId(webhook.webhookId || webhook.id)}
                      sx={{ borderRadius: '8px', px: 1.25, py: 0.75 }}
                    >
                      <ListItemText
                        primary={webhook.name || 'Untitled webhook'}
                        secondary={webhook.url || 'Webhook URL'}
                        primaryTypographyProps={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}
                        secondaryTypographyProps={{ fontSize: '11.5px', color: '#64748b', mt: 0.25 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < availableWebhooks.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, backgroundColor: '#ffffff' }}>
          <Button onClick={() => setSendDialogOpen(false)} sx={{ textTransform: 'none', color: '#475569' }}>Cancel</Button>
          <Button
            onClick={handleSendSummary}
            variant="contained"
            disabled={sending || !selectedWebhookId || loadingWebhooks || availableWebhooks.length === 0}
            startIcon={sending ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SendIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none', backgroundColor: '#7c3aed', borderRadius: '8px', '&:hover': { backgroundColor: '#6d28d9' } }}
          >
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {generating && digestHistory.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} sx={{ color: '#7c3aed' }} />
        </Box>
      ) : noActivityYet && !activeDigest ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <InfoOutlinedIcon sx={{ fontSize: 26, color: '#94a3b8', mb: 1 }} />
          <Typography sx={{ fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>
            No activity to summarize yet
          </Typography>
          <Typography sx={{ fontSize: '12.5px', color: '#94a3b8', mt: 0.5 }}>
            Once there's some activity in this workspace, a digest will appear here automatically.
          </Typography>
        </Box>
      ) : !activeDigest ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>
            No digest yet.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Grouped digest sections */}
          <Box
            sx={{
              flex: 1,
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: 'calc(100vh - 260px)',
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {(!Array.isArray(activeDigest.groups) || activeDigest.groups.length === 0) ? (
              <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', p: 3, backgroundColor: '#ffffff', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>No activity in this period.</Typography>
              </Box>
            ) : (
              activeDigest.groups.map((group) => {
                const cfg = SOURCE_CONFIG[group.source] || SOURCE_CONFIG.Task;
                const Icon = cfg.icon;
                return (
                  <Box key={group.title} sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', p: 2.5, backgroundColor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '6px',
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 15 }} />
                      </Box>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{group.title}</Typography>
                      <Chip
                        label={group.source}
                        size="small"
                        sx={{ height: '18px', fontSize: '10.5px', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color, ml: 0.5 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
                      {group.items.map((line, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <AutoAwesomeIcon sx={{ fontSize: 13, color: cfg.color, mt: '3px', flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>{line}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })
            )}

            {/* Suggested focus */}
            <Box
              sx={{
                borderRadius: '10px',
                p: 2.5,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
              }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', opacity: 0.85, mb: 1 }}>
                Suggested Focus
              </Typography>
              <Typography sx={{ fontSize: '14.5px', lineHeight: 1.6 }}>
                {activeDigest.focus || 'No focus identified for this period.'}
              </Typography>
            </Box>
          </Box>

          {/* Digest history sidebar — persisted, distinct, non-overlapping entries */}
          <Box
            sx={{
              width: '260px',
              flexShrink: 0,
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              maxHeight: 'calc(100vh - 260px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              onClick={() => setHistoryOpen((v) => !v)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.75, cursor: 'pointer', borderBottom: historyOpen ? '1px solid #e5e7eb' : 'none', flexShrink: 0 }}
            >
              <HistoryIcon sx={{ fontSize: 17, color: '#64748b' }} />
              <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Digest History</Typography>
              <Box sx={{ flex: 1 }} />
              {loadingHistory && <CircularProgress size={13} sx={{ color: '#94a3b8' }} />}
              <ChevronRightIcon
                sx={{ fontSize: 18, color: '#94a3b8', transform: historyOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
              />
            </Box>
            {historyOpen && (
              <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {digestHistory.length === 0 ? (
                  <Box sx={{ px: 2, py: 2 }}>
                    <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>No digests yet.</Typography>
                  </Box>
                ) : (
                  digestHistory.map((h, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <Box
                        key={h._id || i}
                        onClick={() => selectHistoryItem(i)}
                        sx={{
                          px: 2,
                          py: 1.25,
                          borderBottom: i === digestHistory.length - 1 ? 'none' : '1px solid #f1f5f9',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#f5f3ff' : 'transparent',
                          borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent',
                          '&:hover': { backgroundColor: isSelected ? '#f5f3ff' : '#f8fafc' },
                        }}
                      >
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#7c3aed' : '#1e293b' }}>
                          {h.label}
                        </Typography>
                        <Typography sx={{ fontSize: '11.5px', color: '#94a3b8', mt: '2px' }}>
                          {formatWindowLabel(h.windowHours)} window · {h.activityCount ?? 0} update{(h.activityCount ?? 0) === 1 ? '' : 's'}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}