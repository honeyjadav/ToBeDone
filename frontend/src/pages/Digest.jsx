import { useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';

const stats = [
  { label: 'Tasks Completed', value: 12, icon: <TaskAltIcon sx={{ fontSize: 20 }} />, color: '#22c55e' },
  { label: 'Unread Messages', value: 7, icon: <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />, color: '#3b82f6' },
  { label: 'Upcoming Deadlines', value: 3, icon: <EventOutlinedIcon sx={{ fontSize: 20 }} />, color: '#f59e0b' },
  { label: 'New Notes', value: 4, icon: <StickyNote2OutlinedIcon sx={{ fontSize: 20 }} />, color: '#7c3aed' },
];

const highlights = [
  'You completed 12 tasks this week, 20% more than last week.',
  'The "Fix sidebar overlap" task in review has been pending for 2 days \u2014 consider following up.',
  'Aisha Khan sent 2 new messages that are still unread.',
  'You have a deadline for "Integrate AI digest summary" in 3 days.',
];

export default function Digest() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastUpdated('Just now');
    }, 1200);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 22, color: '#7c3aed' }} />
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>AI Digest</Typography>
          </Box>
          <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
            Your day at a glance \u00b7 Updated {lastUpdated}
          </Typography>
        </Box>
        <IconButton
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            width: 36,
            height: 36,
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: '#7c3aed' }} /> : <RefreshIcon sx={{ fontSize: 18, color: '#64748b' }} />}
        </IconButton>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 2, mb: 3 }}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              p: 2,
              backgroundColor: '#ffffff',
            }}
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

      {/* Highlights */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', p: 2.5, backgroundColor: '#ffffff', mb: 2.5 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
          Today's Highlights
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {highlights.map((line, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: '#7c3aed', mt: '3px', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>{line}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

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
          Prioritize wrapping up the "Fix sidebar overlap" review \u2014 it's been sitting the longest and is
          blocking two other tasks. Clearing it first will unblock your team's momentum for the rest of the week.
        </Typography>
      </Box>
    </Box>
  );
}