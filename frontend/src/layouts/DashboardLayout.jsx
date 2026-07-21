import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';

export default function DashboardLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, width: '100%' }}>
        <Box sx={{ width: { xs: '100%', md: 240 }, borderRight: '1px solid #e2e8f0', backgroundColor: 'white', flexShrink: 0 }}>
          <Nav />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
          <Toolbar />
          <Box sx={{ flex: 1 }}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
