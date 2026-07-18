export default function Header() {
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: '64px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
            <h1 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: '#7c3aed',
                letterSpacing: '-0.5px'
            }}>
                CloudCollab
            </h1>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <span style={{
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'none'
                }} className="username-display">
                    John Doe
                </span>

                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#7c3aed',
                        backgroundColor: 'transparent',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                        e.target.style.borderColor = '#7c3aed';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = '#e2e8f0';
                    }}
                >
                    Logout
                </button>
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .username-display {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
}