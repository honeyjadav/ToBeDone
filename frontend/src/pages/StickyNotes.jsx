import { useState, useEffect } from 'react';
import {
    Box, Typography, IconButton, Button, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import AddNote, { NOTE_COLORS } from './AddNote';

const CARD_HEIGHT = 190;

// Match the base URL your other working calls (e.g. getMyWorkspaces) use.
// If APICallService.js reads from an env var instead, swap this line for that.
const API_BASE = 'http://localhost:5000/api/notes';

export default function StickyNotes({ workspaceId }) {
    const [notes, setNotes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeNote, setActiveNote] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    };

    const normalize = (n) => ({
        id: n._id || n.id,
        title: n.title || '',
        content: n.content || '',
        color: n.color || NOTE_COLORS[0],
        pinned: !!n.pinned,
    });

    useEffect(() => {
        if (!workspaceId) {
            setNotes([]);
            return;
        }

        const fetchNotes = async () => {
            try {
                const response = await fetch(`${API_BASE}/get/${workspaceId}`, {
                    headers: getAuthHeaders(),
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    setNotes(Array.isArray(data) ? data.map(normalize) : []);
                } else {
                    console.error('Failed to fetch notes:', response.status, data?.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [workspaceId]);

    const openNewNote = () => {
        setActiveNote(null);
        setDialogOpen(true);
    };

    const openExistingNote = (note) => {
        setActiveNote(note);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setActiveNote(null);
    };

    const saveNote = async ({ id, title, color, content }) => {
        if (!workspaceId) {
            console.error('Missing workspaceId while saving note');
            return;
        }

        const safeTitle = typeof title === 'string' ? title.trim() : '';
        const safeContent = typeof content === 'string' ? content : '';

        if (id) {
            try {
                const response = await fetch(`${API_BASE}/update/${id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ title: safeTitle, content: safeContent, color }),
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    const updated = normalize(data);
                    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
                } else {
                    console.error('Failed to update note:', response.status, data?.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error updating note:', error);
            }
        } else {
            try {
                const response = await fetch(`${API_BASE}/create`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ title: safeTitle, content: safeContent, color, workspaceId }),
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    setNotes((prev) => [normalize(data), ...prev]);
                } else {
                    console.error('Failed to create note:', response.status, data?.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error creating note:', error);
            }
        }
    };

    const requestDelete = (id) => setDeleteConfirmId(id);

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        const id = deleteConfirmId;

        try {
            const response = await fetch(`${API_BASE}/delete/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                setNotes((prev) => prev.filter((n) => n.id !== id));
            } else {
                const data = await response.json().catch(() => ({}));
                console.error('Failed to delete note:', response.status, data.message);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const togglePin = async (id, currentPinned) => {
        const newPinned = !currentPinned;
        const previousNotes = notes;
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: newPinned } : n)));

        try {
            const response = await fetch(`${API_BASE}/update/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ pinned: newPinned }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message || 'Pin update failed');
            }

            const updatedNote = data && data._id ? normalize(data) : null;
            if (updatedNote) {
                setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
            }
        } catch (error) {
            console.error('Error updating pin status:', error);
            setNotes(previousNotes);
        }
    };

    const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexShrink: 0 }}>
                <Box>
                    <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>Sticky Notes</Typography>
                    <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
                        {notes.length} notes
                    </Typography>
                </Box>
                <Button
                    onClick={openNewNote}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: '#7c3aed',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#6d28d9' },
                    }}
                >
                    New Note
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: 0.5,
                    pb: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                        gap: 2,
                        alignItems: 'start',
                    }}
                >
                    {sortedNotes.map((note) => (
                        <Box
                            key={note.id}
                            sx={{
                                backgroundColor: note.color,
                                borderRadius: '10px',
                                p: 2,
                                height: `${CARD_HEIGHT}px`,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                transition: 'transform 0.15s ease',
                                '&:hover': { transform: 'translateY(-2px)' },
                            }}
                        >
                            <Box
                                className="note-actions"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    gap: 0.5,
                                    opacity: 1,
                                    visibility: 'visible',
                                    pointerEvents: 'auto',
                                    transition: 'opacity 0.15s ease',
                                    zIndex: 10,
                                }}
                            >
                                <IconButton size="small" onClick={() => openExistingNote(note)} sx={{ p: 0.4 }}>
                                    <EditIcon sx={{ fontSize: 15, color: 'rgba(0,0,0,0.45)' }} />
                                </IconButton>
                                <IconButton size="small" onClick={() => togglePin(note.id, note.pinned)} sx={{ p: 0.4 }}>
                                    <PushPinIcon sx={{ fontSize: 15, color: note.pinned ? '#7c3aed' : 'rgba(0,0,0,0.4)', transform: note.pinned ? 'rotate(0deg)' : 'rotate(35deg)' }} />
                                </IconButton>
                                <IconButton size="small" onClick={() => requestDelete(note.id)} sx={{ p: 0.4 }}>
                                    <CloseIcon sx={{ fontSize: 15, color: 'rgba(0,0,0,0.4)' }} />
                                </IconButton>
                            </Box>

                            {note.pinned && (
                                <PushPinIcon sx={{ position: 'absolute', top: 8, left: 8, fontSize: 14, color: '#7c3aed' }} />
                            )}

                            {note.title && (
                                <Typography
                                    sx={{
                                        fontSize: '14.5px',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        mt: '18px',
                                        mb: 0.75,
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {note.title}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    fontSize: '13.5px',
                                    color: '#334155',
                                    lineHeight: 1.6,
                                    flex: 1,
                                    minHeight: 0,
                                    overflow: 'hidden',
                                    mt: note.title ? 0 : '18px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: note.title ? 4 : 6,
                                    WebkitBoxOrient: 'vertical',
                                    '& ul, & ol': { pl: 2.5, m: 0 },
                                    '& p': { m: 0 },
                                }}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                        </Box>
                    ))}
                </Box>

                {notes.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8, color: '#94a3b8' }}>
                        <Typography sx={{ fontSize: '14px' }}>No notes yet. Click "New Note" to add one.</Typography>
                    </Box>
                )}
            </Box>

            <AddNote open={dialogOpen} onClose={closeDialog} onSave={saveNote} note={activeNote} />

            <Dialog
                open={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px', p: 1, width: 320 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', pb: 1 }}>Delete Note</DialogTitle>
                <DialogContent sx={{ pb: 1.5 }}>
                    <DialogContentText sx={{ color: '#475569', fontSize: '0.875rem', m: 0 }}>
                        Are you sure you want to delete this note? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 2, pb: 1.5, pt: 0 }}>
                    <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#64748b', fontWeight: 600, minWidth: 'auto', px: 1.5 }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} variant="contained" color="error" sx={{ fontWeight: 600, borderRadius: '8px', textTransform: 'none', minWidth: 'auto', px: 1.5 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}