import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Button,
    Checkbox,
    ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ScienceIcon from '@mui/icons-material/Science';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddTask from '../pages/AddTask';
import APICallService from '../services/APICallService';
import { useAuth } from '../hooks/useAuth';
import { getAppSettings } from '../utils/preferences';

const COLUMNS = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const WORK_ITEM_TYPES = ['Bug', 'Feature', 'Task', 'Test Case', 'User Story'];

const COLUMN_COLORS = {
    'To Do': '#94a3b8',
    'In Progress': '#3b82f6',
    Done: '#22c55e',
};

const PRIORITY_COLORS = {
    High: { bg: '#fee2e2', color: '#dc2626', darkBg: '#7f1d1d', darkColor: '#fca5a5' },
    Medium: { bg: '#fef3c7', color: '#d97706', darkBg: '#78350f', darkColor: '#fcd34d' },
    Low: { bg: '#dcfce7', color: '#16a34a', darkBg: '#14532d', darkColor: '#86efac' },
};

const TYPE_CONFIG = {
    Bug: { icon: BugReportIcon, color: '#cc293d' },
    Feature: { icon: EmojiEventsIcon, color: '#773b93' },
    Task: { icon: AssignmentTurnedInIcon, color: '#f2cb1d' },
    'Test Case': { icon: ScienceIcon, color: '#037e42' },
    'User Story': { icon: AutoStoriesIcon, color: '#009ccc' },
};

// Thin scrollbar, same treatment as the chat panel
const THIN_SCROLLBAR_SX = (darkMode) => ({
    '&::-webkit-scrollbar': { width: '6px', height: '6px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '999px' },
    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: darkMode ? '#475569' : '#94a3b8' },
    scrollbarWidth: 'thin',
    scrollbarColor: darkMode ? '#334155 transparent' : '#cbd5e1 transparent',
});

// ---------- Filter dropdown (Azure-style checkbox pill) ----------
function FilterDropdown({ label, options, selected, onToggle, renderOption, darkMode }) {
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
                    color: selected.length ? (darkMode ? '#c4b5fd' : '#7c3aed') : (darkMode ? '#e2e8f0' : '#334155'),
                    backgroundColor: selected.length ? (darkMode ? '#2e1065' : '#f3f0fe') : (darkMode ? '#0f172a' : '#ffffff'),
                    border: '1px solid',
                    borderColor: selected.length ? (darkMode ? '#4c1d95' : '#ddd6fe') : (darkMode ? '#334155' : '#e2e8f0'),
                    borderRadius: '8px',
                    px: 1.5,
                    height: '36px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}
            >
                {label}{selected.length ? ` (${selected.length})` : ''}
            </Button>
            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                        color: darkMode ? '#f8fafc' : '#1e293b',
                        border: darkMode ? '1px solid #334155' : 'none',
                    },
                }}
            >
                {options.map((opt) => (
                    <MenuItem key={opt} onClick={() => onToggle(opt)} sx={{ py: 0.25, '&:hover': { backgroundColor: darkMode ? '#334155' : undefined } }}>
                        <Checkbox
                            size="small"
                            checked={selected.includes(opt)}
                            sx={{ p: 0.5, mr: 0.5, color: darkMode ? '#94a3b8' : undefined, '&.Mui-checked': { color: '#7c3aed' } }}
                        />
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
    { key: 'type', label: 'Type', width: '120px' },
    { key: 'title', label: 'Title', width: 'auto' },
    { key: 'priority', label: 'Priority', width: '110px' },
    { key: 'column', label: 'State', width: '140px' },
    { key: 'area', label: 'Area', width: '160px' },
    { key: 'assignee', label: 'Assigned To', width: '150px' },
];

function TaskTable({ tasks, selected, onToggleSelect, onToggleSelectAll, onRowClick, darkMode }) {
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
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Header row (fixed, does not scroll) */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, backgroundColor: darkMode ? '#1e293b' : '#f8fafc', flexShrink: 0 }}>
                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() => onToggleSelectAll(tasks.map((t) => t.id))}
                        sx={{ color: darkMode ? '#64748b' : undefined }}
                    />
                </Box>
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
                            '&:hover': h.key === 'tags' ? {} : { backgroundColor: darkMode ? '#334155' : '#f1f5f9' },
                        }}
                    >
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: darkMode ? '#94a3b8' : '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
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
            <Box sx={{ flex: 1, overflowY: 'auto', ...THIN_SCROLLBAR_SX(darkMode) }}>
                {sortedTasks.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '13px', color: darkMode ? '#64748b' : '#94a3b8' }}>No work items to show</Typography>
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
                                    borderBottom: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}`,
                                    cursor: 'pointer',
                                    backgroundColor: isChecked ? (darkMode ? '#2e1065' : '#f5f3ff') : 'transparent',
                                    '&:hover': { backgroundColor: isChecked ? (darkMode ? '#2e1065' : '#f5f3ff') : (darkMode ? '#1e293b' : '#f8fafc') },
                                    '&:last-of-type': { borderBottom: 'none' },
                                }}
                            >
                                <Box sx={{ width: '44px', display: 'flex', justifyContent: 'center', py: 1 }}>
                                    <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => onToggleSelect(task.id)}
                                        sx={{ color: darkMode ? '#64748b' : undefined }}
                                    />
                                </Box>
                                <Box sx={{ width: '90px', px: 1.5, py: 1.25 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#a78bfa' : '#7c3aed' }}>{task.id}</Typography>
                                </Box>
                                <Box sx={{ width: '120px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }} onClick={() => onRowClick(task)}>
                                    {TypeIcon && <TypeIcon sx={{ fontSize: 15, color: typeColor }} />}
                                    <Typography sx={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#334155' }}>{task.type}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, px: 1.5, py: 1.25, minWidth: 0 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 500, color: darkMode ? '#f8fafc' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {task.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '110px', px: 1.5, py: 1.25 }} onClick={() => onRowClick(task)}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        borderRadius: '999px',
                                        px: 1,
                                        py: 0.35,
                                        backgroundColor: darkMode ? (PRIORITY_COLORS[task.priority]?.darkBg || '#334155') : (PRIORITY_COLORS[task.priority]?.bg || '#f1f5f9'),
                                        color: darkMode ? (PRIORITY_COLORS[task.priority]?.darkColor || '#cbd5e1') : (PRIORITY_COLORS[task.priority]?.color || '#475569'),
                                        fontSize: '11px',
                                        fontWeight: 700,
                                    }}>
                                        {task.priority}
                                    </Box>
                                </Box>
                                <Box sx={{ width: '140px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => onRowClick(task)}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLUMN_COLORS[task.column], flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#334155' }}>{task.column}</Typography>
                                </Box>
                                <Box sx={{ width: '160px', px: 1.5, py: 1.25 }} onClick={() => onRowClick(task)}>
                                    <Typography sx={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {task.area}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '150px', px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => onRowClick(task)}>
                                    <Avatar sx={{ width: 22, height: 22, fontSize: '10px', fontWeight: 700, backgroundColor: darkMode ? '#312e81' : '#ede9fe', color: darkMode ? '#c4b5fd' : '#7c3aed' }}>
                                        {task.assignee?.slice(0, 2).toUpperCase()}
                                    </Avatar>
                                    <Typography sx={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569' }}>{task.assignee}</Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}

// ---------- Main page ----------
const mapStatusToColumn = (status) => {
    if (!status) return 'To Do';
    const normalized = String(status).trim();
    if (normalized === 'Backlog' || normalized === 'In Review') return 'To Do';
    return normalized;
};

const mapColumnToStatus = (column) => {
    const normalized = String(column || 'To Do').trim();
    if (normalized === 'Backlog' || normalized === 'In Review') return 'To Do';
    return normalized;
};

const mapPriorityToUi = (priority) => {
    if (!priority) return 'Medium';
    if (priority === 'Urgent') return 'High';
    return priority;
};

const mapPriorityToApi = (priority) => {
    if (priority === 'High' || priority === 'Low' || priority === 'Medium') return priority;
    return 'Medium';
};

const mapApiTaskToUi = (task, memberLookup = {}) => {
    const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : task.assignedTo ? [task.assignedTo] : [];
    const firstAssigned = assignedUsers[0];
    const assigneeId = firstAssigned && typeof firstAssigned === 'object'
        ? firstAssigned._id || firstAssigned.userId || firstAssigned.id || ''
        : firstAssigned || '';

    return {
        id: task.taskId || task.id || '',
        type: task.type || 'Task',
        title: task.title || '',
        description: task.description || '',
        column: mapStatusToColumn(task.status),
        priority: mapPriorityToUi(task.priority),
        assignee: memberLookup[assigneeId] || (firstAssigned && typeof firstAssigned === 'object' ? firstAssigned.name || 'Unassigned' : 'Unassigned'),
        assigneeId,
        area: task.area || 'ToBeDone',
        tags: Array.isArray(task.tags) ? task.tags : [],
        dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
        archived: Boolean(task.archived),
        raw: task,
    };
};

const mapUiTaskToApi = (task) => ({
    title: task.title,
    type: task.type || 'Task',
    description: task.description || '',
    status: mapColumnToStatus(task.column),
    priority: mapPriorityToApi(task.priority),
    area: task.area || 'ToBeDone',
    tags: Array.isArray(task.tags) ? task.tags : [],
    dueDate: task.dueDate || undefined,
    archived: Boolean(task.archived),
    assignedTo: task.assigneeId ? [task.assigneeId] : undefined,
});

export default function Tasks() {
    const { activeWorkspace } = useAuth();

    // Dark mode, initialized from global settings and kept in sync via events
    const initialSettings = getAppSettings();
    const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

    const [tasks, setTasks] = useState([]);
    const [workspaceMembers, setWorkspaceMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState([]);
    const [stateFilter, setStateFilter] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const [selected, setSelected] = useState([]);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const handleSettingsChange = (event) => {
            const nextSettings = event.detail ?? getAppSettings();
            setDarkMode(Boolean(nextSettings.darkMode));
        };

        window.addEventListener('tobedone-settings-changed', handleSettingsChange);
        return () => window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
    }, []);

    useEffect(() => {
        if (!activeWorkspace?.workspaceId) {
            return;
        }

        let isMounted = true;

        const normalizeList = (payload) => {
            if (Array.isArray(payload)) return payload;
            if (Array.isArray(payload?.data)) return payload.data;
            if (Array.isArray(payload?.data?.data)) return payload.data.data;
            return [];
        };

        // Load members FIRST and build the lookup from the response directly
        // (not from state, which wouldn't have updated yet) so assignee names
        // are correct on the very first render instead of showing "Unassigned".
        const loadMembersThenTasks = async () => {
            let members = [];
            try {
                const membersResponse = await APICallService.getWorkspaceMembers(activeWorkspace.workspaceId);
                members = normalizeList(membersResponse?.data);
                if (isMounted) setWorkspaceMembers(members);
            } catch (error) {
                console.error('Failed to load workspace members:', error);
                if (isMounted) setWorkspaceMembers([]);
            }

            const memberLookup = Object.fromEntries(
                members.map((member) => [(member.userId || member._id), member.name || ''])
            );

            try {
                const tasksResponse = await APICallService.getTasks(activeWorkspace.workspaceId);
                if (!isMounted) return;
                const list = normalizeList(tasksResponse?.data);
                setTasks(list.map((task) => mapApiTaskToUi(task, memberLookup)));
            } catch (error) {
                console.error('Failed to load tasks:', error);
                if (isMounted) setTasks([]);
            }
        };

        loadMembersThenTasks();

        return () => { isMounted = false; };
    }, [activeWorkspace?.workspaceId]);

    const hasWorkspace = Boolean(activeWorkspace?.workspaceId);
    const visibleTasks = (hasWorkspace ? tasks : []).filter((t) => (showArchived ? t.archived : !t.archived));

    const filteredTasks = visibleTasks.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter.length === 0 || typeFilter.includes(t.type);
        const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(t.priority);
        const matchesState = stateFilter.length === 0 || stateFilter.includes(t.column);
        return matchesSearch && matchesType && matchesPriority && matchesState;
    });

    const toggleFilter = (setter) => (val) => setter((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

    const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleSelectAll = (ids) => {
        const allSelected = ids.every((id) => selected.includes(id));
        setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
    };

    const handleAddTask = async (newFields) => {
        if (!activeWorkspace?.workspaceId) return;

        try {
            const response = await APICallService.createTask(activeWorkspace.workspaceId, mapUiTaskToApi(newFields));
            const createdTask = response?.data?.data;
            if (createdTask) {
                setTasks((prev) => [mapApiTaskToUi(createdTask), ...prev]);
            }
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleSaveTask = async (updated) => {
        if (!activeWorkspace?.workspaceId || !updated?.id) return;

        try {
            const response = await APICallService.updateTask(activeWorkspace.workspaceId, updated.id, mapUiTaskToApi(updated));
            const updatedTask = response?.data?.data;
            if (updatedTask) {
                setTasks((prev) => prev.map((t) => (t.id === updated.id ? mapApiTaskToUi(updatedTask) : t)));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleArchiveSelected = async () => {
        if (!activeWorkspace?.workspaceId || !selected.length) return;

        try {
            const nextStatus = showArchived ? 'To Do' : 'Done';
            const nextArchived = !showArchived;
            const selectedTasks = tasks.filter((task) => selected.includes(task.id));

            await Promise.all(selectedTasks.map((task) => APICallService.updateTask(activeWorkspace.workspaceId, task.id, {
                ...mapUiTaskToApi(task),
                status: nextStatus,
                archived: nextArchived,
            })));

            setTasks((prev) => prev.map((task) => (selected.includes(task.id) ? { ...task, archived: !showArchived } : task)));
            setSelected([]);
        } catch (error) {
            console.error('Failed to archive selected tasks:', error);
        }
    };

    const hasSelection = selected.length > 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, minHeight: 0, backgroundColor: darkMode ? '#020817' : '#f8fafc' }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', mb: 2, flexShrink: 0 }}>
                Tasks
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, flexWrap: 'wrap', flexShrink: 0 }}>
                <Button
                    onClick={() => {
                        setEditingTask(null);
                        setAddTaskOpen(true);
                    }}
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

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    px: 1.5,
                    height: '36px',
                    minWidth: '220px',
                }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <input
                        placeholder="Filter by keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '13px',
                            width: '100%',
                            color: darkMode ? '#f8fafc' : 'inherit',
                        }}
                    />
                </Box>

                <FilterDropdown
                    darkMode={darkMode}
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
                <FilterDropdown darkMode={darkMode} label="State" options={COLUMNS} selected={stateFilter} onToggle={toggleFilter(setStateFilter)} />
                <FilterDropdown
                    darkMode={darkMode}
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

                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={() => { setShowArchived((v) => !v); setSelected([]); }}
                    startIcon={<ArchiveOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: showArchived ? (darkMode ? '#c4b5fd' : '#7c3aed') : (darkMode ? '#94a3b8' : '#64748b'),
                        backgroundColor: showArchived ? (darkMode ? '#2e1065' : '#f3f0fe') : 'transparent',
                        border: '1px solid',
                        borderColor: showArchived ? (darkMode ? '#4c1d95' : '#ddd6fe') : (darkMode ? '#334155' : '#e2e8f0'),
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
                        color: hasSelection ? (darkMode ? '#fca5a5' : '#dc2626') : (darkMode ? '#64748b' : '#64748b'),
                        backgroundColor: hasSelection ? (darkMode ? '#7f1d1d' : '#fee2e2') : 'transparent',
                        border: '1px solid',
                        borderColor: hasSelection ? (darkMode ? '#991b1b' : '#fecaca') : (darkMode ? '#334155' : '#e2e8f0'),
                        borderRadius: '8px',
                        height: '36px',
                        flexShrink: 0,
                        '&:hover': { backgroundColor: hasSelection ? (darkMode ? '#991b1b' : '#fecaca') : (darkMode ? '#1e293b' : '#f1f5f9') },
                        '&:disabled': { color: darkMode ? '#475569' : '#cbd5e1', borderColor: darkMode ? '#1e293b' : '#e2e8f0' },
                    }}
                >
                    {showArchived ? 'Restore' : 'Archive'}{selected.length ? ` (${selected.length})` : ''}
                </Button>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <TaskTable
                    darkMode={darkMode}
                    tasks={filteredTasks}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onRowClick={(task) => {
                        setEditingTask(task);
                        setAddTaskOpen(true);
                    }}
                />
            </Box>

            <AddTask
                key={`${editingTask?.id || 'new'}-${addTaskOpen}`}
                open={addTaskOpen}
                onClose={() => {
                    setAddTaskOpen(false);
                    setEditingTask(null);
                }}
                task={editingTask}
                onAdd={handleAddTask}
                onSave={handleSaveTask}
                members={hasWorkspace ? workspaceMembers : []}
            />
        </Box>
    );
}