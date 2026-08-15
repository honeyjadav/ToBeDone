import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import baseTheme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';
import { getAppSettings } from './utils/preferences';

export default function App() {
  const [settings, setSettings] = useState(() => getAppSettings());
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/two-factor-auth'].includes(location.pathname);
  const effectiveDarkMode = !isPublicRoute && settings.darkMode;

  useEffect(() => {
    const handleSettingsChange = (event) => {
      setSettings(event.detail ?? getAppSettings());
    };

    window.addEventListener('tobedone-settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
    };
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: effectiveDarkMode ? 'dark' : 'light',
          background: {
            default: effectiveDarkMode ? '#020817' : '#f8fafc',
            paper: effectiveDarkMode ? '#0f172a' : '#ffffff',
          },
          text: {
            ...baseTheme.palette.text,
            primary: effectiveDarkMode ? '#e2e8f0' : '#1e293b',
            secondary: effectiveDarkMode ? '#94a3b8' : '#64748b',
          },
          divider: effectiveDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.08)',
        },
      }),
    [effectiveDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}
