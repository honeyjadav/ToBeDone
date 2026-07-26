import { useState, useEffect } from 'react';
import { Box, Typography, Switch, TextField, Avatar, Button, Snackbar, Alert, Divider } from '@mui/material';

function SettingRow({ title, description, control }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{title}</Typography>
                {description && (
                    <Typography sx={{ fontSize: '12.5px', color: '#64748b', mt: 0.25 }}>{description}</Typography>
                )}
            </Box>
            {control}
        </Box>
    );
}

function SectionCard({ title, children }) {
    return (
        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: '#ffffff', p: 2.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', mb: 0.5 }}>{title}</Typography>
            <Divider sx={{ my: 1.5 }} />
            {children}
        </Box>
    );
}

export default function Settings() {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tobedone-dark-mode') === 'true');
    const [compactSidebar, setCompactSidebar] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [chatSound, setChatSound] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        localStorage.setItem('tobedone-dark-mode', darkMode);
    }, [darkMode]);

    const handleSave = () => {
        setSaved(true);
    };

    return (
        <Box sx={{ p: 3, maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', mb: 0.5 }}>Settings</Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 3 }}>
                Manage your profile, appearance, and notification preferences
            </Typography>

            <SectionCard title="Profile">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, fontSize: '18px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                        {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{name}</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>{email}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Full name"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px' }}
                    />
                    <TextField
                        label="Email"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ flex: 1, minWidth: '200px' }}
                    />
                </Box>
            </SectionCard>

            <SectionCard title="Appearance">
                <SettingRow
                    title="Dark Mode"
                    description="Switch the interface to a darker color scheme"
                    control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} sx={{ '& .MuiSwitch-track': { backgroundColor: darkMode ? '#7c3aed' : undefined } }} />}
                />
                <SettingRow
                    title="Compact Sidebar"
                    description="Start with the sidebar collapsed by default"
                    control={<Switch checked={compactSidebar} onChange={(e) => setCompactSidebar(e.target.checked)} />}
                />
            </SectionCard>

            <SectionCard title="Notifications">
                <SettingRow
                    title="Email Notifications"
                    description="Get updates about tasks and mentions via email"
                    control={<Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />}
                />
                <SettingRow
                    title="Push Notifications"
                    description="Receive real-time alerts in your browser"
                    control={<Switch checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />}
                />
                <SettingRow
                    title="Chat Sound"
                    description="Play a sound when a new message arrives"
                    control={<Switch checked={chatSound} onChange={(e) => setChatSound(e.target.checked)} />}
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