import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Stack,
  Link,
  keyframes,
  Chip
} from '@mui/material';

// --- CSS Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// --- ToBeDone Features ---
const features = [
  {
    icon: '✅',
    title: 'Smart Task Management',
    description: 'Organize your tasks with intuitive Kanban boards. Create, assign, prioritize, and track progress effortlessly.',
    gradient: 'linear-gradient(135deg, #e6f4ea 0%, #f0f8f5 100%)'
  },
  {
    icon: '📊',
    title: 'Real-Time Dashboard',
    description: 'Get a bird\'s-eye view of your project progress and team productivity with live updates and insights.',
    gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' // Updated to light purple
  },
  {
    icon: '💬',
    title: 'Team Chat & Channels',
    description: 'Communicate instantly with your team. Organize conversations by project, topic, or team member.',
    gradient: 'linear-gradient(135deg, #fce8e6 0%, #fef5f0 100%)'
  },
  {
    icon: '📝',
    title: 'Collaborative Notes',
    description: 'Capture ideas and document processes in real-time. Keep all your knowledge in one organized place.',
    gradient: 'linear-gradient(135deg, #fef7e0 0%, #fffbf0 100%)'
  },
  {
    icon: '🤖',
    title: 'AI Digest & Automation',
    description: 'Let AI manage your inbox, draft responses, and organize emails automatically. Save hours every week.',
    gradient: 'linear-gradient(135deg, #f3e8fd 0%, #faf0ff 100%)'
  },
  {
    icon: '🔗',
    title: 'Workflow Integrations',
    description: 'Connect with your favorite tools via webhooks. Sync data and automate your entire workflow seamlessly.',
    gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' // Updated to light purple
  },
];

const stats = [
  { value: '6+', label: 'Core Modules' },
  { value: '5+', label: 'Features' },
  { value: '100%', label: 'Free Forever' },
];

const useCases = [
  { emoji: '🚀', title: 'Startups', description: 'Scale your team without chaos with a free, powerful collaboration tool.' },
  { emoji: '👥', title: 'Remote Teams', description: 'Keep your distributed team aligned and productive in one place.' },
  { emoji: '🎨', title: 'Creative Teams', description: 'Perfect for designers, developers, and creative professionals.' },
  { emoji: '📚', title: 'Students', description: 'Organize group projects and collaborative learning effortlessly.' },
];

const highlights = [
  { icon: '🔒', title: 'Secure & Private', description: 'Your data is encrypted and safe. No tracking, no ads.' },
  { icon: '⚡', title: 'Lightning Fast', description: 'Built for speed with instant updates and smooth performance.' },
  { icon: '☁', title: 'Cloud Native', description: 'Accessible anywhere. No installation needed. Works on all devices.' },
];

const roadmap = [
  { icon: '📱', title: 'Mobile Apps', description: 'iOS and Android apps coming soon' },
  { icon: '🔔', title: 'Smart Notifications', description: 'Intelligent alerts tailored to your workflow' },
  { icon: '📊', title: 'Advanced Analytics', description: 'Deep insights into team productivity' },
  { icon: '🤝', title: 'Client Collaboration', description: 'Share projects with external stakeholders' },
];

// --- Logo Component ---
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

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // The dotted background is now the root background for the entire page
  const dotGridBg = {
    backgroundColor: '#fafbfc',
    backgroundImage: 'radial-gradient(#d5e1f2 1.5px, transparent 1.5px)',
    backgroundSize: '28px 28px',
  };

  return (
    <Box sx={{ minHeight: '100vh', ...dotGridBg, color: '#111111' }}>

      {/* ====== HEADER ====== */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(250, 251, 252, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          zIndex: 100
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1400px', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <AppLogo />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.5px' }}>
              ToBeDone
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => navigate('/register')}
              sx={{
                color: '#555555',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                '&:hover': { color: '#6d28d9', backgroundColor: 'transparent' },
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: '#6d28d9',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#5b21b6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(109, 40, 217, 0.2)'
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ====== HERO SECTION ====== */}
      <Box sx={{ pt: 22, pb: 10, animation: `${fadeIn} 0.8s ease-out` }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', animation: `${scaleIn} 0.6s ease-out` }}>
              <Chip
                label="✨ Free Forever • No Credit Card Required"
                sx={{
                  backgroundColor: '#f5f3ff',
                  color: '#6d28d9',
                  fontWeight: 600,
                  height: 'auto',
                  py: 0.5,
                }}
              />
            </Box>

            <Typography
              variant="h1"
              align="center"
              sx={{
                fontSize: isMobile ? '2.8rem' : '5.5rem',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1.15,
                letterSpacing: '-2px',
                mb: 4,
                maxWidth: '1000px',
                mx: 'auto',
                animation: `${fadeIn} 0.8s ease-out 0.1s both`
              }}
            >
              Everything you need to <br />
              <Typography component="span" variant="inherit" sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                manage projects, collaborate,
              </Typography>
              <br />
              and organize your work.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#555555',
                mb: 6,
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
                animation: `${fadeIn} 0.8s ease-out 0.2s both`
              }}
            >
              One free tool for task management, team collaboration, notes, chat, email automation with AI, and more. No limits. Ever.
            </Typography>

            <Box
              sx={{
                mt: 8,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2,
                maxWidth: '900px',
                mx: 'auto',
                animation: `${fadeIn} 0.8s ease-out 0.4s both`
              }}
            >
              {stats.map((stat, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(109, 40, 217, 0.1)',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(109, 40, 217, 0.1)',
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#6d28d9', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box >

      {/* ====== FEATURES SECTION ====== */}
      <Box sx={{ py: 14, borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 3,
                color: '#000000',
                fontWeight: 800,
                letterSpacing: '-1px',
                fontSize: isMobile ? '2rem' : '2.8rem',
              }}
            >
              Powerful Features for Teams
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#666',
                fontSize: '1.1rem',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              All the tools you need to manage projects, collaborate with your team, and stay organized—completely free.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(109, 40, 217, 0.08)',
                  background: feature.gradient,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 24px 48px rgba(109, 40, 217, 0.12)',
                    borderColor: 'rgba(109, 40, 217, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                      fontSize: '2rem'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, color: '#111', fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box >

      {/* ====== USE CASES SECTION ====== */}
      <Box sx={{ py: 12, borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                color: '#000000',
                fontWeight: 800,
                fontSize: isMobile ? '2rem' : '2.8rem',
              }}
            >
              Perfect for Any Team
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {useCases.map((useCase, index) => (
              <Box
                key={index}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0f0f0',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(109, 40, 217, 0.08)',
                    borderColor: 'rgba(109, 40, 217, 0.2)',
                  }
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>
                  {useCase.emoji}
                </Box>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, mb: 1, color: '#000' }}>
                  {useCase.title}
                </Typography>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  {useCase.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box >

      {/* ====== HIGHLIGHTS SECTION ====== */}
      <Box sx={{ py: 12, borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 6,
              justifyItems: 'center',
              maxWidth: '900px',
              mx: 'auto'
            }}
          >
            {highlights.map((highlight, index) => (
              <Box key={index} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                    border: '2px solid rgba(109, 40, 217, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    fontSize: '1.8rem'
                  }}
                >
                  {highlight.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#000000', fontSize: '1.1rem' }}>
                  {highlight.title}
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {highlight.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box >

      {/* ====== ROADMAP SECTION ====== */}
      <Box sx={{ py: 14, borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 2,
                color: '#000000',
                fontWeight: 800,
                fontSize: isMobile ? '2rem' : '2.8rem',
              }}
            >
              What's Coming Next
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#666',
                fontSize: '1.1rem',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              We're constantly improving ToBeDone based on your feedback.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {roadmap.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(109, 40, 217, 0.1)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(109, 40, 217, 0.08)',
                  }
                }}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box >

      {/* ====== FINAL CTA SECTION ====== */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: `${shimmer} 20s linear infinite`,
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                mb: 2.5,
                color: '#ffffff',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                animation: `${fadeIn} 0.8s ease-out`
              }}
            >
              Start Organizing Your Work Today
            </Typography>
            <Typography
              sx={{
                mb: 5,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem',
                fontWeight: 400,
                animation: `${fadeIn} 0.8s ease-out 0.1s both`
              }}
            >
              Join thousands of teams already using ToBeDone to manage projects, collaborate, and stay organized. Completely free, forever.
            </Typography>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              justifyContent="center"
              sx={{ animation: `${fadeIn} 0.8s ease-out 0.2s both` }}
            >
              <Button
                onClick={() => navigate('/login')}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#6d28d9',
                  padding: '14px 40px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#f5f3ff', transform: 'translateY(-2px)' },
                }}
              >
                Get Started Free
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box >

      {/* ====== FOOTER ====== */}
      <Box sx={{ py: 6, backgroundColor: '#000000', color: '#ffffff', borderTop: '1px solid #222' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AppLogo />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
                  ToBeDone
                </Typography>
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                © {new Date().getFullYear()} ToBeDone. Free forever, always.
              </Typography>
            </Box>

            <Stack direction="row" spacing={4}>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: '#ccc',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#6d28d9' }
                }}
              >
                Contact
              </Link>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: '#ccc',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#6d28d9' }
                }}
              >
                Privacy
              </Link>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: '#ccc',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#6d28d9' }
                }}
              >
                Terms
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box >

    </Box >
  );
}