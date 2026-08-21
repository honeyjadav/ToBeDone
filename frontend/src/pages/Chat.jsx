import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo, memo, useLayoutEffect } from 'react';
import {
  Box, Typography, Avatar, IconButton, Button, Modal, Checkbox,
  List, ListItem, ListItemText, TextField, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useAuth } from '../hooks/useAuth';
import APICallService from '../services/APICallService';
import { connectSocket, getSocket } from '../services/Socket';

// 1. Import settings utility
import { getAppSettings } from '../utils/preferences';

// 2. Dynamic color mapping based on dark mode state
const getColors = (darkMode) => ({
  bg: darkMode ? '#020817' : '#ffffff',
  panelBg: darkMode ? '#0f172a' : '#f7f7fc',
  border: darkMode ? '#334155' : '#e9e9f2',
  text: darkMode ? '#f8fafc' : '#1e1b3a',
  textMuted: darkMode ? '#94a3b8' : '#8b8aa3',
  accent: darkMode ? '#7c3aed' : '#5b56e0',
  accentHover: darkMode ? '#6d28d9' : '#4a45c9',
  accentSoft: darkMode ? '#2e1065' : '#efeefd',
  accentSoftHover: darkMode ? '#4c1d95' : '#f0f0f8',
  online: '#22c55e',
  bubbleMe: darkMode ? '#7c3aed' : '#5b56e0',
  bubbleThem: darkMode ? '#1e293b' : '#ffffff',
  danger: darkMode ? '#f87171' : '#ef4444',
  dangerSoft: darkMode ? '#451a1a' : '#fdecec',
  dangerSoftHover: darkMode ? '#7f1d1d' : '#fbdada',
  unread: '#22c55e',
  systemBg: darkMode ? '#1e293b' : '#eeeef7',
  deletedBg: darkMode ? '#1e293b' : '#f1f1f7',
  modalBg: darkMode ? '#0f172a' : '#ffffff',
  inputBg: darkMode ? '#1e293b' : '#ffffff',
});

const MESSAGE_LIMIT = 2000;
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 420;
const SIDEBAR_DEFAULT = 280;

function sortMessagesChronologically(messageList) {
  return [...messageList].sort(
    (first, second) => new Date(first.createdAt) - new Date(second.createdAt)
  );
}

export default function Chat() {
  const { activeWorkspace, user } = useAuth();
  const workspaceId = activeWorkspace?.workspaceId;

  // 3. Track dark mode state from global settings & events
  const initialSettings = getAppSettings();
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

  useEffect(() => {
    const handleSettingsChange = (event) => {
      const nextSettings = event.detail ?? getAppSettings();
      setDarkMode(Boolean(nextSettings.darkMode));
    };
    window.addEventListener('tobedone-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
  }, []);

  const C = getColors(darkMode); // Apply dynamic colors

  const [groups, setGroups] = useState([]);
  const [directs, setDirects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [presence, setPresence] = useState([]);

  // unread badges
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const notificationChat = location.state;
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    if (!notificationChat) return;

    if (notificationChat.workspaceId &&
      String(notificationChat.workspaceId) !== String(workspaceId)) {
      return;
    }

    if (notificationChat.type === "GROUP" && notificationChat.groupId) {
      const group = groups.find((item) => String(item._id || item.id) === String(notificationChat.groupId));
      if (group) {
        setSelected({ ...group, id: group._id || group.id, type: "group" });
        navigate("/dashboard/chat", { replace: true, state: null });
      }
    }

    if (notificationChat.type === "DM" && notificationChat.userId) {
      const direct = directs.find((item) => String(item._id || item.id) === String(notificationChat.userId));
      if (direct) {
        setSelected({ ...direct, id: direct._id || direct.id, type: "dm" });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [notificationChat, groups, directs, workspaceId, navigate]);

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const dragStateRef = useRef({ dragging: false, startX: 0, startWidth: SIDEBAR_DEFAULT });

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupIsPrivate, setGroupIsPrivate] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [groupError, setGroupError] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);

  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [groupDetail, setGroupDetail] = useState(null);

  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [addMemberIds, setAddMemberIds] = useState([]);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(false);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const readSentRef = useRef(new Set());

  const isReadOnlyGroup = selected?.type === 'group' && (selected?.removed || selected?.isMember === false);
  const isHardRemoved = selected?.type === 'group' && selected?.removed;

  const loadConversations = useCallback(() => {
    if (!workspaceId) return;
    APICallService.getConversations(workspaceId)
      .then((res) => {
        const { groups: g, directs: d } = res.data.data || {};
        if (!Array.isArray(g) || !Array.isArray(d)) return;
        const groupsWithType = g.map(item => ({ ...item, type: 'group' }));
        const directsWithType = d.map(item => ({ ...item, type: 'dm' }));
        setGroups(groupsWithType);
        setDirects(directsWithType);
        setSelected((prev) => prev || directsWithType[0] || groupsWithType[0] || null);

        setSelected((prev) => {
          if (!prev) return prev;
          const match = prev.type === 'group'
            ? groupsWithType.find((c) => (c._id || c.id) === prev.id)
            : directsWithType.find((c) => (c._id || c.id) === prev.id);
          if (!match) return prev;
          return { ...prev, ...match, id: prev.id, removed: prev.removed };
        });

        setUnreadCounts((prev) => {
          const next = { ...prev };
          [...groupsWithType, ...directsWithType].forEach((c) => {
            const id = c._id || c.id;
            if (selectedRef.current?.id !== id) {
              next[id] = c.unreadCount || 0;
            }
          });
          return next;
        });
      })
      .catch((err) => console.error('Failed to load conversations:', err));
  }, [workspaceId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!workspaceId) return;
    const socket = connectSocket();
    if (!socket) return;
    socket.emit('workspace:join', { workspaceId });

    const onPresence = (list) => setPresence(list);
    socket.on('presence:update', onPresence);

    return () => {
      socket.off('presence:update', onPresence);
      socket.emit('workspace:leave', { workspaceId });
    };
  }, [workspaceId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selected) return;

    if (selected.type === 'dm') {
      socket.emit('chat:open', { recipientId: selected.id });
    } else if (selected.type === 'group') {
      socket.emit('chat:open', { groupId: selected.id });
    }

    return () => {
      socket.emit('chat:close');
    };
  }, [selected]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNew = (msg) => {
      const belongs =
        (selected?.type === 'group' && msg.group === selected.id) ||
        (selected?.type === 'dm' && !msg.group &&
          (msg.sender._id === selected.id || msg.recipient === selected.id));

      if (belongs) {
        setMessages((prev) => sortMessagesChronologically([...prev, msg]));
        return;
      }

      if (msg.isSystem) return;
      const senderId = msg.sender?._id || msg.sender;
      if (senderId === user?.id) return;
      const targetId = msg.group || senderId;
      if (!targetId) return;
      setUnreadCounts((prev) => ({ ...prev, [targetId]: (prev[targetId] || 0) + 1 }));
    };

    const onDeleted = ({ messageId, content }) => {
      setMessages((prev) => prev.map((m) =>
        m._id === messageId ? { ...m, content, deleted: true } : m
      ));
    };

    const onTyping = ({ userId, name, typing, groupId, recipientId }) => {
      if (userId === user?.id) return;
      const same =
        (selected?.type === 'group' && groupId === selected.id) ||
        (selected?.type === 'dm' && recipientId === user?.id);
      if (!same) return;
      setTypingUser(typing ? name : null);
    };

    const onRead = ({ messageId, userId }) => {
      setMessages((prev) => prev.map((m) => (m._id === messageId
        ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] }
        : m)));
    };

    socket.on('message:new', onNew);
    socket.on('message:deleted', onDeleted);
    socket.on('typing:update', onTyping);
    socket.on('message:read', onRead);
    return () => {
      socket.off('message:new', onNew);
      socket.off('message:deleted', onDeleted);
      socket.off('typing:update', onTyping);
      socket.off('message:read', onRead);
    };
  }, [selected, user, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !selected) return;

    const params = selected.type === 'group'
      ? { groupId: selected.id }
      : { recipientId: selected.id };

    const resetState = () => {
      setMessages([]);
      setTypingUser(null);
      readSentRef.current = new Set();
    };

    resetState();
    setUnreadCounts((prev) => (prev[selected.id] ? { ...prev, [selected.id]: 0 } : prev));

    APICallService.getMessages(workspaceId, params)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMessages(sortMessagesChronologically(res.data));
        }
      })
      .catch((err) => console.error('Failed to load messages:', err));

    const canJoinRoom =
      selected.type === 'group' &&
      !selected.removed &&
      (selected.isMember !== false || selected.isPrivate === false);

    if (canJoinRoom) {
      getSocket()?.emit('group:join', { groupId: selected.id });
    }

    return () => {
      if (canJoinRoom) {
        getSocket()?.emit('group:leave', { groupId: selected.id });
      }
    };
  }, [workspaceId, selected]);

  useLayoutEffect(() => {
    if (!selected || !messages.length) return;
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [selected, messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;
    messages.forEach((m) => {
      const senderId = m.sender?._id || m.sender;
      if (senderId !== user.id && !readSentRef.current.has(m._id)) {
        readSentRef.current.add(m._id);
        socket.emit('message:read', { messageId: m._id });
      }
    });
  }, [messages, user]);

  const startResize = (e) => {
    dragStateRef.current = { dragging: true, startX: e.clientX, startWidth: sidebarWidth };
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragStateRef.current.dragging) return;
      const delta = e.clientX - dragStateRef.current.startX;
      const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, dragStateRef.current.startWidth + delta));
      setSidebarWidth(next);
    };
    const onUp = () => { dragStateRef.current.dragging = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > MESSAGE_LIMIT || !selected) return;
    if (isReadOnlyGroup) return;
    const socket = getSocket();
    const payload = {
      workspaceId,
      groupId: selected.type === 'group' ? selected.id : undefined,
      recipientId: selected.type === 'dm' ? selected.id : undefined,
    };
    socket?.emit('message:send', { ...payload, content: trimmed });
    socket?.emit('typing:stop', payload);
    setInput('');
  }, [input, selected, workspaceId, isReadOnlyGroup]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onRemoved = ({ groupId }) => {
      if (selected?.type === 'group' && selected.id === groupId) {
        setSelected((prev) => prev ? { ...prev, removed: true } : null);
      }
      loadConversations();
    };
    socket.on('group:removed', onRemoved);
    return () => socket.off('group:removed', onRemoved);
  }, [selected, loadConversations]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onDemoted = ({ groupId }) => {
      if (selected?.type === 'group' && selected.id === groupId) {
        setSelected((prev) => prev ? { ...prev, isMember: false } : null);
      }
      loadConversations();
    };
    socket.on('group:demoted', onDemoted);
    return () => socket.off('group:demoted', onDemoted);
  }, [selected, loadConversations]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onGroupDeleted = ({ groupId }) => {
      if (selected?.type === 'group' && selected.id === groupId) {
        setSelected(null);
      }
      loadConversations();
    };
    socket.on('group:deleted', onGroupDeleted);
    return () => socket.off('group:deleted', onGroupDeleted);
  }, [selected, loadConversations]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length > MESSAGE_LIMIT) return;
    setInput(val);
    if (!selected || isReadOnlyGroup) return;
    const socket = getSocket();
    const payload = {
      workspaceId,
      groupId: selected.type === 'group' ? selected.id : undefined,
      recipientId: selected.type === 'dm' ? selected.id : undefined,
    };
    socket?.emit('typing:start', payload);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket?.emit('typing:stop', payload), 1500);
  };

  const confirmUnsend = () => {
    if (!confirmDeleteId) return;
    const socket = getSocket();
    socket?.emit('message:delete', {
      messageId: confirmDeleteId,
      workspaceId,
      groupId: selected?.type === 'group' ? selected.id : undefined,
      recipientId: selected?.type === 'dm' ? selected.id : undefined,
    });
    setMessages((prev) => prev.map((m) =>
      m._id === confirmDeleteId ? { ...m, content: 'This message was unsent', deleted: true } : m
    ));
    setConfirmDeleteId(null);
  };

  const openGroupModal = () => {
    setGroupName(''); setGroupIsPrivate(true); setSelectedMemberIds([]);
    setGroupError('');
    setGroupModalOpen(true);
  };
  const toggleMember = (id) => {
    setSelectedMemberIds((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };
  const handleCreateGroup = async () => {
    setGroupError('');
    if (!groupName.trim()) return;
    if (selectedMemberIds.length === 0) {
      setGroupError('Please select at least one member');
      return;
    }
    setCreatingGroup(true);
    try {
      const res = await APICallService.createGroup(workspaceId, {
        name: groupName.trim(), isPrivate: groupIsPrivate, members: selectedMemberIds,
      });
      if (res?.data?.data) {
        setGroupModalOpen(false);
        loadConversations();
        const newGroup = res.data.data;
        setSelected({
          id: newGroup._id || newGroup.id,
          _id: newGroup._id,
          type: 'group',
          name: newGroup.name,
          isPrivate: newGroup.isPrivate,
          memberCount: selectedMemberIds.length + 1,
          isMember: true,
        });
      }
    } catch (err) {
      setGroupError(
        err?.response?.data?.message || 'Failed to create group. Please try again.'
      );
    } finally {
      setCreatingGroup(false);
    }
  };

  const refreshGroupDetail = async () => {
    try {
      if (!selected?.id) return null;
      const res = await APICallService.getGroupById(workspaceId, selected.id);
      if (res?.data?.data) {
        setGroupDetail(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to refresh group detail:', err);
    }
    return null;
  };

  const openMembers = async () => {
    if (selected?.type !== 'group') return;
    await refreshGroupDetail();
    setMembersModalOpen(true);
  };

  const handleRemoveMember = async (userId) => {
    try {
      if (!selected?.id) return;
      await APICallService.removeGroupMember(workspaceId, selected.id, userId);
      await refreshGroupDetail();
      loadConversations();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const isCreator = groupDetail?.createdBy === user?.id;

  const openAddMember = () => {
    setAddMemberIds([]);
    setAddMemberModalOpen(true);
  };
  const toggleAddMember = (id) => {
    setAddMemberIds((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };
  const existingMemberIds = useMemo(
    () => new Set((groupDetail?.members || []).map((m) => m._id)),
    [groupDetail?.members]
  );
  const eligibleDirects = useMemo(
    () => directs.filter((d) => !existingMemberIds.has(d._id || d.id)),
    [directs, existingMemberIds]
  );
  const handleAddMembers = async () => {
    try {
      if (!selected?.id || addMemberIds.length === 0) return;
      for (const uid of addMemberIds) {
        await APICallService.addGroupMember(workspaceId, selected.id, uid);
      }
      setAddMemberModalOpen(false);
      await refreshGroupDetail();
      loadConversations();
    } catch (err) {
      console.error('Failed to add members:', err);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (!selected?.id) return;
      await APICallService.deleteGroup(workspaceId, selected.id);
      setMembersModalOpen(false);
      setConfirmDeleteGroup(false);
      setSelected(null);
      loadConversations();
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  const isOnline = useCallback(
    (userId) => presence.some((p) => p.userId === userId),
    [presence]
  );

  const filteredGroups = useMemo(
    () => groups.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [groups, search]
  );
  const filteredDirects = useMemo(
    () => directs.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) ?? false),
    [directs, search]
  );

  const charsLeft = MESSAGE_LIMIT - input.length;
  const nearLimit = charsLeft <= 100;

  // Shared dark-mode styling for TextFields in Modals
  const textFieldModalSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: C.inputBg,
      '& fieldset': { borderColor: C.border },
      '&:hover fieldset': { borderColor: C.textMuted },
    },
    '& .MuiInputBase-input': { color: C.text },
    '& .MuiInputLabel-root': { color: C.textMuted },
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: C.bg }}>
      {/* Sidebar */}
      <Box sx={{ width: sidebarWidth, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, backgroundColor: C.panelBg, position: 'relative' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${C.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: C.text }}>Chats</Typography>
            <Tooltip title="New group">
              <IconButton
                size="small" onClick={openGroupModal}
                sx={{ bgcolor: C.accent, color: '#fff', width: 30, height: 30, '&:hover': { bgcolor: C.accentHover } }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', px: 1.5, height: 36 }}>
            <SearchIcon sx={{ fontSize: 17, color: C.textMuted }} />
            <input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%', color: C.text }}
            />
          </Box>
        </Box>

        <Box className="thin-scroll" sx={{ flex: 1, overflowY: 'auto' }}>
          {filteredGroups.length > 0 && (
            <>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.textMuted, px: 2, pt: 1.5, pb: 0.5, letterSpacing: 0.5 }}>
                GROUPS
              </Typography>
              {filteredGroups.map((c) => {
                const convId = c._id || c.id;
                return (
                  <ConversationRow
                    key={`group-${convId}`}
                    c={c}
                    selected={selected}
                    onClick={setSelected}
                    isGroup
                    unreadCount={unreadCounts[convId]}
                    C={C}
                  />
                );
              })}
            </>
          )}

          {filteredDirects.length > 0 && (
            <>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.textMuted, px: 2, pt: 1.5, pb: 0.5, letterSpacing: 0.5 }}>
                PEOPLE
              </Typography>
              {filteredDirects.map((c) => {
                const convId = c._id || c.id;
                return (
                  <ConversationRow
                    key={`dm-${convId}`}
                    c={c}
                    selected={selected}
                    onClick={setSelected}
                    online={isOnline(convId)}
                    unreadCount={unreadCounts[convId]}
                    C={C}
                  />
                );
              })}
            </>
          )}

          {filteredGroups.length === 0 && filteredDirects.length === 0 && (
            <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center', mt: 3 }}>
              No conversations found
            </Typography>
          )}
        </Box>

        <Box
          onMouseDown={startResize}
          sx={{
            position: 'absolute', top: 0, right: -3, width: 6, height: '100%',
            cursor: 'col-resize', zIndex: 5,
            '&:hover': { backgroundColor: C.accentSoft },
          }}
        />
      </Box>

      {/* Chat window */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selected ? (
          <>
            <Box
              onClick={selected.type === 'group' && !isHardRemoved ? openMembers : undefined}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 1.5,
                borderBottom: `1px solid ${C.border}`,
                cursor: selected.type === 'group' && !isHardRemoved ? 'pointer' : 'default',
              }}
            >
              <Avatar sx={{ bgcolor: C.accentSoft, color: C.accent, width: 38, height: 38 }}>
                {selected.type === 'group' ? <GroupIcon sx={{ fontSize: 18 }} /> : selected.name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.text }}>{selected.name}</Typography>
                  {selected.type === 'group' && selected.isPrivate === false && (
                    <Tooltip title="Public group">
                      <VisibilityOutlinedIcon sx={{ fontSize: 14, color: C.textMuted }} />
                    </Tooltip>
                  )}
                  {selected.type === 'group' && selected.isPrivate === true && (
                    <Tooltip title="Private group">
                      <LockOutlinedIcon sx={{ fontSize: 13, color: C.textMuted }} />
                    </Tooltip>
                  )}
                </Box>
                <Typography sx={{ fontSize: 12, color: typingUser ? C.accent : C.textMuted }}>
                  {typingUser
                    ? `${typingUser} is typing…`
                    : selected.type === 'group'
                      ? isHardRemoved
                        ? "You were removed · can't view"
                        : isReadOnlyGroup
                          ? 'View only · not a member'
                          : `${selected.memberCount || ''} members · click to view`
                      : isOnline(selected.id) ? 'Active now' : 'Offline'}
                </Typography>
              </Box>
            </Box>

            <Box ref={scrollRef} className="thin-scroll" sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 1.25, backgroundColor: C.panelBg }}>
              {isHardRemoved ? (
                <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center', mt: 3 }}>
                  You no longer have access to this group's messages.
                </Typography>
              ) : messages.length === 0 ? (
                <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center', mt: 3 }}>
                  No messages yet
                </Typography>
              ) : (
                messages.map((m) => {
                  const senderId = m.sender?._id || m.sender;
                  const isMe = senderId === user?.id;
                  return (
                    <MessageRow
                      key={m._id}
                      m={m}
                      isMe={isMe}
                      isGroup={selected?.type === 'group'}
                      user={user}
                      setConfirmDeleteId={setConfirmDeleteId}
                      C={C}
                    />
                  );
                })
              )}
            </Box>

            {isHardRemoved ? (
              <Box sx={{ borderTop: `1px solid ${C.border}`, px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center' }}>
                  You were removed from this private group
                </Typography>
              </Box>
            ) : isReadOnlyGroup ? (
              <Box sx={{ borderTop: `1px solid ${C.border}`, px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center' }}>
                  You're viewing this public group. Join to send messages.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ borderTop: `1px solid ${C.border}`, px: 2, py: 1.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 20, padding: '10px 16px', fontSize: 13.5, outline: 'none', backgroundColor: C.inputBg, color: C.text }}
                  />
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim()}
                    sx={{ bgcolor: C.accent, color: '#fff', width: 38, height: 38, '&:hover': { bgcolor: C.accentHover }, '&.Mui-disabled': { bgcolor: darkMode ? '#334155' : '#d8d7f5', color: darkMode ? '#64748b' : '#fff' } }}
                  >
                    <SendIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Box>
                {nearLimit && (
                  <Typography sx={{ fontSize: 11, color: charsLeft <= 0 ? C.danger : C.textMuted, mt: 0.5, textAlign: 'right' }}>
                    {charsLeft} characters left
                  </Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
            Select a conversation
          </Box>
        )}
      </Box>

      {/* Create Group Modal */}
      <Modal open={groupModalOpen} onClose={() => setGroupModalOpen(false)}>
        <ModalCard C={C}>
          <Typography sx={{ fontWeight: 700, mb: 2, color: C.text }}>Create Group</Typography>
          <TextField fullWidth size="small" label="Group name" value={groupName}
            onChange={(e) => setGroupName(e.target.value)} sx={{ mb: 2, ...textFieldModalSx }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Checkbox checked={groupIsPrivate} onChange={(e) => setGroupIsPrivate(e.target.checked)} sx={{ color: C.textMuted, '&.Mui-checked': { color: C.accent } }} />
            <Typography sx={{ fontSize: 13, color: C.text }}>Private group</Typography>
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: C.textMuted, mt: 1, mb: 0.5 }}>Add members</Typography>
          <List className="thin-scroll" sx={{ maxHeight: 220, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 1 }}>
            {directs.map((m) => {
              const memberId = m._id || m.id;
              return (
                <ListItem key={memberId} dense button onClick={() => toggleMember(memberId)}>
                  <Checkbox edge="start" checked={selectedMemberIds.includes(memberId)} tabIndex={-1} disableRipple sx={{ color: C.textMuted, '&.Mui-checked': { color: C.accent } }} />
                  <ListItemText primary={m.name || 'Unnamed'} secondary={m.email} primaryTypographyProps={{ color: C.text }} secondaryTypographyProps={{ color: C.textMuted }} />
                </ListItem>
              );
            })}
          </List>
          {groupError && (
            <Typography sx={{ fontSize: 12, color: C.danger, mt: 1.25 }}>
              {groupError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={() => setGroupModalOpen(false)} sx={{ textTransform: 'none', color: C.textMuted }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateGroup} disabled={!groupName.trim() || creatingGroup}
              sx={{ textTransform: 'none', bgcolor: C.accent, '&:hover': { bgcolor: C.accentHover }, '&.Mui-disabled': { bgcolor: darkMode ? '#334155' : undefined, color: darkMode ? '#64748b' : undefined } }}>
              {creatingGroup ? 'Creating…' : 'Create'}
            </Button>
          </Box>
        </ModalCard>
      </Modal>

      {/* Group Members Modal */}
      <Modal open={membersModalOpen} onClose={() => setMembersModalOpen(false)}>
        <ModalCard C={C}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: C.text }}>{groupDetail?.name} · Members</Typography>
            <IconButton size="small" onClick={() => setMembersModalOpen(false)}><CloseIcon sx={{ fontSize: 18, color: C.textMuted }} /></IconButton>
          </Box>

          {isCreator && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Button
                fullWidth startIcon={<PersonAddIcon sx={{ fontSize: 17 }} />}
                onClick={openAddMember}
                sx={{ textTransform: 'none', bgcolor: C.accentSoft, color: C.accent, '&:hover': { bgcolor: C.accentSoftHover } }}
              >
                Add Member
              </Button>
              <Button
                fullWidth startIcon={<DeleteOutlineIcon sx={{ fontSize: 17 }} />}
                onClick={() => setConfirmDeleteGroup(true)}
                sx={{ textTransform: 'none', bgcolor: C.dangerSoft, color: C.danger, '&:hover': { bgcolor: C.dangerSoftHover } }}
              >
                Delete Group
              </Button>
            </Box>
          )}

          <List className="thin-scroll" sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {groupDetail?.members?.map((m) => {
              const isSelf = m._id === user?.id;
              return (
                <ListItem
                  key={m._id}
                  secondaryAction={
                    isCreator && !isSelf ? (
                      <IconButton size="small" onClick={() => handleRemoveMember(m._id)}>
                        <CloseIcon sx={{ fontSize: 16, color: C.textMuted }} />
                      </IconButton>
                    ) : null
                  }
                >
                  <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: C.accentSoft, color: C.accent, mr: 1.5 }}>
                    {m.name?.[0]}
                  </Avatar>
                  <ListItemText
                    primaryTypographyProps={{ color: C.text }}
                    secondaryTypographyProps={{ color: C.textMuted }}
                    primary={isSelf ? 'You' : m.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isOnline(m._id) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: C.online }} />}
                        {m.email}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </ModalCard>
      </Modal>

      {/* Add Member Modal (creator only) */}
      <Modal open={addMemberModalOpen} onClose={() => setAddMemberModalOpen(false)}>
        <ModalCard C={C}>
          <Typography sx={{ fontWeight: 700, mb: 1.5, color: C.text }}>Add Members</Typography>
          <List className="thin-scroll" sx={{ maxHeight: 260, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 1 }}>
            {eligibleDirects.length === 0 && (
              <Typography sx={{ fontSize: 12.5, color: C.textMuted, textAlign: 'center', p: 2 }}>
                Everyone is already in this group.
              </Typography>
            )}
            {eligibleDirects.map((m) => {
              const memberId = m._id || m.id;
              return (
                <ListItem key={memberId} dense button onClick={() => toggleAddMember(memberId)}>
                  <Checkbox edge="start" checked={addMemberIds.includes(memberId)} tabIndex={-1} disableRipple sx={{ color: C.textMuted, '&.Mui-checked': { color: C.accent } }} />
                  <ListItemText primary={m.name || 'Unnamed'} secondary={m.email} primaryTypographyProps={{ color: C.text }} secondaryTypographyProps={{ color: C.textMuted }} />
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={() => setAddMemberModalOpen(false)} sx={{ textTransform: 'none', color: C.textMuted }}>Cancel</Button>
            <Button variant="contained" onClick={handleAddMembers} disabled={addMemberIds.length === 0}
              sx={{ textTransform: 'none', bgcolor: C.accent, '&:hover': { bgcolor: C.accentHover }, '&.Mui-disabled': { bgcolor: darkMode ? '#334155' : undefined, color: darkMode ? '#64748b' : undefined } }}>
              Add
            </Button>
          </Box>
        </ModalCard>
      </Modal>

      {/* Unsend Confirmation Modal */}
      <Modal open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <ModalCard width={340} C={C}>
          <Typography sx={{ fontWeight: 700, color: C.text, mb: 1 }}>Unsend message?</Typography>
          <Typography sx={{ fontSize: 13, color: C.textMuted, mb: 2.5 }}>
            This will remove the message for everyone in the conversation. This can't be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setConfirmDeleteId(null)} sx={{ textTransform: 'none', color: C.textMuted }}>Cancel</Button>
            <Button
              variant="contained" onClick={confirmUnsend}
              sx={{ textTransform: 'none', bgcolor: C.danger, '&:hover': { bgcolor: C.dangerSoftHover } }}
            >
              Unsend
            </Button>
          </Box>
        </ModalCard>
      </Modal>

      {/* Delete Group Confirmation Modal */}
      <Modal open={confirmDeleteGroup} onClose={() => setConfirmDeleteGroup(false)}>
        <ModalCard width={360} C={C}>
          <Typography sx={{ fontWeight: 700, color: C.text, mb: 1 }}>Delete this group?</Typography>
          <Typography sx={{ fontSize: 13, color: C.textMuted, mb: 2.5 }}>
            This permanently deletes "{groupDetail?.name}" and all its messages for every member. This can't be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setConfirmDeleteGroup(false)} sx={{ textTransform: 'none', color: C.textMuted }}>Cancel</Button>
            <Button
              variant="contained" onClick={handleDeleteGroup}
              sx={{ textTransform: 'none', bgcolor: C.danger, '&:hover': { bgcolor: C.dangerSoftHover } }}
            >
              Delete
            </Button>
          </Box>
        </ModalCard>
      </Modal>

      <style>{`
        .msg-row:hover .msg-delete-btn { opacity: 1 !important; }
      `}</style>
    </Box>
  );
}

function ModalCard({ children, width = 400, C }) {
  return (
    <Box sx={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width, bgcolor: C.modalBg, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', p: 3,
    }}>
      {children}
    </Box>
  );
}

function formatMessageTime(createdAt) {
  try {
    return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getSystemLabel(m, userId) {
  const meta = m.systemMeta;
  if (!meta || !meta.type) return m.content || 'System message';

  const actorId = meta.actorId?._id || meta.actorId;
  const targetId = meta.targetId?._id || meta.targetId;
  const actorName = meta.actorId?.name || 'a member';
  const targetName = meta.targetId?.name || 'a member';
  const actorIsMe = userId && String(actorId) === String(userId);
  const targetIsMe = userId && String(targetId) === String(userId);

  if (meta.type === 'member_removed') {
    if (actorIsMe) return `You removed ${targetName}`;
    if (targetIsMe) return `${actorName} removed you`;
    return `${actorName} removed ${targetName}`;
  }
  if (meta.type === 'member_left') {
    if (targetIsMe) return 'You left the group';
    return `${targetName} left the group`;
  }
  if (meta.type === 'member_added') {
    if (actorIsMe) return `You added ${targetName}`;
    if (targetIsMe) return `${actorName} added you`;
    return `${actorName} added ${targetName}`;
  }
  return m.content;
}

const MessageRow = memo(function MessageRow({ m, isMe, isGroup, user, setConfirmDeleteId, C }) {
  const readByOthers = (m.readBy || []).filter((id) => id !== user?.id);
  const messageTime = useMemo(() => formatMessageTime(m.createdAt), [m.createdAt]);

  if (m.isSystem) {
    return (
      <Box sx={{ alignSelf: 'center', my: 0.5 }}>
        <Typography sx={{ fontSize: 11.5, color: C.textMuted, bgcolor: C.systemBg, px: 1.5, py: 0.4, borderRadius: 10 }}>
          {getSystemLabel(m, user?.id)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="msg-row" sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
      {!isMe && isGroup && m.sender && (
        <Typography sx={{ fontSize: 11, color: C.textMuted, mb: 0.25 }}>{m.sender?.name || 'Unknown User'}</Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexDirection: isMe ? 'row-reverse' : 'row' }}>
        {isMe && !m.deleted && (
          <IconButton
            size="small" onClick={() => setConfirmDeleteId(m._id)}
            className="msg-delete-btn"
            sx={{ opacity: 0, transition: 'opacity .15s', p: 0.4 }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 15, color: C.textMuted }} />
          </IconButton>
        )}
        <Box sx={{
          backgroundColor: m.deleted ? C.deletedBg : (isMe ? C.bubbleMe : C.bubbleThem),
          color: m.deleted ? C.textMuted : (isMe ? '#fff' : C.text),
          border: (isMe && !m.deleted) ? 'none' : `1px solid ${C.border}`,
          borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          px: 1.75, py: 1, wordBreak: 'break-word',
          fontStyle: m.deleted ? 'italic' : 'normal',
        }}>
          <Typography sx={{ fontSize: 13.5, lineHeight: 1.4 }}>{m.content || ''}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, justifyContent: isMe ? 'flex-end' : 'flex-start', mt: 0.4 }}>
        <Typography sx={{ fontSize: 10.5, color: C.textMuted }}>
          {messageTime}
        </Typography>
        {isMe && !m.deleted && (
          readByOthers.length > 0
            ? <DoneAllIcon sx={{ fontSize: 13, color: C.accent }} />
            : <DoneIcon sx={{ fontSize: 13, color: C.textMuted }} />
        )}
      </Box>
    </Box>
  );
});

function ConversationRow({ c, selected, onClick, isGroup, online, unreadCount, C }) {
  const convId = c._id || c.id;
  const isActive = selected?.id === convId && selected?.type === c.type;
  const isReadOnly = isGroup && c.isMember === false;
  const hasUnread = !!unreadCount;

  const handleClick = () => {
    const conversationData = {
      ...c,
      id: convId,
      type: c.type || (isGroup ? 'group' : 'dm'),
    };
    onClick(conversationData);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.1, cursor: 'pointer',
        backgroundColor: isActive ? C.accentSoft : 'transparent',
        borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
        '&:hover': { backgroundColor: isActive ? C.accentSoft : C.accentSoftHover },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: 12.5, fontWeight: 700, bgcolor: C.accentSoft, color: C.accent }}>
          {isGroup ? <GroupIcon sx={{ fontSize: 15 }} /> : (c.name?.[0] || '?')}
        </Avatar>
        {!isGroup && online && (
          <Box sx={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', bgcolor: C.online, border: `2px solid ${C.panelBg}` }} />
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: hasUnread ? 700 : 600, color: C.text }} noWrap>
          {c.name || 'Unnamed'}
        </Typography>
        {isReadOnly && (
          <Typography sx={{ fontSize: 10.5, color: C.textMuted }} noWrap>
            View only
          </Typography>
        )}
      </Box>
      {hasUnread && (
        <Box sx={{
          minWidth: 18, height: 18, borderRadius: '50%', bgcolor: C.unread,
          color: '#fff', fontSize: 10.5, fontWeight: 700, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.6, flexShrink: 0,
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </Box>
      )}
    </Box>
  );
}