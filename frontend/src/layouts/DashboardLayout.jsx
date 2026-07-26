import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Nav, { HEADER_HEIGHT } from '../components/Nav';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
      <Header />

      <Box sx={{ display: 'flex', width: '100%', pt: `${HEADER_HEIGHT}px` }}>
        <Nav isOpen={isOpen} setIsOpen={setIsOpen} />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: 0,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
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