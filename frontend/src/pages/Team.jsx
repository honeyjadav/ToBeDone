import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const teamMembers = [
  { id: 1, name: 'Alice Chen', role: 'Tech Lead', department: 'Engineering', email: 'alice@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', status: 'Active', joinDate: 'Jan 2024' },
  { id: 2, name: 'Bob Smith', role: 'Senior Designer', department: 'Design', email: 'bob@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', status: 'Active', joinDate: 'Feb 2024' },
  { id: 3, name: 'Carol Davis', role: 'Product Manager', department: 'Product', email: 'carol@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol', status: 'Active', joinDate: 'Mar 2024' },
  { id: 4, name: 'David Lee', role: 'Backend Engineer', department: 'Engineering', email: 'david@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', status: 'Active', joinDate: 'Jan 2024' },
  { id: 5, name: 'Eve Johnson', role: 'UI/UX Designer', department: 'Design', email: 'eve@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve', status: 'Active', joinDate: 'Apr 2024' },
  { id: 6, name: 'Frank Miller', role: 'DevOps Engineer', department: 'Engineering', email: 'frank@cloudcollab.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank', status: 'Inactive', joinDate: 'Feb 2024' },
];

export default function Team() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            👥 Team Members
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Manage your team and collaborate effectively
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
          }}
        >
          Invite Member
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            placeholder="Search team members..."
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
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <Grid container spacing={3}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 1,
                      border: '3px solid #e2e8f0',
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
                        {member.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: 600 }}>
                        {member.role}
                      </Typography>
                    </Box>
                    <Button size="small" sx={{ color: '#94a3b8' }}>
                      <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
                    </Button>
                  </Box>
                </Box>

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Chip
                    label={member.department}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      color: '#7c3aed',
                      width: 'fit-content',
                    }}
                  />
                  <Chip
                    label={member.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        member.status === 'Active'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(148, 163, 184, 0.1)',
                      color: member.status === 'Active' ? '#10b981' : '#94a3b8',
                      width: 'fit-content',
                    }}
                  />
                </Stack>

                <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 1 }}>
                    Joined {member.joinDate}
                  </Typography>
                  <Button
                    fullWidth
                    startIcon={<EmailIcon />}
                    sx={{
                      color: '#7c3aed',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {member.email}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
