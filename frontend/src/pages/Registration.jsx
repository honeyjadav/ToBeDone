import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Container,
    Card,
    Grid,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useAuth } from '../hooks/useAuth';
import PasswordValidationPopup from '../components/PasswordValidationPopup';
import { LOCAL_STORAGE_KEYS } from '../constants/Constants';

const VIBRANT_PURPLE = '#7c3aed';

const backgroundPatternBase = {
    content: '""',
    position: 'absolute',
    border: '1px solid #d1d5db',
    borderRadius: '16px',
    transform: 'rotate(-45deg)',
    zIndex: -1,
};

const backgroundDots = [
    { top: 50, right: 30 }, { top: 150, right: 80 }, { top: 250, right: 50 },
    { bottom: 50, left: 30 }, { bottom: 150, left: 80 }, { bottom: 250, left: 50 },
].map((dot, i) => (
    <Box
        key={i}
        sx={{
            position: 'absolute',
            width: 6, height: 6,
            borderRadius: '50%',
            backgroundColor: '#000000',
            opacity: 0.2,
            zIndex: 0,
            ...dot,
        }}
    />
));

const compactFieldSx = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${VIBRANT_PURPLE}`,
    },
};

const SignupIllustration = () => (
    <svg
        width="200"
        height="200"
        viewBox="0 0 24 24"
        fill="none"
        stroke={VIBRANT_PURPLE}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.15 }}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

export default function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordAnchor, setPasswordAnchor] = useState(null);

    const [agreed, setAgreed] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { register } = useAuth();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // -----------------------------
    // Password validation
    // -----------------------------

    const passwordRules = {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const isPasswordValid =
        passwordRules.minLength &&
        passwordRules.uppercase &&
        passwordRules.lowercase &&
        passwordRules.number &&
        passwordRules.special;

    // -----------------------------
    // Email validation
    // -----------------------------

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // -----------------------------
    // Confirm password
    // -----------------------------

    const isConfirmPasswordValid =
        confirmPassword.length > 0 && password === confirmPassword;

    // -----------------------------
    // Complete form validation
    // -----------------------------

    const isFormValid =
        name.trim().length > 0 &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        agreed &&
        !loading;

    // -----------------------------
    // Register
    // -----------------------------

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Full name is required.');
            return;
        }
        if (!isEmailValid) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!isPasswordValid) {
            setError('Please complete all password requirements.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!agreed) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);
        try {
            await register(
                name.trim(),
                email.trim(),
                password
            );

            // ✅ Clear registration state to prevent 2FA mode detection issues
            sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);

            // ✅ Redirect to login instead of two-factor-auth
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const AppLogo = () => (
        <Box
            sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                backgroundColor: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        </Box>
    );


    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                height: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 2,
                position: 'relative',
                overflow: 'hidden', // this is the ONLY layout element on the page now, so it's safe to own overflow
                '&::before': { ...backgroundPatternBase, width: '300px', height: '300px', top: '10%', left: '-100px' },
                '&::after': { ...backgroundPatternBase, width: '400px', height: '400px', bottom: '-50px', right: '-100px' },
            }}
        >
            {/* Background Yellow Blobs */}
            <Box sx={{ position: 'absolute', top: '-10%', right: '5%', width: '500px', height: '600px', backgroundColor: '#fbbf24', borderRadius: '50% / 10% 60% 30% 90%', transform: 'rotate(20deg)', opacity: 0.1, zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: '-15%', left: '10%', width: '600px', height: '700px', backgroundColor: '#fbbf24', borderRadius: '50% / 80% 30% 90% 10%', transform: 'rotate(-10deg)', opacity: 0.1, zIndex: 0 }} />
            {backgroundDots}

            {/* Header */}
            <Stack
                direction="row"
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    px: { xs: 2, sm: 4 },
                }}
                zIndex={1}
                position="relative"
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    onClick={() => navigate('/')}
                    sx={{ cursor: 'pointer' }}
                >
                    <AppLogo />
                    <Typography sx={{ fontSize: '2.1rem', fontWeight: 700, color: '#000000', letterSpacing: '-1.5px' }}>
                        ToBeDone
                    </Typography>
                </Stack>
            </Stack>

            {/* Card */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                <Card
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: 6,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)',
                        overflow: 'visible',
                    }}
                >
                    <Grid container direction={isTablet ? 'column-reverse' : 'row'}>
                        {/* Illustration pane */}
                        <Grid
                            item
                            xs={12} md={6}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            p={isTablet ? 4 : 6}
                        >
                            <SignupIllustration />
                        </Grid>

                        {/* Form pane */}
                        <Grid
                            item
                            xs={12} md={6}
                            p={isTablet ? 4 : 6}
                            backgroundColor="#ffffff"
                            borderRadius={isTablet ? '0' : '0 24px 24px 0'}
                            borderLeft={isTablet ? 'none' : '1px solid #e2e8f0'}
                        >
                            <Stack spacing={2}>
                                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, color: '#1e293b', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                                    Create Account
                                </Typography>

                                <form onSubmit={handleRegister}>
                                    <Stack spacing={1.4}>
                                        {/* NAME */}
                                        <Stack spacing={0.4}>
                                            <Typography fontSize="0.85rem" fontWeight={600} color="#1e293b">
                                                Full Name
                                            </Typography>
                                            <TextField
                                                type="text"
                                                size="small"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                                fullWidth
                                                placeholder="John Doe"
                                                sx={compactFieldSx}
                                            />
                                        </Stack>

                                        {/* EMAIL */}
                                        <Stack spacing={0.4}>
                                            <Typography fontSize="0.85rem" fontWeight={600} color="#1e293b">
                                                Email
                                            </Typography>
                                            <TextField
                                                type="email"
                                                size="small"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                fullWidth
                                                placeholder="your@email.com"
                                                sx={compactFieldSx}
                                            />
                                        </Stack>

                                        {/* PASSWORD */}
                                        <Stack spacing={0.4}>
                                            <Typography fontSize="0.85rem" fontWeight={600} color="#1e293b">
                                                Password
                                            </Typography>
                                            <div
                                                ref={(element) => { if (element) setPasswordAnchor(element); }}
                                                style={{ position: 'relative' }}
                                            >
                                                <TextField
                                                    type={showPassword ? 'text' : 'password'}
                                                    size="small"
                                                    value={password}
                                                    onFocus={(e) => {
                                                        setPasswordFocused(true);
                                                        setPasswordAnchor(e.currentTarget);
                                                    }}
                                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                                    onBlur={() => {
                                                        setTimeout(() => setPasswordFocused(false), 150);
                                                    }}
                                                    fullWidth
                                                    placeholder="••••••••"
                                                    sx={compactFieldSx}
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
                                                <PasswordValidationPopup
                                                    open={passwordFocused && password.length > 0 && !isPasswordValid}
                                                    anchorEl={passwordAnchor}
                                                    password={password}
                                                />
                                            </div>
                                        </Stack>

                                        {/* CONFIRM PASSWORD */}
                                        <Stack spacing={0.4}>
                                            <Typography fontSize="0.85rem" fontWeight={600} color="#1e293b">
                                                Confirm Password
                                            </Typography>
                                            <TextField
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                size="small"
                                                value={confirmPassword}
                                                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                                fullWidth
                                                placeholder="••••••••"
                                                sx={compactFieldSx}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle confirm password visibility"
                                                                onClick={() => setShowConfirmPassword((show) => !show)}
                                                                edge="end"
                                                                sx={{ color: '#94a3b8' }}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                                <Typography sx={{ fontSize: '0.7rem', color: '#ef4444' }}>
                                                    Passwords do not match.
                                                </Typography>
                                            )}
                                        </Stack>

                                        {/* TERMS */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={agreed}
                                                    onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
                                                    sx={{
                                                        color: VIBRANT_PURPLE,
                                                        '&.Mui-checked': { color: VIBRANT_PURPLE },
                                                    }}
                                                />
                                            }
                                            label={<Typography fontSize="0.8rem">I agree to the terms and conditions</Typography>}
                                            sx={{ ml: 0 }}
                                        />

                                        {/* ERROR */}
                                        {error && (
                                            <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
                                                {error}
                                            </Typography>
                                        )}

                                        {/* SUBMIT */}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={!isFormValid}
                                            sx={{
                                                backgroundColor: VIBRANT_PURPLE,
                                                color: 'white',
                                                padding: '12px',
                                                fontSize: '1.05rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: '12px',
                                                mt: 1,
                                                boxShadow: '0 6px 18px rgba(124, 58, 237, 0.4)',
                                                '&:hover': {
                                                    backgroundColor: VIBRANT_PURPLE,
                                                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.5)',
                                                },
                                            }}
                                        >
                                            {loading ? 'Creating...' : 'Sign Up'}
                                        </Button>
                                    </Stack>
                                </form>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}