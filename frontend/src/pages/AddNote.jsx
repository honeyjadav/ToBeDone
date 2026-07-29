import { useEffect, useRef, useState } from 'react';
import { Dialog, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export const NOTE_COLORS = [
    '#fff9c4', '#fce4ec', '#e3f2fd', '#e8f5e9', '#fff3e0',
    '#ede7f6', '#e0f7fa', '#fbe9e7', '#f3e5f5', '#f1f8e9',
];

const DIALOG_HEIGHT = 560;

export default function AddNote({ open, onClose, onSave, note }) {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState(NOTE_COLORS[0]);
    const editorRef = useRef(null);
    const isEditMode = Boolean(note);

    useEffect(() => {
        if (!open) return;
        if (note) {
            setTitle(note.title || '');
            setColor(note.color || NOTE_COLORS[0]);
            if (editorRef.current) editorRef.current.innerHTML = note.content || '';
        } else {
            setTitle('');
            setColor(NOTE_COLORS[0]);
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [open, note]);

    const applyFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current?.focus();
    };

    const handleClose = () => {
        setTitle('');
        setColor(NOTE_COLORS[0]);
        if (editorRef.current) editorRef.current.innerHTML = '';
        onClose();
    };

    const handleSave = () => {
        const content = editorRef.current ? editorRef.current.innerHTML : '';
        if (!title.trim() && !content.trim()) {
            handleClose();
            return;
        }
        onSave({ id: note?.id, title: title.trim(), color, content });
        handleClose();
    };

    const toolbarButtons = [
        { icon: <FormatBoldIcon sx={{ fontSize: 18 }} />, command: 'bold' },
        { icon: <FormatItalicIcon sx={{ fontSize: 18 }} />, command: 'italic' },
        { icon: <FormatUnderlinedIcon sx={{ fontSize: 18 }} />, command: 'underline' },
        { icon: <FormatListBulletedIcon sx={{ fontSize: 18 }} />, command: 'insertUnorderedList' },
        { icon: <FormatListNumberedIcon sx={{ fontSize: 18 }} />, command: 'insertOrderedList' },
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '14px',
                    backgroundColor: color,
                    transition: 'background-color 0.2s ease',
                    height: `${DIALOG_HEIGHT}px`,
                    maxHeight: `${DIALOG_HEIGHT}px`,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>
                        {isEditMode ? 'Note' : 'New Note'}
                    </Typography>
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: false,
                        sx: { fontSize: '18px', fontWeight: 600, color: '#1e293b' },
                    }}
                    sx={{ mb: 2, flexShrink: 0 }}
                />

                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: 1, flexShrink: 0 }}>
                    Note color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                    {NOTE_COLORS.map((c) => (
                        <Box
                            key={c}
                            onClick={() => setColor(c)}
                            sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                backgroundColor: c,
                                cursor: 'pointer',
                                border: color === c ? '2px solid #7c3aed' : '2px solid rgba(0,0,0,0.08)',
                                boxSizing: 'border-box',
                                transition: 'transform 0.15s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                            }}
                        />
                    ))}
                </Box>

                <Box
                    sx={{
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            p: 0.75,
                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                            flexShrink: 0,
                        }}
                    >
                        {toolbarButtons.map((btn) => (
                            <IconButton
                                key={btn.command}
                                size="small"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => applyFormat(btn.command)}
                                sx={{ p: 0.6, color: '#475569' }}
                            >
                                {btn.icon}
                            </IconButton>
                        ))}
                    </Box>
                    <Box
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Write your note..."
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: 'auto',
                            outline: 'none',
                            p: 1.5,
                            fontSize: '13.5px',
                            color: '#1e293b',
                            lineHeight: 1.6,
                            '&:empty:before': {
                                content: 'attr(data-placeholder)',
                                color: '#94a3b8',
                            },
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2.5, flexShrink: 0 }}>
                    <Button
                        onClick={handleClose}
                        sx={{ textTransform: 'none', fontSize: '13.5px', fontWeight: 600, color: '#475569' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#7c3aed',
                            color: '#fff',
                            textTransform: 'none',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            px: 2.5,
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#6d28d9' },
                        }}
                    >
                        {isEditMode ? 'Save Changes' : 'Save Note'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}