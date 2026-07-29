import { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Checkbox,
    ListItemText,
    Drawer,
    TextField,
    Select,
    InputLabel,
    FormControl,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Close';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ScienceIcon from '@mui/icons-material/Science';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddTask from '../pages/AddTask';

const COLUMNS = ['Backlog', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const WORK_ITEM_TYPES = ['Bug', 'Feature', 'Task', 'Test Case', 'User Story'];

const COLUMN_COLORS = {
    Backlog: '#94a3b8',
    'In Progress': '#3b82f6',
    'In Review': '#f59e0b',
    Done: '#22c55e',
};

const PRIORITY_COLORS = {
    High: { bg: '#fee2e2', color: '#dc2626' },
    Medium: { bg: '#fef3c7', color: '#d97706' },
    Low: { bg: '#dcfce7', color: '#16a34a' },
};

const TYPE_CONFIG = {
    Bug: { icon: BugReportIcon, color: '#cc293d' },
    Feature: { icon: EmojiEventsIcon, color: '#773b93' },
    Task: { icon: AssignmentTurnedInIcon, color: '#f2cb1d' },
    'Test Case': { icon: ScienceIcon, color: '#037e42' },
    'User Story': { icon: AutoStoriesIcon, color: '#009ccc' },
};

const initialTasks = [
    { id: 'TB-101', type: 'Task', title: 'Set up authentication flow', description: 'Implement JWT-based login/signup flow with protected routes.', column: 'Done', priority: 'High', assignee: 'JD', area: 'ToBeDone\\Auth', tags: ['auth'], archived: false },
    { id: 'TB-102', type: 'User Story', title: 'Design dashboard wireframes', description: 'Create low-fidelity wireframes for the main dashboard.', column: 'Done', priority: 'Medium', assignee: 'AK', area: 'ToBeDone\\Design', tags: ['ui'], archived: false },
    { id: 'TB-103', type: 'Feature', title: 'Build sticky notes feature', description: 'Add drag-and-drop sticky notes to the dashboard.', column: 'In Progress', priority: 'High', assignee: 'JD', area: 'ToBeDone\\Notes', tags: ['frontend'], archived: false },
    { id: 'TB-104', type: 'Feature', title: 'Integrate AI digest summary', description: 'Summarize daily activity using an AI digest widget.', column: 'In Progress', priority: 'Medium', assignee: 'RS', area: 'ToBeDone\\AI', tags: ['ai'], archived: false },
    { id: 'TB-105', type: 'Bug', title: 'Fix sidebar overlap on header', description: 'Sidebar overlaps header on collapse/expand transition.', column: 'In Review', priority: 'High', assignee: 'JD', area: 'ToBeDone\\Layout', tags: ['bug', 'css'], archived: false },
    { id: 'TB-106', type: 'Test Case', title: 'Write unit tests for chat module', description: 'Add Jest tests covering the chat send/receive flow.', column: 'In Review', priority: 'Low', assignee: 'AK', area: 'ToBeDone\\Chat', tags: ['testing'], archived: false },
    { id: 'TB-107', type: 'User Story', title: 'Plan Q3 roadmap', description: 'Draft the roadmap doc for Q3 deliverables.', column: 'Backlog', priority: 'Low', assignee: 'RS', area: 'ToBeDone\\Planning', tags: [], archived: false },
    { id: 'TB-108', type: 'Task', title: 'Research push notification providers', description: 'Compare FCM vs OneSignal vs Pusher for push notifications.', column: 'Backlog', priority: 'Medium', assignee: 'JD', area: 'ToBeDone\\Infra', tags: ['research'], archived: false },
];

let idCounter = 109;

// ---------- Filter dropdown (Azure-style checkbox pill) ----------
function FilterDropdown({ label, options, selected, onToggle, renderOption }) {
    const [anchor, setAnchor] = useState(null);
    return (
        <>
            <Button
                onClick={(e) => setAnchor(e.currentTarget)}
                endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                sx={{
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: selected.length ? '#7c3aed' : '#334155',
                    backgroundColor: selected.length ? '#f3f0fe' : '#ffffff',
                    border: '1px solid',
                    borderColor: selected.length ? '#ddd6fe' : '#e2e8f0',
                    borderRadius: '8px',
                    px: 1.5,
                    height: '36px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}
            >
                {label}{selected.length ? ` (${selected.length})` : ''}
            </Button>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                {options.map((opt) => (
                    <MenuItem key={opt} onClick={() => onToggle(opt)} sx={{ py: 0.25 }}>
                        <Checkbox size="small" checked={selected.includes(opt)} sx={{ p: 0.5, mr: 0.5 }} />
                        <ListItemText primary={renderOption ? renderOption(opt) : opt} primaryTypographyProps={{ fontSize: '13px' }} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

// ---------- Table ----------
const HEADERS = [
    { key: 'id', label: 'ID', width: '90px' },
    { key: 'title', label: 'Title', width: 'auto' },
    { key: 'column', label: 'State', width: '140px' },
    { key: 'area', label: 'Area', width: '160px' },
    { key: 'tags', label: 'Tags', width: '160px' },
    { key: 'assignee', label: 'Assigned To', width: '150px' },
];

function TaskTable({ tasks, selected, onToggleSelect, onToggleSelectAll, onRowClick }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (key) => {
        if (key === 'tags') return;
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (!sortKey) return 0;
        const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const allSelected = tasks.length > 0 && tasks.every((t) => selected.includes(t.id));
    const someSelected = tasks.some((t) => selected.includes(t.id));

    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Header row (fixed, does not scroll) */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', flexShrink: 0 }}>
                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() => onToggleSelectAll(tasks.map((t) => t.id))}
                    />
                </Box>
                <Box sx={{ width: '36px' }} />
                {HEADERS.map((h) => (
                    <Box
                        key={h.key}
                        onClick={() => handleSort(h.key)}
                        sx={{
                            width: h.width,
                            flex: h.width === 'auto' ? 1 : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 1.25,
                            cursor: h.key === 'tags' ? 'default' : 'pointer',
                            userSelect: 'none',
                            '&:hover': h.key === 'tags' ? {} : { backgroundColor: '#f1f5f9' },
                        }}
                    >
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                            {h.label}
                        </Typography>
                        {sortKey === h.key && (
                            sortDir === 'asc'
                                ? <ArrowUpwardIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                                : <ArrowDownwardIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Scrollable rows */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {sortedTasks.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>No work items to show</Typography>
                    </Box>
                ) : (
                    sortedTasks.map((task) => {
                        const TypeIcon = TYPE_CONFIG[task.type]?.icon;
                        const typeColor = TYPE_CONFIG[task.type]?.color || '#94a3b8';
                        const isChecked = selected.includes(task.id);
                        return (
                            <Box
                                key={task.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #f1f5f9',
                                    cursor: 'pointer',
                                    backgroundColor: isChecked ? '#f5f3ff' : 'transparent',
                                    '&:hover': { backgroundColor: isChecked ? '#f5f3ff' : '#f8fafc' },
                                    '&:last-of-type': { borderBottom: 'none' },
                                }}
                            >
                                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center', py: 1 }}>
                                    <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => onToggleSelect(task.id)}
                                    />
                                </Box>
                                <Box sx={{ width: '36px', display: 'flex', justifyContent: 'center' }} onClick={() => onRowClick(task)}>
                                    {TypeIcon && <TypeIcon sx={{ fontSize: 17, color: typeColor }} />}
                                </Box>
                                <Box sx={{ width: '90px', px: 1.5, py: 1.25 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>{task.id}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, px: 1.5, py: 1.25, minWidth: 0 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 500, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {task.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '140px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => onRowClick(task)}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLUMN_COLORS[task.column], flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '13px', color: '#334155' }}>{task.column}</Typography>
                                </Box>
                                <Box sx={{ width: '160px', px: 1.5, py: 1.25 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {task.area}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '160px', px: 1.5, py: 1.25, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {(task.tags || []).map((tag) => (
                                        <Chip key={tag} label={tag} size="small" sx={{ height: '18px', fontSize: '10.5px', backgroundColor: '#f1f5f9', color: '#475569' }} />
                                    ))}
                                </Box>
                                <Box sx={{ width: '150px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => onRowClick(task)}>
                                    <Avatar sx={{ width: 22, height: 22, fontSize: '10px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                                        {task.assignee}
                                    </Avatar>
                                    <Typography sx={{ fontSize: '13px', color: '#475569' }}>{task.assignee}</Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}

// ---------- Right-side drawer ----------
function TaskDrawer({ task, onClose, onSave, onArchive, onDelete }) {
    const [draft, setDraft] = useState(task);
    const [tagInput, setTagInput] = useState('');

    if (!task) return null;
    if (draft?.id !== task.id) setDraft(task);

    const TypeIcon = TYPE_CONFIG[draft.type]?.icon;
    const typeColor = TYPE_CONFIG[draft.type]?.color || '#94a3b8';

    const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

    const addTag = () => {
        const val = tagInput.trim();
        if (val && !draft.tags?.includes(val)) {
            update('tags', [...(draft.tags || []), val]);
        }
        setTagInput('');
    };

    const removeTag = (tag) => update('tags', draft.tags.filter((t) => t !== tag));

    const handleSave = () => {
        onSave(draft);
        onClose();
    };

    return (
        <Drawer anchor="right" open={Boolean(task)} onClose={onClose}>
            <Box sx={{ width: 440, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 2, borderBottom: '1px solid #e2e8f0' }}>
                    {TypeIcon && <TypeIcon sx={{ fontSize: 20, color: typeColor }} />}
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>{draft.id}</Typography>
                    <Box sx={{ flex: 1 }} />
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField label="Title" value={draft.title} onChange={(e) => update('title', e.target.value)} fullWidth size="small" />

                    <FormControl fullWidth size="small">
                        <InputLabel>Work Item Type</InputLabel>
                        <Select label="Work Item Type" value={draft.type} onChange={(e) => update('type', e.target.value)}>
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

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>State</InputLabel>
                            <Select label="State" value={draft.column} onChange={(e) => update('column', e.target.value)}>
                                {COLUMNS.map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Priority</InputLabel>
                            <Select label="Priority" value={draft.priority} onChange={(e) => update('priority', e.target.value)}>
                                {PRIORITIES.map((p) => (
                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Assigned To</InputLabel>
                            <Select label="Assigned To" value={draft.assignee} onChange={(e) => update('assignee', e.target.value)}>
                                {['JD', 'AK', 'RS'].map((a) => (
                                    <MenuItem key={a} value={a}>{a}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Area" value={draft.area} onChange={(e) => update('area', e.target.value)} fullWidth size="small" />
                    </Box>

                    <Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: 0.75 }}>Tags</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                            {(draft.tags || []).map((tag) => (
                                <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(tag)} sx={{ fontSize: '12px' }} />
                            ))}
                        </Box>
                        <TextField
                            placeholder="Add a tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                            fullWidth
                            size="small"
                        />
                    </Box>

                    <Divider />

                    <TextField
                        label="Description"
                        value={draft.description || ''}
                        onChange={(e) => update('description', e.target.value)}
                        fullWidth
                        multiline
                        minRows={6}
                        size="small"
                    />
                </Box>

                <Box sx={{ borderTop: '1px solid #e2e8f0', px: 2.5, py: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={handleSave} variant="contained" sx={{ textTransform: 'none', backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}>
                        Save
                    </Button>
                    <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748b' }}>Discard</Button>
                    <Box sx={{ flex: 1 }} />
                    <IconButton onClick={() => { onArchive(draft.id); onClose(); }} size="small" title="Archive" sx={{ color: '#64748b' }}>
                        <ArchiveOutlinedIcon sx={{ fontSize: 19 }} />
                    </IconButton>
                    <IconButton onClick={() => { onDelete(draft.id); onClose(); }} size="small" title="Delete" sx={{ color: '#dc2626' }}>
                        <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                    </IconButton>
                </Box>
            </Box>
        </Drawer>
    );
}

// ---------- Main page ----------
export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState([]);
    const [stateFilter, setStateFilter] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const [selected, setSelected] = useState([]);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const hasActiveFilters = search || typeFilter.length || priorityFilter.length || stateFilter.length;
    const visibleTasks = tasks.filter((t) => (showArchived ? t.archived : !t.archived));

    const filteredTasks = visibleTasks.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter.length === 0 || typeFilter.includes(t.type);
        const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(t.priority);
        const matchesState = stateFilter.length === 0 || stateFilter.includes(t.column);
        return matchesSearch && matchesType && matchesPriority && matchesState;
    });

    const toggleFilter = (setter) => (val) => setter((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

    const clearFilters = () => {
        setSearch('');
        setTypeFilter([]);
        setPriorityFilter([]);
        setStateFilter([]);
    };

    const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleSelectAll = (ids) => {
        const allSelected = ids.every((id) => selected.includes(id));
        setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
    };

    const handleAddTask = (newFields) => {
        const newTask = { id: `TB-${idCounter++}`, archived: false, ...newFields };
        setTasks((prev) => [...prev, newTask]);
    };

    const handleSaveTask = (updated) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    };

    const handleArchiveOne = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, archived: true } : t)));
        setSelected((prev) => prev.filter((x) => x !== id));
    };

    const handleUnarchiveOne = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, archived: false } : t)));
        setSelected((prev) => prev.filter((x) => x !== id));
    };

    const handleDeleteOne = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setSelected((prev) => prev.filter((x) => x !== id));
    };

    const handleArchiveSelected = () => {
        setTasks((prev) => prev.map((t) => (selected.includes(t.id) ? { ...t, archived: !showArchived } : t)));
        setSelected([]);
    };

    const hasSelection = selected.length > 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, minHeight: 0 }}>
            {/* Title */}
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', mb: 2, flexShrink: 0 }}>
                Tasks
            </Typography>

            {/* Filter bar + action buttons, all in one row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, height: '36px', minWidth: '220px' }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <input
                        placeholder="Filter by keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }}
                    />
                </Box>

                <FilterDropdown
                    label="Type"
                    options={WORK_ITEM_TYPES}
                    selected={typeFilter}
                    onToggle={toggleFilter(setTypeFilter)}
                    renderOption={(t) => {
                        const Icon = TYPE_CONFIG[t].icon;
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Icon sx={{ fontSize: 15, color: TYPE_CONFIG[t].color }} />
                                {t}
                            </Box>
                        );
                    }}
                />
                <FilterDropdown label="State" options={COLUMNS} selected={stateFilter} onToggle={toggleFilter(setStateFilter)} />
                <FilterDropdown
                    label="Priority"
                    options={PRIORITIES}
                    selected={priorityFilter}
                    onToggle={toggleFilter(setPriorityFilter)}
                    renderOption={(p) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: PRIORITY_COLORS[p].color }} />
                            {p}
                        </Box>
                    )}
                />

                {hasActiveFilters && (
                    <Button onClick={clearFilters} startIcon={<ClearIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 600, color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }}>
                        Clear
                    </Button>
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={() => { setShowArchived((v) => !v); setSelected([]); }}
                    startIcon={<ArchiveOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: showArchived ? '#7c3aed' : '#64748b',
                        backgroundColor: showArchived ? '#f3f0fe' : 'transparent',
                        border: '1px solid',
                        borderColor: showArchived ? '#ddd6fe' : '#e2e8f0',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                    }}
                >
                    {showArchived ? 'View Active' : 'View Archived'}
                </Button>

                <Button
                    onClick={handleArchiveSelected}
                    disabled={!hasSelection}
                    startIcon={<ArchiveOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: hasSelection ? '#dc2626' : '#64748b',
                        backgroundColor: hasSelection ? '#fee2e2' : 'transparent',
                        border: '1px solid',
                        borderColor: hasSelection ? '#fecaca' : '#e2e8f0',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: hasSelection ? '#fecaca' : '#f1f5f9' },
                        '&:disabled': { color: '#cbd5e1', borderColor: '#e2e8f0' },
                    }}
                >
                    {showArchived ? 'Restore' : 'Archive'}{selected.length ? ` (${selected.length})` : ''}
                </Button>

                <Button
                    onClick={() => setAddTaskOpen(true)}
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        backgroundColor: '#7c3aed',
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: '#6d28d9' },
                    }}
                >
                    Add Task
                </Button>
            </Box>

            {/* Table takes remaining height and scrolls internally */}
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <TaskTable
                    tasks={filteredTasks}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onRowClick={(task) => setActiveTask(task)}
                />
            </Box>

            <AddTask open={addTaskOpen} onClose={() => setAddTaskOpen(false)} onAdd={handleAddTask} />

            <TaskDrawer
                task={activeTask}
                onClose={() => setActiveTask(null)}
                onSave={handleSaveTask}
                onArchive={showArchived ? handleUnarchiveOne : handleArchiveOne}
                onDelete={handleDeleteOne}
            />
        </Box>
    );
}