import { useState } from 'react';
import {
    TextField,
    MenuItem,
    Select,
    FormControl,
    Box,
    Typography,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ScienceIcon from '@mui/icons-material/Science';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Drawer from '../components/Drawer';

const WORK_ITEM_TYPES = ['Bug', 'Feature', 'Task', 'Test Case', 'User Story'];
const TYPE_CONFIG = {
    Bug: { icon: BugReportIcon, color: '#cc293d' },
    Feature: { icon: EmojiEventsIcon, color: '#773b93' },
    Task: { icon: AssignmentTurnedInIcon, color: '#f2cb1d' },
    'Test Case': { icon: ScienceIcon, color: '#037e42' },
    'User Story': { icon: AutoStoriesIcon, color: '#009ccc' },
};
const STATES = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const FIELD_CONTROL_SX = {
    fontSize: '13px',
    fontWeight: 400,
    '& .MuiInputBase-input, & .MuiSelect-select': { fontSize: '13px', fontWeight: 400 },
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
};

const getToday = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
};

// Message updated per request — was "Due date cannot be in the past."
const getDueDateError = (value) => (
    value && value < getToday() ? 'Choose today or a future date.' : ''
);

// Shared label element so every field's title is styled identically
const FieldLabel = ({ children }) => (
    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#334155', mb: 0.75 }}>
        {children}
    </Typography>
);

export default function AddTask({ open, onClose, onAdd, onSave, task, defaultColumn, members = [] }) {
    const isEditMode = Boolean(task);
    const initialDueDate = task?.dueDate ? String(task.dueDate).slice(0, 10) : '';
    const [title, setTitle] = useState(() => task?.title || '');
    const [type, setType] = useState(() => task?.type || 'Task');
    const [column, setColumn] = useState(() => task?.column || task?.status || defaultColumn || STATES[0]);
    const [priority, setPriority] = useState(() => task?.priority || 'Medium');
    const [assigneeId, setAssigneeId] = useState(() => task?.assigneeId || members[0]?.userId || '');
    const [area, setArea] = useState(() => task?.area || 'ToBeDone');
    const [description, setDescription] = useState(() => task?.description || '');
    const [tags, setTags] = useState(() => (Array.isArray(task?.tags) ? task.tags.join(', ') : ''));
    const [dueDate, setDueDate] = useState(() => initialDueDate);
    const [dueDateError, setDueDateError] = useState(() => getDueDateError(initialDueDate));

    const handleSubmit = () => {
        if (!title.trim() || dueDateError) return;

        const payload = {
            id: task?.id,
            title: title.trim(),
            type,
            column,
            priority,
            assigneeId,
            assignee: members.find((member) => (member.userId || member._id) === assigneeId)?.name || '',
            area,
            description,
            tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            dueDate: dueDate || undefined,
        };

        if (isEditMode && onSave) {
            onSave(payload);
        } else if (onAdd) {
            onAdd(payload);
        }

        onClose();
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title={isEditMode ? 'Edit Work Item' : 'New Work Item'}
            width={460}
            primaryAction={{
                label: isEditMode ? 'Update' : 'Add',
                onClick: handleSubmit,
                disabled: !title.trim() || Boolean(dueDateError),
            }}
            secondaryAction={{
                label: 'Cancel',
                onClick: onClose,
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                    <FieldLabel>Work Item Type</FieldLabel>
                    <FormControl fullWidth size="small">
                        <Select value={type} onChange={(e) => setType(e.target.value)} sx={FIELD_CONTROL_SX}>
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
                </Box>

                <Box>
                    <FieldLabel>Title</FieldLabel>
                    <TextField
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        fullWidth
                        size="small"
                        sx={FIELD_CONTROL_SX}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>State</FieldLabel>
                        <FormControl fullWidth size="small">
                            <Select value={column} onChange={(e) => setColumn(e.target.value)} sx={FIELD_CONTROL_SX}>
                                {STATES.map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Priority</FieldLabel>
                        <FormControl fullWidth size="small">
                            <Select value={priority} onChange={(e) => setPriority(e.target.value)} sx={FIELD_CONTROL_SX}>
                                {PRIORITIES.map((p) => (
                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Assigned To</FieldLabel>
                        <FormControl fullWidth size="small">
                            <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} sx={FIELD_CONTROL_SX}>
                                {members.length ? members.map((member) => (
                                    <MenuItem key={member.userId || member._id} value={member.userId || member._id}>
                                        {member.name}
                                    </MenuItem>
                                )) : (
                                    <MenuItem value="">No members available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Area</FieldLabel>
                        <TextField
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            fullWidth
                            size="small"
                            sx={FIELD_CONTROL_SX}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Due Date</FieldLabel>
                        <TextField
                            type="date"
                            value={dueDate}
                            onChange={(e) => {
                                const value = e.target.value;
                                setDueDate(value);
                                setDueDateError(getDueDateError(value));
                            }}
                            inputProps={{ min: getToday() }}
                            error={Boolean(dueDateError)}
                            helperText={dueDateError || 'Pick a deadline to keep this on track.'}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={FIELD_CONTROL_SX}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Tags</FieldLabel>
                        <TextField
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="auth, frontend"
                            fullWidth
                            size="small"
                            sx={FIELD_CONTROL_SX}
                        />
                    </Box>
                </Box>

                <Box>
                    <FieldLabel>Description</FieldLabel>
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        size="small"
                        sx={FIELD_CONTROL_SX}
                    />
                </Box>
            </Box>
        </Drawer>
    );
}