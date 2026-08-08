import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Stack, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthPageWrapper from './AuthPageWrapper';

// Vibrant Purple from established theme
const VIBRANT_PURPLE = '#7c3aed';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    // Handle redirect to reset password page
    const handleContinue = (e) => {
        e.preventDefault();

        // Just redirect to reset-password page
        navigate('/reset-password', {
            state: { email, otp } // Pass email and otp as state if needed
        });
    };

    // Replaces laptop icon. Represents a keyhole or a question mark.
    const QuestionIllustration = () => (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={VIBRANT_PURPLE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );

    return (
        <AuthPageWrapper
            title="Trouble Logging In?"
            subtitle="Enter your email and the OTP sent to verify your identity."
            illustration={<QuestionIllustration />}
            onSubmit={handleContinue}
            buttonText="Next"
        >
            {/* Email Field streamlined */}
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
                    required
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

            {/* OTP Field streamlined */}
            <Stack spacing={0.8}>
                <Typography fontSize="0.9rem" fontWeight={600} color="#1e293b">
                    OTP (One-Time Password)
                </Typography>
                <TextField
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    fullWidth
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
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
                <Typography fontSize="0.8rem" color="#64748b" sx={{ mt: 0.5 }}>
                    Check your email for the OTP code
                </Typography>
            </Stack>
        </AuthPageWrapper>
    );
}