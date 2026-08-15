import { useState, useEffect } from 'react';
import { Box, Typography, Switch, TextField, Avatar, Button, Snackbar, Alert, Divider } from '@mui/material';
import { applyAppSettings, getAppSettings } from '../utils/preferences';

function SettingRow({ title, description, control, darkMode }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: darkMode ? '#e2e8f0' : '#1e293b' }}>{title}</Typography>
                {description && (
                    <Typography sx={{ fontSize: '12.5px', color: darkMode ? '#94a3b8' : '#64748b', mt: 0.25 }}>{description}</Typography>
                )}
            </Box>
            {control}
        </Box>
    );
}

function SectionCard({ title, children, darkMode }) {
    return (
        <Box
            sx={{
                border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : '#e5e7eb'}`,
                borderRadius: '10px',
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                p: 2.5,
                mb: 2.5,
            }}
        >
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', mb: 0.5 }}>{title}</Typography>
            <Divider sx={{ my: 1.5, borderColor: darkMode ? 'rgba(148, 163, 184, 0.15)' : undefined }} />
            {children}
        </Box>
    );
}

export default function Settings() {
    const initialSettings = getAppSettings();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
    const [compactSidebar, setCompactSidebar] = useState(initialSettings.compactSidebar);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [chatSound, setChatSound] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const handleSettingsChange = (event) => {
            const nextSettings = event.detail ?? getAppSettings();
            setDarkMode(Boolean(nextSettings.darkMode));
            setCompactSidebar(Boolean(nextSettings.compactSidebar));
        };

        window.addEventListener('tobedone-settings-changed', handleSettingsChange);
        return () => window.removeEventListener('tobedone-settings-changed', handleSettingsChange);
    }, []);

    useEffect(() => {
        applyAppSettings({ darkMode, compactSidebar });
    }, [darkMode, compactSidebar]);

    const handleSave = () => {
        setSaved(true);
    };

    return (
        <Box sx={{ p: 3, maxWidth: '100%', backgroundColor: darkMode ? '#020817' : '#f8fafc', minHeight: '100vh' }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: darkMode ? '#f8fafc' : '#1e293b', mb: 0.5 }}>Settings</Typography>
            <Typography sx={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b', mb: 3 }}>
                Manage your profile, appearance, and notification preferences
            </Typography>

            <SectionCard title="Profile" darkMode={darkMode}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, fontSize: '18px', fontWeight: 700, backgroundColor: darkMode ? '#312e81' : '#ede9fe', color: darkMode ? '#c4b5fd' : '#7c3aed' }}>
                        {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: darkMode ? '#f8fafc' : '#1e293b' }}>{name}</Typography>
                        <Typography sx={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#94a3b8' }}>{email}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Full name"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px', '& .MuiOutlinedInput-root': { backgroundColor: darkMode ? '#0b1220' : '#fff' }, '& .MuiInputLabel-root': { color: darkMode ? '#cbd5e1' : undefined }, '& .MuiOutlinedInput-input': { color: darkMode ? '#f8fafc' : '#0f172a' } }}
                    />
                    <TextField
                        label="Email"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px', '& .MuiOutlinedInput-root': { backgroundColor: darkMode ? '#0b1220' : '#fff' }, '& .MuiInputLabel-root': { color: darkMode ? '#cbd5e1' : undefined }, '& .MuiOutlinedInput-input': { color: darkMode ? '#f8fafc' : '#0f172a' } }}
                    />
                </Box>
            </SectionCard>

            <SectionCard title="Appearance" darkMode={darkMode}>
                <SettingRow
                    title="Dark Mode"
                    description="Switch the interface to a darker color scheme"
                    control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} sx={{ '& .MuiSwitch-track': { backgroundColor: darkMode ? '#7c3aed' : undefined } }} />}
                    darkMode={darkMode}
                />
                <SettingRow
                    title="Compact Sidebar"
                    description="Start with the sidebar collapsed by default"
                    control={<Switch checked={compactSidebar} onChange={(e) => setCompactSidebar(e.target.checked)} />}
                    darkMode={darkMode}
                />
            </SectionCard>

            <SectionCard title="Notifications" darkMode={darkMode}>
                <SettingRow
                    title="Email Notifications"
                    description="Get updates about tasks and mentions via email"
                    control={<Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />}
                    darkMode={darkMode}
                />
                <SettingRow
                    title="Push Notifications"
                    description="Receive real-time alerts in your browser"
                    control={<Switch checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />}
                    darkMode={darkMode}
                />
                <SettingRow
                    title="Chat Sound"
                    description="Play a sound when a new message arrives"
                    control={<Switch checked={chatSound} onChange={(e) => setChatSound(e.target.checked)} />}
                    darkMode={darkMode}
                />
            </SectionCard>

            <Button
                onClick={handleSave}
                sx={{
                    backgroundColor: '#7c3aed',
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#6d28d9' },
                }}
            >
                Save Changes
            </Button>

            <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" sx={{ fontSize: '13px' }}>Settings saved successfully</Alert>
            </Snackbar>
        </Box>
    );
}