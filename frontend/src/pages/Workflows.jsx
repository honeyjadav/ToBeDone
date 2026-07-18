import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddIcon from '@mui/icons-material/Add';

const workflows = [
  { id: 1, name: 'Auto-assign High Priority', trigger: 'Task priority = High', action: 'Assign to Lead', status: true },
  { id: 2, name: 'Notify on Comment', trigger: 'Comment added', action: 'Send notification', status: true },
  { id: 3, name: 'Auto-update Status', trigger: 'All subtasks complete', action: 'Mark as Done', status: true },
  { id: 4, name: 'Slack Integration', trigger: 'Task created', action: 'Post to Slack', status: true },
  { id: 5, name: 'Weekly Digest', trigger: 'Every Monday 9 AM', action: 'Send summary email', status: false },
  { id: 6, name: 'Escalation Alert', trigger: 'Task overdue 24h', action: 'Alert manager', status: true },
];

export default function Workflows() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Workflow Automation
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Automate repetitive tasks and boost productivity
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
          }}
        >
          Create Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} key={workflow.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AutoFixHighIcon sx={{ color: '#7c3aed' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                        {workflow.name}
                      </Typography>
                      <Chip label={workflow.status ? 'Active' : 'Inactive'} size="small" />
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked={workflow.status} />}
                    label=""
                  />
                </Box>

                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 0.5 }}>
                      Trigger
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {workflow.trigger}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 0.5 }}>
                      Action
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {workflow.action}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Button variant="outlined" size="small" fullWidth>
                    Edit
                  </Button>
                  <Button variant="text" size="small" fullWidth sx={{ color: '#ef4444' }}>
                    Delete
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
