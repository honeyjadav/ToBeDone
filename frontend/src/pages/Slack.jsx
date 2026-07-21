import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const events = [
  { label: 'Task Created', enabled: true },
  { label: 'Task Completed', enabled: true },
  { label: 'Team Comments', enabled: true },
  { label: 'Workflow Updates', enabled: false },
  { label: 'File Uploads', enabled: true },
  { label: 'Assignments', enabled: true },
];

export default function Slack() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Slack Integration
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          Connect your workspace with Slack for seamless notifications
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Connection Status */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid #d1fae5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: '2rem' }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#065f46' }}>
                    ✓ Connected to Slack
                  </Typography>
                  <Typography sx={{ color: '#059669', fontSize: '0.9rem' }}>
                    Connected to workspace: development-team · Last sync: 2 minutes ago
                  </Typography>
                </Box>
                <Button variant="text" sx={{ ml: 'auto', color: '#ef4444' }}>
                  Disconnect
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Channel Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '1.1rem' }}>
                Default Notification Channel
              </Typography>
              <TextField
                fullWidth
                select
                defaultValue="#general"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="#general">#general</option>
                <option value="#announcements">#announcements</option>
                <option value="#engineering">#engineering</option>
                <option value="#product">#product</option>
              </TextField>
              <Typography sx={{ mt: 2, fontSize: '0.875rem', color: '#64748b' }}>
                Select which channel receives notifications by default
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Webhook URL */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '1.1rem' }}>
                Webhook URL
              </Typography>
              <TextField
                fullWidth
                value="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX"
                readOnly
                size="small"
              />
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Copy URL
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
                Events to Notify
              </Typography>
              <Grid container spacing={2}>
                {events.map((event, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={<Switch defaultChecked={event.enabled} />}
                        label={event.label}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customization */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
                Message Formatting
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Message Template"
                  multiline
                  rows={4}
                  defaultValue="[{event}] {user} {action} on {item}\n\n📌 {description}"
                  placeholder="Use {event}, {user}, {action}, {item}, {description}"
                />
                <TextField
                  fullWidth
                  label="Custom Prefix"
                  defaultValue="🚀 CloudCollab"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Test */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
              py: 1.5,
            }}
          >
            Send Test Message
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
