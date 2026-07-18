import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Container,
  Button,
  Grid,
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

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
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
    gradient: 'linear-gradient(135deg, #e8f0fe 0%, #f0f5ff 100%)'
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
    title: 'AI Email Automation',
    description: 'Let AI manage your inbox, draft responses, and organize emails automatically. Save hours every week.',
    gradient: 'linear-gradient(135deg, #f3e8fd 0%, #faf0ff 100%)'
  },
  {
    icon: '🔗',
    title: 'Workflow Integrations',
    description: 'Connect with your favorite tools via webhooks. Sync data and automate your entire workflow seamlessly.',
    gradient: 'linear-gradient(135deg, #e8f0fe 0%, #f0f5ff 100%)'
  },
];

const stats = [
  { value: '1000+', label: 'Active Users' },
  { value: '50K+', label: 'Tasks Created' },
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

const faqs = [
  {
    question: 'Is ToBeDone really free?',
    answer: 'Yes! ToBeDone is completely free to use with full access to all features. No hidden fees, no premium tier (yet). We believe collaboration tools should be accessible to everyone.'
  },
  {
    question: 'How do I import tasks from another app?',
    answer: 'We support importing from Asana, Jira, Monday.com, and more. Just contact us or use our import wizard to migrate your existing tasks easily.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All your data is encrypted in transit and at rest. We follow industry best practices for security and privacy. Your data belongs to you.'
  },
  {
    question: 'Can I use it offline?',
    answer: 'We\'re working on offline support. For now, ToBeDone requires an internet connection. You can use it on any device with a web browser.'
  },
  {
    question: 'How does the AI email automation work?',
    answer: 'Our AI agent connects to your email, analyzes incoming messages, suggests smart responses, and helps organize your inbox. You always review before any action is taken.'
  },
  {
    question: 'Can I invite my team?',
    answer: 'Yes! You can invite unlimited team members for free. Everyone gets access to the same powerful features. No seat limits, ever.'
  },
];

const roadmap = [
  { icon: '📱', title: 'Mobile Apps', description: 'iOS and Android apps coming soon' },
  { icon: '🔔', title: 'Smart Notifications', description: 'Intelligent alerts tailored to your workflow' },
  { icon: '📊', title: 'Advanced Analytics', description: 'Deep insights into team productivity' },
  { icon: '🤝', title: 'Client Collaboration', description: 'Share projects with external stakeholders' },
];

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const dotGridBg = {
    backgroundColor: '#fafcff',
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
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          zIndex: 100
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1400px', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', width: 18 }}>
              {['#1a73e8', '#000000', '#000000', '#1a73e8'].map((color, i) => (
                <Box key={i} sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }} />
              ))}
            </Box>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.5px' }}>
              ToBeDone
            </Typography>
          </Box>

          {/* Auth Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: '#555555',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                '&:hover': { color: '#1a73e8', backgroundColor: 'transparent' },
              }}
            >
              Sign in
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2.5,
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: '#155cb4', transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)' },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ====== HERO SECTION ====== */}
      <Box sx={{ pt: 22, pb: 10, animation: `${fadeIn} 0.8s ease-out` }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* Badge */}
            <Box sx={{ mb: 3, animation: `${scaleIn} 0.6s ease-out` }}>
              <Chip
                label="✨ Free Forever • No Credit Card Required"
                sx={{
                  backgroundColor: '#f0f5ff',
                  color: '#1a73e8',
                  fontWeight: 600,
                  height: 'auto',
                  py: 0.5,
                }}
              />
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile ? '2.8rem' : '5rem',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                mb: 3,
                animation: `${fadeIn} 0.8s ease-out 0.1s both`
              }}
            >
              Everything you need to{' '}
              <Typography component="span" variant="inherit" sx={{
                background: 'linear-gradient(135deg, #1a73e8, #155cb4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                manage projects, collaborate,
              </Typography>
              {' '}and organize your work.
            </Typography>

            {/* Subheadline */}
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

            {/* CTA Buttons */}
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ animation: `${fadeIn} 0.8s ease-out 0.3s both` }}
            >
              <Button
                onClick={() => navigate('/signup')}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#1a73e8',
                  color: '#ffffff',
                  padding: '16px 40px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#155cb4',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 24px rgba(26, 115, 232, 0.3)'
                  },
                  '&:active': { transform: 'translateY(-1px)' },
                }}
              >
                Start For Free →
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{
                  borderColor: '#d0d0d0',
                  color: '#000000',
                  padding: '16px 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  '&:hover': { borderColor: '#1a73e8', color: '#1a73e8', backgroundColor: '#f9fbff' },
                }}
              >
                View Demo
              </Button>
            </Stack>

            {/* Hero Stats Cards */}
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
                    border: '1px solid rgba(26, 115, 232, 0.1)',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(26, 115, 232, 0.1)',
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#1a73e8', mb: 0.5 }}>
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
      </Box>

      {/* ====== FEATURES SECTION ====== */}
      <Box sx={{ py: 14, backgroundColor: 'rgba(240, 245, 255, 0.5)', borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box data-scroll-reveal sx={{ mb: 8 }}>
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

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} data-scroll-reveal>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(26, 115, 232, 0.08)',
                    background: feature.gradient,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 24px 48px rgba(26, 115, 232, 0.12)',
                      borderColor: 'rgba(26, 115, 232, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====== USE CASES SECTION ====== */}
      <Box sx={{ py: 12, backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box data-scroll-reveal sx={{ mb: 8 }}>
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

          <Grid container spacing={3}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} data-scroll-reveal>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #f0f0f0',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
                      borderColor: 'rgba(26, 115, 232, 0.2)',
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====== HIGHLIGHTS SECTION ====== */}
      <Box sx={{ py: 12, backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center">
            {highlights.map((highlight, index) => (
              <Grid item xs={12} sm={4} key={index} data-scroll-reveal>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 100%)',
                      border: '2px solid rgba(26, 115, 232, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====== ROADMAP SECTION ====== */}
      <Box sx={{ py: 14, backgroundColor: 'linear-gradient(135deg, #f9fafb 0%, #f0f5ff 100%)', borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="lg">
          <Box data-scroll-reveal sx={{ mb: 8 }}>
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

          <Grid container spacing={3}>
            {roadmap.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} data-scroll-reveal>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(26, 115, 232, 0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(26, 115, 232, 0.08)',
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====== FAQ SECTION ====== */}
      <Box sx={{ py: 12, backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <Container maxWidth="md">
          <Box data-scroll-reveal sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                color: '#000000',
                fontWeight: 800,
                fontSize: isMobile ? '2rem' : '2.8rem',
              }}
            >
              Questions? We've Got Answers
            </Typography>
          </Box>

          <Stack spacing={2}>
            {faqs.map((faq, index) => (
              <Box
                key={index}
                data-scroll-reveal
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                sx={{
                  border: '1px solid #f0f0f0',
                  borderRadius: '12px',
                  p: 3,
                  backgroundColor: expandedFAQ === index ? '#f9fbff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#1a73e8', boxShadow: '0 4px 12px rgba(26, 115, 232, 0.08)' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, color: '#000', fontSize: '1rem' }}>
                    {faq.question}
                  </Typography>
                  <Box
                    sx={{
                      color: '#1a73e8',
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      transition: 'transform 0.3s ease',
                      transform: expandedFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </Box>
                </Box>
                {expandedFAQ === index && (
                  <Typography sx={{ color: '#666', mt: 2, lineHeight: 1.7, fontSize: '0.95rem', animation: `${fadeIn} 0.3s ease-out` }}>
                    {faq.answer}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ====== FINAL CTA SECTION ====== */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #1a73e8 0%, #155cb4 100%)',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background */}
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
          <Box data-scroll-reveal>
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
                onClick={() => navigate('/signup')}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#1a73e8',
                  padding: '14px 40px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#f0f5ff', transform: 'translateY(-2px)' },
                }}
              >
                Get Started Free
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  padding: '14px 40px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: '#ffffff' },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

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
            {/* Brand */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3px', width: 14 }}>
                  {['#1a73e8', '#ffffff', '#ffffff', '#1a73e8'].map((color, i) => (
                    <Box key={i} sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: color }} />
                  ))}
                </Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
                  ToBeDone
                </Typography>
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                © {new Date().getFullYear()} ToBeDone. Free forever, always.
              </Typography>
            </Box>

            {/* Links */}
            <Stack direction="row" spacing={4}>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: '#ccc',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#1a73e8' }
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
                  '&:hover': { color: '#1a73e8' }
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
                  '&:hover': { color: '#1a73e8' }
                }}
              >
                Terms
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}