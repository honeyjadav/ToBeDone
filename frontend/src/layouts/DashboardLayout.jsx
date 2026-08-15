import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Nav, { HEADER_HEIGHT } from '../components/Nav';
import ErrorBoundary from '../components/ErrorBoundary';
import { getAppSettings } from '../utils/preferences';

export default function DashboardLayout() {
  const [settings, setSettings] = useState(() => getAppSettings());
  const [isOpen, setIsOpen] = useState(() => !getAppSettings().compactSidebar);

  useEffect(() => {
    const handleSettingsChange = (event) => {
      const nextSettings = event.detail ?? getAppSettings();
      setSettings(nextSettings);
      setIsOpen(!nextSettings.compactSidebar);
    };

    window.addEventListener('tobedone-settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
    };
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: settings.darkMode ? '#020817' : '#f8fafc',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Header darkMode={settings.darkMode} />

      <Box sx={{ display: 'flex', width: '100%', height: '100%', pt: `${HEADER_HEIGHT}px` }}>
        <Nav isOpen={isOpen} setIsOpen={setIsOpen} darkMode={settings.darkMode} />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: 0,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflow: 'hidden',
            backgroundColor: settings.darkMode ? '#020817' : '#f8fafc',
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}