import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';

const activities = [
  {
    user: 'Alice Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    action: 'completed',
    item: 'API Integration Module',
    time: '2 hours ago',
    details: 'Merged to production',
    type: 'completed',
  },
  {
    user: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    action: 'created',
    item: 'Design System Documentation',
    time: '4 hours ago',
    details: 'Added 25 new components',
    type: 'created',
  },
  {
    user: 'Carol Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    action: 'assigned',
    item: 'Mobile App Testing',
    time: '6 hours ago',
    details: 'Assigned to David Lee',
    type: 'assigned',
  },
  {
    user: 'David Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    action: 'updated',
    item: 'Q3 Planning Document',
    time: '8 hours ago',
    details: 'Updated timeline',
    type: 'updated',
  },
  {
    user: 'Eve Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    action: 'commented',
    item: 'Design Review Session',
    time: '10 hours ago',
    details: '3 new comments',
    type: 'commented',
  },
  {
    user: 'Frank Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    action: 'archived',
    item: 'Old Project Files',
    time: '12 hours ago',
    details: 'Moved to archive',
    type: 'archived',
  },
];

const getActionColor = (type) => {
  switch (type) {
    case 'completed':
      return '#10b981';
    case 'created':
      return '#7c3aed';
    case 'assigned':
      return '#06b6d4';
    case 'updated':
      return '#f59e0b';
    case 'commented':
      return '#3b82f6';
    case 'archived':
      return '#94a3b8';
    default:
      return '#64748b';
  }
};

export default function Activity() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          📋 Activity Log
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          Track all team activities and changes
        </Typography>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            placeholder="Search activities..."
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select fullWidth defaultValue="all" size="small">
            <MenuItem value="all">All Activities</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="updated">Updated</MenuItem>
            <MenuItem value="commented">Commented</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Timeline */}
      <Stack spacing={2}>
        {activities.map((activity, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Timeline dot */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getActionColor(activity.type),
                      boxShadow: `0 0 0 4px rgba(${
                        activity.type === 'completed'
                          ? '16, 185, 129'
                          : activity.type === 'created'
                          ? '124, 58, 237'
                          : activity.type === 'assigned'
                          ? '6, 182, 212'
                          : activity.type === 'updated'
                          ? '245, 158, 11'
                          : activity.type === 'commented'
                          ? '59, 130, 246'
                          : '148, 163, 184'
                      }, 0.1)`,
                    }}
                  />
                  {index !== activities.length - 1 && (
                    <Box sx={{ width: 2, height: 60, backgroundColor: '#e2e8f0', my: 1 }} />
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar src={activity.avatar} sx={{ width: 36, height: 36 }} />
                    <Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b', display: 'inline' }}>
                          {activity.user}
                        </Typography>
                        <Typography sx={{ color: '#64748b', display: 'inline', mx: 1 }}>
                          {activity.action}
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#7c3aed', display: 'inline' }}>
                          {activity.item}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mt: 0.5 }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ ml: 5 }}>
                    <Chip
                      label={activity.details}
                      size="small"
                      sx={{
                        backgroundColor: `rgba(${
                          activity.type === 'completed'
                            ? '16, 185, 129'
                            : activity.type === 'created'
                            ? '124, 58, 237'
                            : activity.type === 'assigned'
                            ? '6, 182, 212'
                            : activity.type === 'updated'
                            ? '245, 158, 11'
                            : activity.type === 'commented'
                            ? '59, 130, 246'
                            : '148, 163, 184'
                        }, 0.1)`,
                        color: getActionColor(activity.type),
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
