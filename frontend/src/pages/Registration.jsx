import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Link,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthPageWrapper from './AuthPageWrapper';

// Vibrant Purple
const VIBRANT_PURPLE = '#7c3aed';

export default function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Simple redirect to 2fa without any validation
    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    // Replaces laptop icon. Represents a handshake or data input.
    const SignupIllustration = () => (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={VIBRANT_PURPLE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
    );

    return (
        <AuthPageWrapper
            title="Create Account"
            illustration={<SignupIllustration />}
            onSubmit={handleRegister}
            buttonText="Sign Up"
        >
            {/* Name Field */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    Full Name
                </Typography>
                <TextField
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    placeholder="John Doe"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                />
            </Stack>

            {/* Email Field */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    Email
                </Typography>
                <TextField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    placeholder="your@email.com"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                />
            </Stack>

            {/* Password Field */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    Password
                </Typography>
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    placeholder="••••••••"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword((show) => !show)}
                                    edge="end"
                                    sx={{ color: '#94a3b8' }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

        </AuthPageWrapper>
    );
}