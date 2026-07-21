import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const summaries = [
  {
    title: 'Q3 Launch Status',
    content: 'The Q3 launch is on track. All critical components are 85% complete. The team is ahead of schedule by 2 days.',
    timestamp: 'Today at 9:00 AM',
    insights: ['85% progress', 'On schedule', 'Team collaboration: 92%'],
  },
  {
    title: 'Weekly Task Summary',
    content: 'This week, the team completed 142 tasks with 89% efficiency. Top contributors: Alice (28 tasks), Bob (25 tasks). Key blockers: API integration (2 issues).',
    timestamp: 'Yesterday',
    insights: ['142 tasks completed', '89% efficiency', '0 critical issues'],
  },
  {
    title: 'Team Performance Insights',
    content: 'Team productivity increased by 12% this week. Department collaboration improved significantly. Recommended focus: Mobile app testing.',
    timestamp: '2 days ago',
    insights: ['+12% productivity', '+8% collaboration', '3 recommendations'],
  },
];

export default function Digest() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          🤖 AI Smart Digest
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          AI-powered insights and summaries powered by Gemini & Claude
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 3 }}>
                Digest Settings
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
                    Frequency
                  </Typography>
                  <Select fullWidth defaultValue="daily" size="small">
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
                    Delivery Time
                  </Typography>
                  <TextField type="time" fullWidth size="small" defaultValue="09:00" />
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
                    AI Model
                  </Typography>
                  <Select fullWidth defaultValue="gemini" size="small">
                    <MenuItem value="gemini">Google Gemini</MenuItem>
                    <MenuItem value="claude">Anthropic Claude</MenuItem>
                    <MenuItem value="hybrid">Hybrid (Both)</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Delivery"
                  />
                </Box>

                <Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Slack Notification"
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                  }}
                >
                  Save Settings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Digests */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {summaries.map((summary, index) => (
              <Card key={index}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                    <AutoAwesomeIcon sx={{ color: '#7c3aed', fontSize: '1.5rem', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
                          {summary.title}
                        </Typography>
                        <Chip label={summary.timestamp} size="small" variant="outlined" />
                      </Box>
                      <Typography sx={{ color: '#64748b', mb: 2, lineHeight: 1.6 }}>
                        {summary.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {summary.insights.map((insight, idx) => (
                          <Chip
                            key={idx}
                            label={insight}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(124, 58, 237, 0.1)',
                              color: '#7c3aed',
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined">
                          Read Full
                        </Button>
                        <Button size="small" sx={{ color: '#7c3aed' }}>
                          💾 Save
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Generate New */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: 'rgba(124, 58, 237, 0.05)', border: '2px dashed #7c3aed' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SmartToyIcon sx={{ fontSize: '3rem', color: '#7c3aed', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Generate Custom Digest
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 3 }}>
                Get AI-powered insights on any topic or time range
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                }}
              >
                Generate Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
