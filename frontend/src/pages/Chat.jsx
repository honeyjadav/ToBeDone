import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

const conversations = [
  { id: 1, name: 'Aisha Khan', initials: 'AK', lastMessage: 'Sounds good, I\u2019ll review it today', time: '9:41 AM', unread: 2, online: true },
  { id: 2, name: 'Raj Sharma', initials: 'RS', lastMessage: 'Pushed the fix to staging', time: 'Yesterday', unread: 0, online: false },
  { id: 3, name: 'Design Team', initials: 'DT', lastMessage: 'New mockups are ready for review', time: 'Yesterday', unread: 5, online: true },
  { id: 4, name: 'John Doe', initials: 'JD', lastMessage: 'Thanks for the update!', time: 'Mon', unread: 0, online: false },
  { id: 5, name: 'Priya Patel', initials: 'PP', lastMessage: 'Can we sync tomorrow?', time: 'Mon', unread: 0, online: true },
];

const initialMessages = {
  1: [
    { id: 1, from: 'them', text: 'Hey! Did you get a chance to look at the new task board?', time: '9:32 AM' },
    { id: 2, from: 'me', text: 'Yes, just finished going through it. Looks really clean.', time: '9:35 AM' },
    { id: 3, from: 'them', text: 'Great, I added the priority tags too', time: '9:36 AM' },
    { id: 4, from: 'them', text: 'Sounds good, I\u2019ll review it today', time: '9:41 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Pushed the fix to staging', time: 'Yesterday' },
    { id: 2, from: 'me', text: 'Awesome, testing it now', time: 'Yesterday' },
  ],
  3: [
    { id: 1, from: 'them', text: 'New mockups are ready for review', time: 'Yesterday' },
  ],
  4: [
    { id: 1, from: 'me', text: 'Deployed the update', time: 'Mon' },
    { id: 2, from: 'them', text: 'Thanks for the update!', time: 'Mon' },
  ],
  5: [
    { id: 1, from: 'them', text: 'Can we sync tomorrow?', time: 'Mon' },
  ],
};

export default function Chat() {
  const [selectedId, setSelectedId] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef(null);

  const selected = conversations.find((c) => c.id === selectedId);
  const currentMessages = messages[selectedId] || [];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentMessages.length, selectedId]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInput('');
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#ffffff' }}>
      {/* Conversation list */}
      <Box sx={{ width: '300px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', mb: 1.5 }}>Chats</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              px: 1.5,
              height: '36px',
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
            <input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.map((c) => (
            <Box
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                backgroundColor: selectedId === c.id ? '#f3f0fe' : 'transparent',
                borderLeft: selectedId === c.id ? '3px solid #7c3aed' : '3px solid transparent',
                '&:hover': { backgroundColor: selectedId === c.id ? '#f3f0fe' : '#f8fafc' },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-dot': {
                    backgroundColor: c.online ? '#22c55e' : '#cbd5e1',
                    border: '2px solid #fff',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                  },
                }}
              >
                <Avatar sx={{ width: 40, height: 40, fontSize: '13px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                  {c.initials}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }} noWrap>
                    {c.name}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, ml: 1 }}>
                    {c.time}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12.5px', color: '#64748b' }} noWrap>
                    {c.lastMessage}
                  </Typography>
                  {c.unread > 0 && (
                    <Box
                      sx={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: '9px',
                        backgroundColor: '#7c3aed',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 0.5,
                        ml: 1,
                        flexShrink: 0,
                      }}
                    >
                      {c.unread}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Chat window */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selected ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 1.5,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 38, height: 38, fontSize: '13px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                  {selected.initials}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    {selected.name}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: selected.online ? '#22c55e' : '#94a3b8' }}>
                    {selected.online ? 'Active now' : 'Offline'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small"><PhoneOutlinedIcon sx={{ fontSize: 19, color: '#64748b' }} /></IconButton>
                <IconButton size="small"><VideocamOutlinedIcon sx={{ fontSize: 19, color: '#64748b' }} /></IconButton>
                <IconButton size="small"><MoreVertIcon sx={{ fontSize: 19, color: '#64748b' }} /></IconButton>
              </Box>
            </Box>

            <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 1.25, backgroundColor: '#f8fafc' }}>
              {currentMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: msg.from === 'me' ? '#7c3aed' : '#ffffff',
                      color: msg.from === 'me' ? '#ffffff' : '#1e293b',
                      border: msg.from === 'me' ? 'none' : '1px solid #e5e7eb',
                      borderRadius: msg.from === 'me' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      px: 1.75,
                      py: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '13.5px', lineHeight: 1.4 }}>{msg.text}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '10.5px', color: '#94a3b8', mt: 0.4, textAlign: msg.from === 'me' ? 'right' : 'left' }}>
                    {msg.time}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderTop: '1px solid #e5e7eb' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  border: '1px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <IconButton
                onClick={handleSend}
                sx={{
                  backgroundColor: '#7c3aed',
                  color: '#fff',
                  width: 38,
                  height: 38,
                  '&:hover': { backgroundColor: '#6d28d9' },
                }}
              >
                <SendIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Select a conversation
          </Box>
        )}
      </Box>
    </Box>
  );
}