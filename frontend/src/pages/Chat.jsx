import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  InputAdornment,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const channels = [
  { id: 1, name: 'General', members: 12, unread: 0 },
  { id: 2, name: 'Design', members: 5, unread: 3 },
  { id: 3, name: 'Engineering', members: 8, unread: 1 },
  { id: 4, name: 'Marketing', members: 6, unread: 0 },
];

const messages = [
  { id: 1, user: 'Alice Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', message: 'Hey everyone! How is the Q3 launch going?', timestamp: '10:30 AM', isOwn: false },
  { id: 2, user: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', message: 'Going great! We are on track for the deadline.', timestamp: '10:32 AM', isOwn: true },
  { id: 3, user: 'Bob Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', message: 'The API integration is almost complete. Should be done by EOD.', timestamp: '10:35 AM', isOwn: false },
  { id: 4, user: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', message: 'Perfect! Let me know when you need QA.', timestamp: '10:36 AM', isOwn: true },
  { id: 5, user: 'Carol Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol', message: 'UI components are ready for testing 🎉', timestamp: '10:40 AM', isOwn: false },
];

export default function Chat() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Team Chat
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          Real-time communication with your team
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Channels Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 0 }}>
              <TextField
                placeholder="Search channels..."
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2, fontSize: '0.9rem' }}>
                CHANNELS
              </Typography>
            </CardContent>

            <Stack sx={{ flex: 1, px: 2, py: 1, overflowY: 'auto' }}>
              {channels.map((channel) => (
                <Box
                  key={channel.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: channel.id === 1 ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                    color: channel.id === 1 ? '#7c3aed' : '#64748b',
                    '&:hover': {
                      backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      # {channel.name}
                    </Typography>
                    {channel.unread > 0 && (
                      <Chip
                        label={channel.unread}
                        size="small"
                        sx={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          height: 20,
                        }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                    {channel.members} members
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={9}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <CardContent sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                    # General
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                    12 members online
                  </Typography>
                </Box>
                <Button variant="outlined" size="small">
                  + Add Members
                </Button>
              </Box>
            </CardContent>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!msg.isOwn && <Avatar src={msg.avatar} />}
                    <Box
                      sx={{
                        maxWidth: '60%',
                        backgroundColor: msg.isOwn ? 'rgba(124, 58, 237, 0.1)' : '#f1f5f9',
                        padding: '12px 16px',
                        borderRadius: msg.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      }}
                    >
                      {!msg.isOwn && (
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#7c3aed', mb: 0.5 }}>
                          {msg.user}
                        </Typography>
                      )}
                      <Typography sx={{ color: '#1e293b', fontSize: '0.95rem' }}>
                        {msg.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.5 }}>
                        {msg.timestamp}
                      </Typography>
                    </Box>
                    {msg.isOwn && <Avatar src={msg.avatar} />}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Input Area */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                multiline
                maxRows={3}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" sx={{ minWidth: 'auto', color: '#7c3aed' }}>
                          <EmojiEmotionsIcon />
                        </Button>
                        <Button size="small" sx={{ minWidth: 'auto', color: '#7c3aed' }}>
                          <AttachFileIcon />
                        </Button>
                        <Button size="small" sx={{ minWidth: 'auto', color: '#7c3aed' }}>
                          <SendIcon />
                        </Button>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
