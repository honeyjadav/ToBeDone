import {
    Box,
    Paper,
    Popper,
    Typography,
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function PasswordValidationPopup({
    open,
    anchorEl,
    password,
}) {
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const PasswordRule = ({ valid, children }) => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.8,
            }}
        >
            <CheckCircleIcon
                sx={{
                    fontSize: 18,
                    color: valid ? '#06a6d8' : '#cbd5e1',
                }}
            />

            <Typography
                sx={{
                    fontSize: '0.78rem',
                    color: valid ? '#06a6d8' : '#94a3b8',
                }}
            >
                {children}
            </Typography>
        </Box>
    );

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="right-start"
            sx={{
                zIndex: 9999,
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    mt: 0.5,
                    ml: 1,
                    p: 1.5,
                    width: 210,
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#334155',
                        mb: 1.2,
                    }}
                >
                    Password must have:
                </Typography>

                <PasswordRule valid={rules.length}>
                    At least 8 characters
                </PasswordRule>

                <PasswordRule valid={rules.uppercase}>
                    At least 1 uppercase
                </PasswordRule>

                <PasswordRule valid={rules.lowercase}>
                    At least 1 lowercase
                </PasswordRule>

                <PasswordRule valid={rules.number}>
                    At least 1 number
                </PasswordRule>

                <PasswordRule valid={rules.special}>
                    At least 1 special character
                </PasswordRule>
            </Paper>
        </Popper>
    );
}