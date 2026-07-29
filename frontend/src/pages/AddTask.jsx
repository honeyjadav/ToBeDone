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
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ScienceIcon from '@mui/icons-material/Science';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const WORK_ITEM_TYPES = ['Bug', 'Feature', 'Task', 'Test Case', 'User Story'];
const TYPE_CONFIG = {
    Bug: { icon: BugReportIcon, color: '#cc293d' },
    Feature: { icon: EmojiEventsIcon, color: '#773b93' },
    Task: { icon: AssignmentTurnedInIcon, color: '#f2cb1d' },
    'Test Case': { icon: ScienceIcon, color: '#037e42' },
    'User Story': { icon: AutoStoriesIcon, color: '#009ccc' },
};
const STATES = ['Backlog', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const ASSIGNEES = ['JD', 'AK', 'RS'];

export default function AddTask({ open, onClose, onAdd, defaultColumn }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Task');
    const [column, setColumn] = useState(defaultColumn || STATES[0]);
    const [priority, setPriority] = useState('Medium');
    const [assignee, setAssignee] = useState('JD');
    const [area, setArea] = useState('ToBeDone');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (open) {
            setTitle('');
            setType('Task');
            setColumn(defaultColumn || STATES[0]);
            setPriority('Medium');
            setAssignee('JD');
            setArea('ToBeDone');
            setDescription('');
        }
    }, [open, defaultColumn]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onAdd({ title: title.trim(), type, column, priority, assignee, area, description, tags: [] });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                New Work Item
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Work Item Type</InputLabel>
                    <Select label="Work Item Type" value={type} onChange={(e) => setType(e.target.value)}>
                        {WORK_ITEM_TYPES.map((t) => {
                            const Icon = TYPE_CONFIG[t].icon;
                            return (
                                <MenuItem key={t} value={t}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Icon sx={{ fontSize: 16, color: TYPE_CONFIG[t].color }} />
                                        {t}
                                    </Box>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <TextField
                    autoFocus
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    fullWidth
                    size="small"
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>State</InputLabel>
                        <Select label="State" value={column} onChange={(e) => setColumn(e.target.value)}>
                            {STATES.map((s) => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
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
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Assigned To</InputLabel>
                        <Select label="Assigned To" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                            {ASSIGNEES.map((a) => (
                                <MenuItem key={a} value={a}>{a}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField label="Area" value={area} onChange={(e) => setArea(e.target.value)} fullWidth size="small" />
                </Box>

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                    variant="contained"
                    sx={{ textTransform: 'none', backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}