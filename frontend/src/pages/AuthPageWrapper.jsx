// AuthPageWrapper.jsx
import { useNavigate } from 'react-router-dom';
import { Box, Container, Card, Grid, Button, Typography, useMediaQuery, useTheme, Stack } from '@mui/material';

// Color from uploaded image: Vibrant Purple
const VIBRANT_PURPLE = '#7c3aed';

// Externalized static style constants for background patterns
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

// Unified style for all background dots
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

export default function AuthPageWrapper({ title, subtitle, illustration, children, onSubmit, buttonText, buttonDisabled = false }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
                overflow: 'hidden', // Required for absolute geometric patterns
                '&::before': { ...backgroundPatternBase, width: '300px', height: '300px', top: '10%', left: '-100px' },
                '&::after': { ...backgroundPatternBase, width: '400px', height: '400px', bottom: '-50px', right: '-100px' },
            }}
        >
            {/* Background Yellow Blobs */}
            <Box sx={{ position: 'absolute', top: '-10%', right: '5%', width: '500px', height: '600px', backgroundColor: '#fbbf24', borderRadius: '50% / 10% 60% 30% 90%', transform: 'rotate(20deg)', opacity: 0.1, zIndex: 0, }} />
            <Box sx={{ position: 'absolute', bottom: '-15%', left: '10%', width: '600px', height: '700px', backgroundColor: '#fbbf24', borderRadius: '50% / 80% 30% 90% 10%', transform: 'rotate(-10deg)', opacity: 0.1, zIndex: 0, }} />
            {/* Shared Dots */}
            {backgroundDots}

            {/* Top Header Bar Refactored */}
            <Stack
                direction="row"
                sx={{ ...headerStackStyles, px: theme => (theme.breakpoints.down('sm') ? 2 : 4) }}
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
                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="6px" width={28}>
                        {[VIBRANT_PURPLE, '#000000', '#000000', VIBRANT_PURPLE].map((color, i) => (
                            <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
                        ))}
                    </Box>
                    <Typography sx={{ fontSize: '2.1rem', fontWeight: 700, color: '#000000', letterSpacing: '-1.5px' }}>
                        ToBeDone
                    </Typography>
                </Stack>
            </Stack>

            {/* Main Two-Pane Card Container Optimization */}
            <Container
                maxWidth="lg"
                sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: 6,
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)',
                        overflow: 'visible',
                        mb: 4,
                    }}
                >
                    <Grid container direction={isTablet ? 'column-reverse' : 'row'}>
                        {/* Left Pane - Shared Illustration Area streamlined */}
                        <Grid
                            item
                            xs={12} md={6}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            p={isTablet ? 4 : 8}
                            pb={isTablet ? 4 : 10}
                            position="relative"
                        >
                            {illustration}
                        </Grid>

                        {/* Right Pane - Form Optimized with Stack for all pages */}
                        <Grid
                            item
                            xs={12} md={6}
                            p={isTablet ? 4 : 8}
                            backgroundColor="#ffffff"
                            borderRadius={isTablet ? '0' : '0 24px 24px 0'}
                            borderLeft={isTablet ? 'none' : '1px solid #e2e8f0'}
                        >
                            <Stack spacing={3.5}>
                                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, color: '#1e293b', fontSize: '1.7rem', letterSpacing: '-0.5px' }}>
                                    {title}
                                </Typography>
                                <Typography sx={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', fontWeight: 500, mt: -1.5, mb: -1.5 }}>
                                    {subtitle}
                                </Typography>

                                {/* Unified form fields from pages with Stack spacing */}
                                <form onSubmit={onSubmit}>
                                    <Stack spacing={2.2}>
                                        {children}

                                        {/* Unified button with image style and consolidated sx */}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={buttonDisabled}
                                            sx={{
                                                backgroundColor: VIBRANT_PURPLE,
                                                color: 'white',
                                                padding: '14px',
                                                fontSize: '1.1rem',
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
                                            {buttonText}
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