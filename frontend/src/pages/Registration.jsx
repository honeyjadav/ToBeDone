import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Stack,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AuthPageWrapper from './AuthPageWrapper';
import { useAuth } from '../hooks/useAuth';
import PasswordValidationPopup from '../components/PasswordValidationPopup';

const VIBRANT_PURPLE = '#7c3aed';

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

    const isEmailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // -----------------------------
    // Confirm password
    // -----------------------------

    const isConfirmPasswordValid =
        confirmPassword.length > 0 &&
        password === confirmPassword;

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

        // Name
        if (!name.trim()) {
            setError('Full name is required.');
            return;
        }

        // Email
        if (!isEmailValid) {
            setError('Please enter a valid email address.');
            return;
        }

        // Password
        if (!isPasswordValid) {
            setError('Please complete all password requirements.');
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Terms
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

            navigate('/two-factor-auth');
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

    // -----------------------------
    // Illustration
    // -----------------------------

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

    return (
        <AuthPageWrapper
            title="Create Account"
            illustration={<SignupIllustration />}
            onSubmit={handleRegister}
            buttonText={loading ? 'Creating...' : 'Sign Up'}
            buttonDisabled={!isFormValid}
        >
            {/* ========================= */}
            {/* NAME */}
            {/* ========================= */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    Full Name
                </Typography>

                <TextField
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    fullWidth
                    placeholder="John Doe"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',

                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                />
            </Stack>

            {/* ========================= */}
            {/* EMAIL */}
            {/* ========================= */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    Email
                </Typography>

                <TextField
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    fullWidth
                    placeholder="your@email.com"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',

                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                />
            </Stack>

            {/* ========================= */}
            {/* PASSWORD */}
            {/* ========================= */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    Password
                </Typography>

                <div
                    ref={(element) => {
                        if (element) {
                            setPasswordAnchor(element);
                        }
                    }}
                    style={{
                        position: 'relative',
                    }}
                >
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onFocus={(e) => {
                            setPasswordFocused(true);
                            setPasswordAnchor(e.currentTarget);
                        }}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        onBlur={() => {
                            // Small delay allows popup interactions
                            setTimeout(() => {
                                setPasswordFocused(false);
                            }, 150);
                        }}
                        fullWidth
                        placeholder="••••••••"
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',

                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },

                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },

                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: `1px solid ${VIBRANT_PURPLE}`,
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword(
                                                (show) => !show
                                            )
                                        }
                                        edge="end"
                                        sx={{
                                            color: '#94a3b8',
                                        }}
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* PASSWORD POPUP */}

                    <PasswordValidationPopup
                        open={
                            passwordFocused &&
                            password.length > 0 &&
                            !isPasswordValid
                        }
                        anchorEl={passwordAnchor}
                        password={password}
                    />
                </div>
            </Stack>

            {/* ========================= */}
            {/* CONFIRM PASSWORD */}
            {/* ========================= */}

            <Stack spacing={0.8}>
                <Typography
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#1e293b"
                >
                    Confirm Password
                </Typography>

                <TextField
                    type={
                        showConfirmPassword
                            ? 'text'
                            : 'password'
                    }
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                    }}
                    fullWidth
                    placeholder="••••••••"
                    sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',

                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${VIBRANT_PURPLE}`,
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (show) => !show
                                        )
                                    }
                                    edge="end"
                                    sx={{
                                        color: '#94a3b8',
                                    }}
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {confirmPassword.length > 0 &&
                    password !== confirmPassword && (
                        <Typography
                            sx={{
                                fontSize: '0.75rem',
                                color: '#ef4444',
                                mt: 0.3,
                            }}
                        >
                            Passwords do not match.
                        </Typography>
                    )}
            </Stack>

            {/* ========================= */}
            {/* TERMS */}
            {/* ========================= */}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={agreed}
                        onChange={(e) => {
                            setAgreed(e.target.checked);
                            setError('');
                        }}
                        sx={{
                            color: VIBRANT_PURPLE,

                            '&.Mui-checked': {
                                color: VIBRANT_PURPLE,
                            },
                        }}
                    />
                }
                label="I agree to the terms and conditions"
                sx={{
                    mt: 1.5,
                }}
            />

            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {error && (
                <Typography
                    color="error"
                    sx={{
                        mt: 1,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                    }}
                >
                    {error}
                </Typography>
            )}
        </AuthPageWrapper>
    );
}