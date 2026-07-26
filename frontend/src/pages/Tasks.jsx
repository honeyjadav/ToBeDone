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
    Divider,
    Checkbox,
    ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Close';
import AddTask from '../pages/AddTask';

const COLUMNS = ['Backlog', 'In Progress', 'In Review', 'Done'];

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

const PRIORITIES = ['High', 'Medium', 'Low'];

const initialTasks = [
    { id: 'TB-101', title: 'Set up authentication flow', column: 'Done', priority: 'High', assignee: 'JD' },
    { id: 'TB-102', title: 'Design dashboard wireframes', column: 'Done', priority: 'Medium', assignee: 'AK' },
    { id: 'TB-103', title: 'Build sticky notes feature', column: 'In Progress', priority: 'High', assignee: 'JD' },
    { id: 'TB-104', title: 'Integrate AI digest summary', column: 'In Progress', priority: 'Medium', assignee: 'RS' },
    { id: 'TB-105', title: 'Fix sidebar overlap on header', column: 'In Review', priority: 'High', assignee: 'JD' },
    { id: 'TB-106', title: 'Write unit tests for chat module', column: 'In Review', priority: 'Low', assignee: 'AK' },
    { id: 'TB-107', title: 'Plan Q3 roadmap', column: 'Backlog', priority: 'Low', assignee: 'RS' },
    { id: 'TB-108', title: 'Research push notification providers', column: 'Backlog', priority: 'Medium', assignee: 'JD' },
];

let idCounter = 109;

// Small reusable checkbox-dropdown filter, styled like the Azure DevOps pills
function FilterDropdown({ label, options, selected, onToggle, renderOption }) {
    const [anchor, setAnchor] = useState(null);
    const isOpen = Boolean(anchor);

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
                }}
            >
                {label}{selected.length ? ` (${selected.length})` : ''}
            </Button>
            <Menu anchorEl={anchor} open={isOpen} onClose={() => setAnchor(null)}>
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

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState([]);
    const [assigneeFilter, setAssigneeFilter] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuTaskId, setMenuTaskId] = useState(null);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [addTaskColumn, setAddTaskColumn] = useState(null);

    const assigneeOptions = [...new Set(tasks.map((t) => t.assignee))];

    const hasActiveFilters = search || priorityFilter.length > 0 || assigneeFilter.length > 0;

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(t.priority);
        const matchesAssignee = assigneeFilter.length === 0 || assigneeFilter.includes(t.assignee);
        return matchesSearch && matchesPriority && matchesAssignee;
    });

    const togglePriority = (p) =>
        setPriorityFilter((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

    const toggleAssignee = (a) =>
        setAssigneeFilter((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

    const clearFilters = () => {
        setSearch('');
        setPriorityFilter([]);
        setAssigneeFilter([]);
    };

    const openMenu = (e, taskId) => {
        setMenuAnchor(e.currentTarget);
        setMenuTaskId(taskId);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        setMenuTaskId(null);
    };

    const moveTask = (column) => {
        setTasks((prev) => prev.map((t) => (t.id === menuTaskId ? { ...t, column } : t)));
        closeMenu();
    };

    const deleteTask = () => {
        setTasks((prev) => prev.filter((t) => t.id !== menuTaskId));
        closeMenu();
    };

    const handleAddTask = ({ title, column, priority, assignee }) => {
        const newTask = { id: `TB-${idCounter++}`, title, column, priority, assignee };
        setTasks((prev) => [...prev, newTask]);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>Tasks</Typography>
                    <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
                        {tasks.length} tasks across {COLUMNS.length} stages
                    </Typography>
                </Box>

                <Button
                    onClick={() => {
                        setAddTaskColumn(null);
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
                        '&:hover': { backgroundColor: '#6d28d9' },
                    }}
                >
                    Add Task
                </Button>
            </Box>

            {/* Filter bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3, flexWrap: 'wrap' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        px: 1.5,
                        height: '36px',
                        minWidth: '220px',
                    }}
                >
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
                        }}
                    />
                </Box>

                <FilterDropdown
                    label="Priority"
                    options={PRIORITIES}
                    selected={priorityFilter}
                    onToggle={togglePriority}
                    renderOption={(p) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: PRIORITY_COLORS[p].color }} />
                            {p}
                        </Box>
                    )}
                />

                <FilterDropdown
                    label="Assignee"
                    options={assigneeOptions}
                    selected={assigneeFilter}
                    onToggle={toggleAssignee}
                />

                {hasActiveFilters && (
                    <Button
                        onClick={clearFilters}
                        startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            textTransform: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                        }}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            {/* Board */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {COLUMNS.map((column) => {
                    const columnTasks = filteredTasks.filter((t) => t.column === column);
                    return (
                        <Box
                            key={column}
                            sx={{
                                minWidth: '280px',
                                maxWidth: '280px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                flexDirection: 'column',
                                flexShrink: 0,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.75, pt: 1.5, pb: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLUMN_COLORS[column] }} />
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                                    {column}
                                </Typography>
                                <Typography sx={{ fontSize: '12px', color: '#94a3b8', ml: 'auto' }}>
                                    {columnTasks.length}
                                </Typography>
                            </Box>

                            <Box sx={{ px: 1.25, display: 'flex', flexDirection: 'column', gap: 1, pb: 1.25 }}>
                                {columnTasks.map((task) => (
                                    <Box
                                        key={task.id}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            p: 1.25,
                                            cursor: 'pointer',
                                            transition: 'box-shadow 0.15s ease',
                                            '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                                                {task.id}
                                            </Typography>
                                            <IconButton size="small" onClick={(e) => openMenu(e, task.id)} sx={{ p: 0.25, mt: '-4px', mr: '-4px' }}>
                                                <MoreVertIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                            </IconButton>
                                        </Box>

                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', mt: 0.5, mb: 1, lineHeight: 1.4 }}>
                                            {task.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                sx={{
                                                    height: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    backgroundColor: PRIORITY_COLORS[task.priority].bg,
                                                    color: PRIORITY_COLORS[task.priority].color,
                                                }}
                                            />
                                            <Avatar sx={{ width: 22, height: 22, fontSize: '10px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                                                {task.assignee}
                                            </Avatar>
                                        </Box>
                                    </Box>
                                ))}

                                <Button
                                    onClick={() => {
                                        setAddTaskColumn(column);
                                        setAddTaskOpen(true);
                                    }}
                                    startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        fontSize: '12.5px',
                                        fontWeight: 500,
                                        color: '#64748b',
                                        textTransform: 'none',
                                        px: 1,
                                        '&:hover': { backgroundColor: '#f1f5f9' },
                                    }}
                                >
                                    Add task
                                </Button>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', px: 2, py: 0.5, textTransform: 'uppercase' }}>
                    Move to
                </Typography>
                {COLUMNS.map((column) => (
                    <MenuItem key={column} onClick={() => moveTask(column)} sx={{ fontSize: '13px' }}>
                        {column}
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={deleteTask} sx={{ fontSize: '13px', color: '#dc2626' }}>
                    <DeleteOutlineIcon sx={{ fontSize: 16, mr: 1 }} /> Delete task
                </MenuItem>
            </Menu>

            <AddTask
                open={addTaskOpen}
                onClose={() => setAddTaskOpen(false)}
                onAdd={handleAddTask}
                columns={COLUMNS}
                defaultColumn={addTaskColumn}
            />
        </Box>
    );
}