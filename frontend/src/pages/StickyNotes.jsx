import { useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';

const COLORS = ['#fef08a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#fed7aa', '#ddd6fe'];

const initialNotes = [
    { id: 1, text: 'Finalize the Q3 roadmap before Friday standup', color: '#fef08a', pinned: true },
    { id: 2, text: 'Call design team about the new mockups', color: '#bfdbfe', pinned: false },
    { id: 3, text: 'Remember to review PR #482 \u2014 auth middleware', color: '#bbf7d0', pinned: false },
    { id: 4, text: 'Idea: add keyboard shortcuts to task board', color: '#fbcfe8', pinned: false },
];

let idCounter = 5;

export default function StickyNotes() {
    const [notes, setNotes] = useState(initialNotes);

    const addNote = () => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        setNotes((prev) => [{ id: idCounter++, text: '', color, pinned: false }, ...prev]);
    };

    const updateNote = (id, text) => {
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
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
                    onClick={addNote}
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
                        sx={{
                            backgroundColor: note.color,
                            borderRadius: '10px',
                            p: 2,
                            minHeight: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            transition: 'transform 0.15s ease',
                            '&:hover': { transform: 'translateY(-2px)' },
                            '&:hover .note-actions': { opacity: 1 },
                        }}
                    >
                        <Box className="note-actions" sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.15s ease' }}>
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

                        <textarea
                            value={note.text}
                            onChange={(e) => updateNote(note.id, e.target.value)}
                            placeholder="Write a note..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                resize: 'none',
                                width: '100%',
                                flex: 1,
                                fontFamily: 'inherit',
                                fontSize: '13.5px',
                                color: '#1e293b',
                                marginTop: '18px',
                                lineHeight: 1.5,
                            }}
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
    );
}