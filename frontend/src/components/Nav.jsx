import { useState } from 'react';

export default function Nav({ currentPage = 'dashboard', onPageChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { label: 'Dashboard', path: 'dashboard', icon: '📊' },
        { label: 'Tasks', path: 'tasks', icon: ' ✓' },
        { label: 'Chats', path: 'chats', icon: '💬' },
        { label: 'Notes', path: 'notes', icon: '📝' },
        { label: 'Calendar', path: 'calendar', icon: '📅' },
        { label: 'Settings', path: 'settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: '72px',
                    left: '16px',
                    zIndex: 200,
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}
                className="mobile-menu-btn"
            >
                ☰
            </button>

            {/* Sidebar */}
            <aside style={{
                width: '240px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                overflowY: 'auto',
                padding: '24px 0',
                position: 'relative',
                display: isOpen ? 'block' : 'block'
            }}
                className="nav-sidebar">
                <div style={{ padding: '0 16px', marginBottom: '24px' }}>
                    <h3 style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#64748b',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Main Menu
                    </h3>
                    <nav>
                        {links.map((item) => {
                            const isActive = currentPage === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        onPageChange?.(item.path);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                                        color: isActive ? '#7c3aed' : '#334155',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.target.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.target.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            backgroundColor: '#7c3aed'
                                        }}></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    
                    .nav-sidebar {
                        position: fixed !important;
                        left: 0 !important;
                        top: 64px !important;
                        height: calc(100vh - 64px) !important;
                        width: 240px !important;
                        z-index: 150 !important;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    
                    .nav-sidebar.open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}