import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@cloudcollab.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Admin');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@cloudcollab.com' },
    { role: 'Manager', email: 'manager@cloudcollab.com' },
    { role: 'Member', email: 'member@cloudcollab.com' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ p: isMobile ? 3 : 4 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                C
              </Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>
                CloudCollab
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
              Welcome Back
            </Typography>
            <Typography sx={{ textAlign: 'center', color: '#64748b', mb: 4 }}>
              Sign in to access your dashboard
            </Typography>

            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                {/* Role Selection */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1.5, color: '#1e293b' }}>
                    Select Role
                  </Typography>
                  <ToggleButtonGroup
                    value={role}
                    exclusive
                    onChange={(e, newRole) => {
                      if (newRole) {
                        setRole(newRole);
                        const account = demoAccounts.find((acc) => acc.role === newRole);
                        if (account) setEmail(account.email);
                      }
                    }}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(124, 58, 237, 0.1)',
                          color: '#7c3aed',
                          borderColor: '#7c3aed',
                        },
                      },
                    }}
                  >
                    {['Admin', 'Manager', 'Member'].map((r) => (
                      <ToggleButton key={r} value={r}>
                        {r}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                {/* Email */}
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="your@email.com"
                />

                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder="••••••••"
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            {/* Demo Info */}
            <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(124, 58, 237, 0.05)', borderRadius: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
                📌 Demo Accounts Available
              </Typography>
              {demoAccounts.map((account) => (
                <Box key={account.role} sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant="text"
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      color: '#7c3aed',
                      fontSize: '0.875rem',
                      '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.1)' },
                    }}
                    onClick={() => {
                      setRole(account.role);
                      setEmail(account.email);
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      <Box sx={{ fontWeight: 600 }}>{account.role}</Box>
                      <Box sx={{ color: '#94a3b8' }}>{account.email}</Box>
                    </Box>
                  </Button>
                </Box>
              ))}
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 2 }}>
                Password: password123 (all accounts)
              </Typography>
            </Box>
          </Box>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography sx={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Typography
              component="span"
              sx={{
                color: '#7c3aed',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
