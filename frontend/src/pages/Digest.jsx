import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, CircularProgress, Button, Chip, Menu, MenuItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../hooks/useAuth';
import APICallService from '../services/APICallService';

const PERIODS = [
  { label: 'Last 24h', value: '24h' },
  { label: 'This Week', value: 'week' },
];

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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [period, setPeriod] = useState('24h');
  const [periodAnchor, setPeriodAnchor] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // digestHistory: each entry is one generated digest, most recent first.
  // No backend "history" endpoint exists yet — this is built client-side
  // as digests get generated during this session.
  const [digestHistory, setDigestHistory] = useState([]);

  const periodLabel = PERIODS.find((p) => p.value === period)?.label || 'Last 24h';
  const activeDigest = digestHistory[selectedIndex] || null;

  const buildPlainTextSummary = (digest) => {
    const sections = digest.groups
      .map((g) => `${g.title}:\n${g.items.map((i) => `- ${i}`).join('\n')}`)
      .join('\n\n');
    return `${sections}\n\nSuggested Focus:\n${digest.focus}`;
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

  const fetchDigest = useCallback(async (selectedPeriod) => {
    if (!workspaceId) return;
    setGenerating(true);
    setError(null);
    try {
      const response = await APICallService.getDigest(workspaceId, selectedPeriod);
      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to generate digest');
      }

      const digest = payload.data; // { label, period, groups, focus }
      setDigestHistory((prev) => [digest, ...prev]);
      setSelectedIndex(0);
      setLastUpdated('Just now');
    } catch (err) {
      console.error('Failed to fetch digest:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to generate digest');
    } finally {
      setGenerating(false);
    }
  }, [workspaceId]);

  // Generate an initial digest as soon as we have a workspace
  useEffect(() => {
    if (workspaceId && digestHistory.length === 0) {
      fetchDigest(period);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleRegenerateSummary = () => {
    fetchDigest(period);
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    setPeriodAnchor(null);
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
    <Box sx={{ p: 3, maxWidth: '100%' }}>
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
          {/* Period selector */}
          <Button
            onClick={(e) => setPeriodAnchor(e.currentTarget)}
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
            {periodLabel}
          </Button>
          <Menu anchorEl={periodAnchor} open={Boolean(periodAnchor)} onClose={() => setPeriodAnchor(null)}>
            {PERIODS.map((p) => (
              <MenuItem
                key={p.value}
                selected={p.value === period}
                onClick={() => handlePeriodChange(p.value)}
                sx={{ fontSize: '13px' }}
              >
                {p.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Regenerate AI summary */}
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
            }}
          >
            {generating ? 'Generating…' : 'Regenerate Summary'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <Typography sx={{ fontSize: '12.5px', color: '#dc2626' }}>{error}</Typography>
        </Box>
      )}

      {generating && digestHistory.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} sx={{ color: '#7c3aed' }} />
        </Box>
      ) : !activeDigest ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>
            No digest yet — click "Regenerate Summary" to generate one.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Grouped digest sections */}
          <Box sx={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title={copied ? 'Copied!' : 'Copy summary'}>
                <Button
                  onClick={handleCopySummary}
                  startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: copied ? '#16a34a' : '#64748b',
                    backgroundColor: copied ? '#f0fdf4' : '#f8fafc',
                    border: '1px solid',
                    borderColor: copied ? '#bbf7d0' : '#e2e8f0',
                    borderRadius: '8px',
                    height: '30px',
                    '&:hover': { backgroundColor: copied ? '#f0fdf4' : '#f1f5f9' },
                  }}
                >
                  {copied ? 'Copied' : 'Copy Summary'}
                </Button>
              </Tooltip>
            </Box>

            {activeDigest.groups.length === 0 ? (
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
                {activeDigest.focus}
              </Typography>
            </Box>
          </Box>

          {/* Digest history sidebar (session-only, no backend history endpoint) */}
          <Box sx={{ width: '260px', flexShrink: 0, border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <Box
              onClick={() => setHistoryOpen((v) => !v)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.75, cursor: 'pointer', borderBottom: historyOpen ? '1px solid #e5e7eb' : 'none' }}
            >
              <HistoryIcon sx={{ fontSize: 17, color: '#64748b' }} />
              <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Digest History</Typography>
              <Box sx={{ flex: 1 }} />
              <ChevronRightIcon
                sx={{ fontSize: 18, color: '#94a3b8', transform: historyOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
              />
            </Box>
            {historyOpen && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {digestHistory.length === 0 ? (
                  <Box sx={{ px: 2, py: 2 }}>
                    <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>No digests yet this session.</Typography>
                  </Box>
                ) : (
                  digestHistory.map((h, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <Box
                        key={i}
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
                        <Typography sx={{ fontSize: '11.5px', color: '#94a3b8', mt: '2px' }}>{h.period}</Typography>
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