import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PRIORITIES = ['High', 'Medium', 'Low'];
const ASSIGNEES = ['JD', 'AK', 'RS'];

export default function AddTask({ open, onClose, onAdd, columns, defaultColumn }) {
    const [title, setTitle] = useState('');
    const [column, setColumn] = useState(defaultColumn || columns[0]);
    const [priority, setPriority] = useState('Medium');
    const [assignee, setAssignee] = useState('JD');

    // Reset the form every time the dialog opens
    useEffect(() => {
        if (open) {
            setTitle('');
            setColumn(defaultColumn || columns[0]);
            setPriority('Medium');
            setAssignee('JD');
        }
    }, [open, defaultColumn, columns]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onAdd({ title: title.trim(), column, priority, assignee });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1e293b',
                }}
            >
                Add New Task
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                    autoFocus
                    label="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                    }}
                    fullWidth
                    size="small"
                />

                <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select label="Status" value={column} onChange={(e) => setColumn(e.target.value)}>
                        {columns.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        {PRIORITIES.map((p) => (
                            <MenuItem key={p} value={p}>{p}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Assignee</InputLabel>
                    <Select label="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                        {ASSIGNEES.map((a) => (
                            <MenuItem key={a} value={a}>{a}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748b' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#7c3aed',
                        '&:hover': { backgroundColor: '#6d28d9' },
                    }}
                >
                    Add Task
                </Button>
            </DialogActions>
        </Dialog>
    );
}