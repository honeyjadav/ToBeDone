import { useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import AddNote, { NOTE_COLORS } from './AddNote';

const initialNotes = [
    { id: 1, title: 'Q3 Roadmap', content: 'Finalize the Q3 roadmap before Friday standup', color: NOTE_COLORS[0], pinned: true },
    { id: 2, title: 'Design Sync', content: 'Call design team about the new mockups', color: NOTE_COLORS[2], pinned: false },
    { id: 3, title: 'Code Review', content: 'Remember to review PR #482 — auth middleware', color: NOTE_COLORS[3], pinned: false },
    { id: 4, title: 'Idea', content: 'Add keyboard shortcuts to task board', color: NOTE_COLORS[1], pinned: false },
];

let idCounter = 5;

const CARD_HEIGHT = 190;

export default function StickyNotes() {
    const [notes, setNotes] = useState(initialNotes);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeNote, setActiveNote] = useState(null);

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

    const saveNote = ({ id, title, color, content }) => {
        if (id) {
            setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, color, content } : n)));
        } else {
            setNotes((prev) => [{ id: idCounter++, title, content, color, pinned: false }, ...prev]);
        }
    };

    const deleteNote = (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    const togglePin = (id) => {
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
    };

    const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: 2,
                }}
            >
                {sortedNotes.map((note) => (
                    <Box
                        key={note.id}
                        onClick={() => openExistingNote(note)}
                        sx={{
                            backgroundColor: note.color,
                            borderRadius: '10px',
                            p: 2,
                            height: `${CARD_HEIGHT}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease',
                            '&:hover': { transform: 'translateY(-2px)' },
                            '&:hover .note-actions': { opacity: 1 },
                        }}
                    >
                        <Box
                            className="note-actions"
                            onClick={(e) => e.stopPropagation()}
                            sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.15s ease' }}
                        >
                            <IconButton size="small" onClick={() => togglePin(note.id)} sx={{ p: 0.4 }}>
                                <PushPinIcon sx={{ fontSize: 15, color: note.pinned ? '#7c3aed' : 'rgba(0,0,0,0.4)', transform: note.pinned ? 'rotate(0deg)' : 'rotate(35deg)' }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteNote(note.id)} sx={{ p: 0.4 }}>
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

            <AddNote open={dialogOpen} onClose={closeDialog} onSave={saveNote} note={activeNote} />
        </Box>
    );
}