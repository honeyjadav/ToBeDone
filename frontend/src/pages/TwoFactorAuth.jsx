import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Stack, useTheme } from '@mui/material';
import AuthPageWrapper from './AuthPageWrapper';

// Vibrant Purple from established theme
const VIBRANT_PURPLE = '#7c3aed';

export default function TwoFactorAuth() {
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();
    const theme = useTheme();

    // Simple redirect to workspace without validation
    const handleConfirm = (e) => {
        e.preventDefault();
        navigate('/workspace');
    };

    // Replaces laptop icon. Represents a locked shield or a secure key.
    const SecureIllustration = () => (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={VIBRANT_PURPLE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );

    return (
        <AuthPageWrapper
            title="Secure Your Account"
            subtitle="Enter the 6-digit code sent to your email to confirm."
            illustration={<SecureIllustration />}
            onSubmit={handleConfirm}
            buttonText="Confirm"
        >
            {/* OTP Field streamlined */}
            <Stack spacing={0.8} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b" align="center">
                    6-Digit OTP
                </Typography>
                <TextField
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px' } }}
                    fullWidth
                    placeholder="000000"
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