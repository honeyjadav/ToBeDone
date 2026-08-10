import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Stack, useTheme, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthPageWrapper from './AuthPageWrapper';

// Vibrant Purple from established theme
const VIBRANT_PURPLE = '#7c3aed';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();

    // Simple redirect to login without any validation
    const handleReset = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    // Replaces laptop icon. Represents a gear or a reset arrow.
    const ResetIllustration = () => (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={VIBRANT_PURPLE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    );

    return (
        <AuthPageWrapper
            title="Create New Password"
            illustration={<ResetIllustration />}
            onSubmit={handleReset}
            buttonText="Update Password"
        >

            {/* New Password Field */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    New Password
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

            {/* Confirm Password Field */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    Confirm Password
                </Typography>
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                />
            </Stack>

        </AuthPageWrapper>
    );
}