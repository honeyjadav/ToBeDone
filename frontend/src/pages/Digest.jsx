import { useState } from 'react';
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
import TagIcon from '@mui/icons-material/Tag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';

const PERIODS = ['Last 24h', 'This Week', 'Custom Range'];

const stats = [
  { label: 'Tasks Completed', value: 12, icon: <TaskAltIcon sx={{ fontSize: 20 }} />, color: '#22c55e' },
  { label: 'Unread Messages', value: 7, icon: <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />, color: '#3b82f6' },
  { label: 'Upcoming Deadlines', value: 3, icon: <EventOutlinedIcon sx={{ fontSize: 20 }} />, color: '#f59e0b' },
  { label: 'New Notes', value: 4, icon: <StickyNote2OutlinedIcon sx={{ fontSize: 20 }} />, color: '#7c3aed' },
];

// Grouped, source-tagged digest content
const SOURCE_CONFIG = {
  Task: { icon: AssignmentTurnedInOutlinedIcon, color: '#7c3aed', bg: '#f3f0fe' },
  Chat: { icon: ForumOutlinedIcon, color: '#3b82f6', bg: '#eff6ff' },
  Webhook: { icon: LinkOutlinedIcon, color: '#0891b2', bg: '#ecfeff' },
};

// Each history entry now carries its OWN digest snapshot (groups + focus text)
// so clicking a history item can actually load different content.
const digestHistory = [
  {
    label: 'Today, 9:00 AM',
    period: 'Last 24h',
    sentToSlack: true,
    groups: [
      {
        title: 'Tasks',
        source: 'Task',
        items: [
          'You completed 12 tasks this week, 20% more than last week.',
          'The "Fix sidebar overlap" task in review has been pending for 2 days — consider following up.',
          'You have a deadline for "Integrate AI digest summary" in 3 days.',
        ],
      },
      {
        title: 'Team Activity',
        source: 'Chat',
        items: [
          'Aisha Khan sent 2 new messages that are still unread.',
          'Ravi Sharma joined the #frontend channel discussion.',
        ],
      },
      {
        title: 'Integrations',
        source: 'Webhook',
        items: [
          '3 Slack notifications were sent for task status updates.',
          'CI Pipeline Trigger webhook fired once after "Build sticky notes feature" moved to In Progress.',
        ],
      },
    ],
    focus: 'Prioritize wrapping up the "Fix sidebar overlap" review — it\'s been sitting the longest and is blocking two other tasks. Clearing it first will unblock your team\'s momentum for the rest of the week.',
  },
  {
    label: 'Yesterday, 6:00 PM',
    period: 'This Week',
    sentToSlack: true,
    groups: [
      {
        title: 'Tasks',
        source: 'Task',
        items: [
          '5 tasks moved to Done yesterday evening.',
          '"Design analytics dashboard" is now In Progress.',
        ],
      },
      {
        title: 'Team Activity',
        source: 'Chat',
        items: ['Priya Nair asked a question in #general that hasn\'t been answered yet.'],
      },
    ],
    focus: 'Reply to Priya\'s open question in #general — it\'s been unanswered for over 12 hours and may be blocking her work.',
  },
  {
    label: 'Yesterday, 9:00 AM',
    period: 'Last 24h',
    sentToSlack: false,
    groups: [
      {
        title: 'Integrations',
        source: 'Webhook',
        items: ['Analytics Sync webhook is currently inactive — no data has synced in 24h.'],
      },
    ],
    focus: 'Consider re-enabling the Analytics Sync webhook so your dashboard reflects up-to-date numbers.',
  },
  {
    label: '2 days ago, 6:00 PM',
    period: 'This Week',
    sentToSlack: true,
    groups: [
      {
        title: 'Tasks',
        source: 'Task',
        items: ['8 tasks completed this period, on track with weekly goal.'],
      },
    ],
    focus: 'Good pace this week — no urgent blockers. Keep an eye on upcoming deadlines in the next 3 days.',
  },
];

export default function Digest() {
  const [loadingData, setLoadingData] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sendingToSlack, setSendingToSlack] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [period, setPeriod] = useState('Last 24h');
  const [periodAnchor, setPeriodAnchor] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slackStatus, setSlackStatus] = useState(digestHistory[0].sentToSlack ? 'Today, 9:02 AM' : null);
  const [copied, setCopied] = useState(false);

  const activeDigest = digestHistory[selectedIndex];

  const buildPlainTextSummary = (digest) => {
    const sections = digest.groups
      .map((g) => `${g.title}:\n${g.items.map((i) => `- ${i}`).join('\n')}`)
      .join('\n\n');
    return `${sections}\n\nSuggested Focus:\n${digest.focus}`;
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary(activeDigest));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy digest summary', err);
    }
  };

  const handleRefreshData = () => {
    setLoadingData(true);
    setTimeout(() => {
      setLoadingData(false);
      setLastUpdated('Just now');
    }, 900);
  };

  const handleRegenerateSummary = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setLastUpdated('Just now');
      setSlackStatus(null); // regenerated content hasn't been sent yet
    }, 1400);
  };

  const handleSendToSlack = () => {
    setSendingToSlack(true);
    setTimeout(() => {
      setSendingToSlack(false);
      setSlackStatus('Just now');
    }, 1000);
  };

  const selectHistoryItem = (idx) => {
    setSelectedIndex(idx);
    setPeriod(digestHistory[idx].period);
    setSlackStatus(digestHistory[idx].sentToSlack ? digestHistory[idx].label : null);
  };

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
            Your activity, summarized · Updated {lastUpdated}
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
            {period}
          </Button>
          <Menu anchorEl={periodAnchor} open={Boolean(periodAnchor)} onClose={() => setPeriodAnchor(null)}>
            {PERIODS.map((p) => (
              <MenuItem
                key={p}
                selected={p === period}
                onClick={() => { setPeriod(p); setPeriodAnchor(null); }}
                sx={{ fontSize: '13px' }}
              >
                {p}
              </MenuItem>
            ))}
          </Menu>

          {/* Refresh raw data */}
          <IconButton
            onClick={handleRefreshData}
            disabled={loadingData}
            title="Refresh activity data"
            sx={{ border: '1px solid #e5e7eb', borderRadius: '8px', width: 36, height: 36 }}
          >
            {loadingData ? <CircularProgress size={16} sx={{ color: '#7c3aed' }} /> : <RefreshIcon sx={{ fontSize: 18, color: '#64748b' }} />}
          </IconButton>

          {/* Send to Slack */}
          <Button
            onClick={handleSendToSlack}
            disabled={sendingToSlack}
            startIcon={sendingToSlack ? <CircularProgress size={14} sx={{ color: '#0891b2' }} /> : <TagIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0891b2',
              backgroundColor: '#ecfeff',
              border: '1px solid #a5f3fc',
              borderRadius: '8px',
              height: '36px',
              '&:hover': { backgroundColor: '#cffafe' },
            }}
          >
            {sendingToSlack ? 'Sending…' : 'Send to Slack'}
          </Button>

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

      {/* Slack delivery status */}
      {slackStatus && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2.5 }}>
          <CheckCircleIcon sx={{ fontSize: 15, color: '#0891b2' }} />
          <Typography sx={{ fontSize: '12.5px', color: '#0891b2', fontWeight: 600 }}>
            Sent to Slack · {slackStatus}
          </Typography>
        </Box>
      )}

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 2, mb: 3 }}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', p: 2, backgroundColor: '#ffffff' }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: `${stat.color}18`,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              {stat.icon}
            </Box>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{stat.value}</Typography>
            <Typography sx={{ fontSize: '12.5px', color: '#64748b' }}>{stat.label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Grouped digest sections — driven by the selected history entry */}
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
          {activeDigest.groups.map((group) => {
            const cfg = SOURCE_CONFIG[group.source];
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
          })}

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

        {/* Digest history sidebar */}
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
              {digestHistory.map((h, i) => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#7c3aed' : '#1e293b' }}>
                        {h.label}
                      </Typography>
                      {h.sentToSlack && <TagIcon sx={{ fontSize: 12, color: '#0891b2' }} />}
                    </Box>
                    <Typography sx={{ fontSize: '11.5px', color: '#94a3b8', mt: '2px' }}>{h.period}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}