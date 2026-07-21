import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const analyticsData = [
  { date: 'Jul 1', productivity: 65, engagement: 72, performance: 68 },
  { date: 'Jul 2', productivity: 72, engagement: 78, performance: 75 },
  { date: 'Jul 3', productivity: 68, engagement: 70, performance: 72 },
  { date: 'Jul 4', productivity: 78, engagement: 82, performance: 80 },
  { date: 'Jul 5', productivity: 85, engagement: 88, performance: 86 },
  { date: 'Jul 6', productivity: 88, engagement: 90, performance: 89 },
  { date: 'Jul 7', productivity: 92, engagement: 95, performance: 93 },
];

const teamMetrics = [
  { name: 'Q1', tasks: 120, completed: 85, efficiency: 71 },
  { name: 'Q2', tasks: 145, completed: 112, efficiency: 77 },
  { name: 'Q3', tasks: 168, completed: 145, efficiency: 86 },
  { name: 'Q4', tasks: 195, completed: 175, efficiency: 90 },
];

const departmentData = [
  { dept: 'Engineering', tasks: 450, completed: 380, efficiency: 84 },
  { dept: 'Product', tasks: 320, completed: 268, efficiency: 84 },
  { dept: 'Design', tasks: 280, completed: 245, efficiency: 87 },
  { dept: 'Marketing', tasks: 200, completed: 180, efficiency: 90 },
];

export default function Analytics() {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics & Insights
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Comprehensive metrics and performance data
          </Typography>
        </Box>
        <FormControl sx={{ width: 150 }}>
          <Select defaultValue="week" size="small">
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Avg Productivity', value: '87%', trend: '+5%', color: '#7c3aed' },
          { label: 'Team Engagement', value: '91%', trend: '+8%', color: '#06b6d4' },
          { label: 'Task Completion', value: '86%', trend: '+3%', color: '#10b981' },
          { label: 'Efficiency Score', value: '92/100', trend: '+12%', color: '#f59e0b' },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                  {metric.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: metric.color }}>
                    {metric.value}
                  </Typography>
                  <Typography sx={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
                    {metric.trend}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Team Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="productivity" stroke="#7c3aed" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Quarterly Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="completed" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Department Efficiency
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dept" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tasks" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
