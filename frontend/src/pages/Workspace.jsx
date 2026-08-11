import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    Grid,
    Button,
    Typography,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HubIcon from '@mui/icons-material/Hub';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Color from established theme
const VIBRANT_PURPLE = '#7c3aed';

// Static style constants reused from login
const backgroundPatternBase = {
    content: '""',
    position: 'absolute',
    border: '1px solid #d1d5db',
    borderRadius: '16px',
    transform: 'rotate(-45deg)',
    zIndex: -1,
};

const headerStackStyles = {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 4,
};

// Dots consolidated from login
const backgroundDots = [
    { top: 50, right: 30 },
    { top: 150, right: 80 },
    { top: 250, right: 50 },
    { bottom: 50, left: 30 },
    { bottom: 150, left: 80 },
    { bottom: 250, left: 50 },
].map((dot, i) => (
    <Box
        key={i}
        sx={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#000000',
            opacity: 0.2,
            zIndex: 0,
            ...dot,
        }}
    />
));

// New styles specific to workspaces cards
const workspaceCardStyles = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    p: 3,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    width: '100%',
    '&:hover': {
        borderColor: VIBRANT_PURPLE,
        backgroundColor: '#f8fafc',
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(124, 58, 237, 0.15)',
    },
};

export default function WorkspaceSelection() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Hardcoded data for current workspaces
    const workspacesData = [
        {
            id: 1,
            name: 'Workspace Alpha',
            description: 'Primary dashboard, core projects, analytics.',
            path: '/dashboard',
        },
        {
            id: 2,
            name: 'Development Hub',
            description: 'Coding sandboxes, repository links, deployments.',
            path: '/workspace/dev',
        },
        {
            id: 3,
            name: 'Marketing Studio',
            description: 'Campaign assets, SEO tools, content calendar.',
            path: '/workspace/marketing',
        },
    ];

    const handleSelectWorkspace = (id, path) => {
        if (id === 1) {
            navigate(path);
        } else {
            console.log(`Selected Workspace ${id} - This path is not yet configured.`);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                height: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    ...backgroundPatternBase,
                    width: '300px',
                    height: '300px',
                    top: '10%',
                    left: '-100px',
                },
                '&::after': {
                    ...backgroundPatternBase,
                    width: '400px',
                    height: '400px',
                    bottom: '-50px',
                    right: '-100px',
                },
            }}
        >
            {/* Background Yellow Blobs Consolidation */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '5%',
                    width: '500px',
                    height: '500px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50% / 10% 60% 30% 90%',
                    transform: 'rotate(20deg)',
                    opacity: 0.1,
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '10%',
                    width: '600px',
                    height: '500px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50% / 80% 30% 90% 10%',
                    transform: 'rotate(-10deg)',
                    opacity: 0.1,
                    zIndex: 0,
                }}
            />
            {/* Dots consolidated */}
            {backgroundDots}

            {/* Top Header Bar Refactored */}
            <Stack
                direction="row"
                sx={{
                    ...headerStackStyles,
                    px: theme => (theme.breakpoints.down('sm') ? 2 : 4),
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
                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="4px" width={28}>
                        {[VIBRANT_PURPLE, '#000000', '#000000', VIBRANT_PURPLE].map(
                            (color, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                    }}
                                />
                            )
                        )}
                    </Box>
                    <Typography
                        sx={{
                            fontSize: '2.1rem',
                            fontWeight: 700,
                            color: '#000000',
                            letterSpacing: '-1.5px',
                        }}
                    >
                        ToBeDone
                    </Typography>
                </Stack>
            </Stack>

            {/* Main Two-Pane Card Container Optimization */}
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: '1100px',
                        borderRadius: '24px',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                        overflow: 'visible',
                        mb: 4,
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <Grid
                        container
                        direction={isTablet ? 'column-reverse' : 'row'}
                        spacing={0}
                    >
                        {/* Left Pane - Illustration */}
                        <Grid
                            item
                            xs={12}
                            md={5}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            p={isTablet ? 4 : 6}
                            pb={isTablet ? 4 : 8}
                            position="relative"
                            sx={{
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            }}
                        >
                            <LaptopMacIcon
                                sx={{
                                    fontSize: '18rem',
                                    color: VIBRANT_PURPLE,
                                    opacity: 0.08,
                                    position: 'absolute',
                                    top: '20%',
                                    transform: 'scale(1.3)',
                                    zIndex: 0,
                                }}
                            />
                            <Stack alignItems="center" zIndex={1} position="relative" gap={3}>
                                <Box
                                    sx={{
                                        width: '280px',
                                        height: '200px',
                                        backgroundColor: '#e2e8f0',
                                        borderRadius: '20px',
                                        border: '2px solid #cbd5e1',
                                        opacity: 0.6,
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: VIBRANT_PURPLE,
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        letterSpacing: '-0.25px',
                                    }}
                                >
                                    Select your active environment
                                </Typography>
                            </Stack>
                        </Grid>

                        {/* Right Pane - Workspaces Selection */}
                        <Grid
                            item
                            xs={12}
                            md={7}
                            p={isTablet ? 4 : 6}
                            backgroundColor="#ffffff"
                            borderRadius={isTablet ? '0' : '0 24px 24px 0'}
                            borderLeft={isTablet ? 'none' : '1px solid #e2e8f0'}
                        >
                            <Stack spacing={4}>
                                {/* Title */}
                                <Stack spacing={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#1e293b',
                                            fontSize: '1.8rem',
                                            letterSpacing: '-0.5px',
                                        }}
                                    >
                                        Select Your Workspace
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#64748b',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Choose where you want to work today
                                    </Typography>
                                </Stack>

                                {/* Workspace Selection List */}
                                <Stack spacing={2.5}>
                                    {workspacesData.map((ws) => (
                                        <Box
                                            key={ws.id}
                                            sx={workspaceCardStyles}
                                            onClick={() => handleSelectWorkspace(ws.id, ws.path)}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f1f5f9',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <HubIcon
                                                    sx={{
                                                        color: VIBRANT_PURPLE,
                                                        fontSize: '1.8rem',
                                                    }}
                                                />
                                            </Box>
                                            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#1e293b',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {ws.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#64748b',
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    {ws.description}
                                                </Typography>
                                            </Stack>
                                            <ArrowForwardIosIcon
                                                sx={{
                                                    color: '#cbd5e1',
                                                    fontSize: '1.1rem',
                                                    flexShrink: 0,
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>

                                {/* Footer Info */}
                                <Typography
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.85rem',
                                        textAlign: 'center',
                                        mt: 2,
                                    }}
                                >
                                    Can't find your workspace?{' '}
                                    <Typography
                                        component="span"
                                        onClick={() => navigate('/create-workspace')}
                                        sx={{
                                            color: VIBRANT_PURPLE,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        Create a new one
                                    </Typography>
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Box>
    );
}