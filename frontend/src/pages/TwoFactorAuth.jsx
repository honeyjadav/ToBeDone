import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Stack, Box, Button } from '@mui/material';
import AuthPageWrapper from './AuthPageWrapper';
import { useAuth } from '../context/AuthContext';
import { LOCAL_STORAGE_KEYS } from '../constants/Constants';

// Vibrant Purple from established theme
const VIBRANT_PURPLE = '#7c3aed';

const SecureIllustration = () => (
    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={VIBRANT_PURPLE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function TwoFactorAuth() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { verifyLoginOtp, verifyOtp, resendLoginOtp, resendOtp } = useAuth();

    const formatApiError = (error) => {
        const data = error?.response?.data || {};
        const rawMessage = error?.message || data?.message || data?.error;

        if (Array.isArray(rawMessage)) {
            return rawMessage.map((item) => {
                if (typeof item === 'string') return item;
                if (item?.message) return item.message;
                return JSON.stringify(item);
            }).join('\n');
        }

        if (typeof rawMessage === 'object' && rawMessage !== null) {
            if (rawMessage.message) return rawMessage.message;
            return JSON.stringify(rawMessage, null, 2);
        }

        if (data?.errors) {
            if (Array.isArray(data.errors)) {
                return data.errors
                    .map((item) => (typeof item === 'string' ? item : item?.message || JSON.stringify(item)))
                    .join('\n');
            }
            return JSON.stringify(data.errors, null, 2);
        }

        return rawMessage || 'OTP verification failed. Please try again.';
    };

    const getMode = () => {
        const pendingRegister = sessionStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
        return pendingRegister ? 'register' : 'login';
    };

    const mode = getMode();
    const pageTitle = mode === 'register' ? 'Verify Your Email' : 'Two-Factor Authentication';
    const pageSubtitle = mode === 'register'
        ? 'Enter the code sent to your email to complete registration.'
        : 'Enter the 6-digit code sent to your email to sign in.';
    const successMessage = mode === 'register'
        ? 'Email verified successfully. Redirecting to login...'
        : null;

    const handleConfirm = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (mode === 'register') {
                await verifyOtp(otp);
                setMessage(successMessage);
                setTimeout(() => navigate('/login', { replace: true }), 1500);
            } else {
                await verifyLoginOtp(otp);
                navigate('/workspace', { replace: true });
            }
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const result = mode === 'register' ? await resendOtp() : await resendLoginOtp();
            setMessage(result || 'A new OTP has been sent to your email.');
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageWrapper
            title={pageTitle}
            subtitle={pageSubtitle}
            illustration={<SecureIllustration />}
            onSubmit={handleConfirm}
            buttonText={loading ? 'Confirming...' : 'Confirm'}
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
            {(error || message) && (
                <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
                    {error && (
                        <Typography
                            sx={{
                                color: '#dc2626',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.9rem',
                                mb: 1,
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <Typography
                            sx={{
                                color: '#16a34a',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.9rem',
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
                <Button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    sx={{
                        color: VIBRANT_PURPLE,
                        textTransform: 'none',
                        fontWeight: 700,
                    }}
                >
                    Resend code
                </Button>
            </Box>
        </AuthPageWrapper>
    );
}