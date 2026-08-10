import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { mockNotifications } from "../pages/Notifications";

export default function Header() {
    const navigate = useNavigate();

    // TEMP local state, seeded from the same mock data as the full Notifications
    // page — replace with a real fetch (GET /api/notifications) once the
    // backend exists. Kept here (not inside NotificationDropdown) so mark-read
    // state is shared if you later lift it into a context/provider.
    const [notifications, setNotifications] = useState(mockNotifications);

    const handleMarkRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleOpenNotification = (notification) => {
        if (notification.type === "DIGEST") {
            navigate("/dashboard/digest");
        } else {
            navigate("/dashboard/tasks");
        }
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            height: '60px',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
            {/* Logo + Name */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
            }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11l3 3L22 4" stroke="#ffffff" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"
                            stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h1 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1e293b',
                    letterSpacing: '-0.3px',
                    whiteSpace: 'nowrap'
                }}>
                    ToBeDone
                </h1>
            </div>

            {/* Search bar */}
            <div style={{
                flex: 1,
                maxWidth: '320px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '0 12px',
                height: '36px'
            }} className="header-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2" />
                    <path d="m21 21-4.3-4.3" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    placeholder="Search your tasks...."
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '13px',
                        color: '#334155',
                        width: '100%'
                    }}
                />
            </div>

            {/* Right side */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0
            }}>
                <button style={iconBtnStyle} aria-label="Messages">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16v16H4z" stroke="none" />
                        <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6Z"
                            stroke="#475569" strokeWidth="1.8" />
                        <path d="m2 7 8.97 6.28a2 2 0 0 0 2.06 0L22 7"
                            stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Notification bell — now fed with data, mark-read state, and click routing */}
                <NotificationDropdown
                    notifications={notifications}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                    onOpenNotification={handleOpenNotification}
                />

                <div style={{
                    width: '1px',
                    height: '24px',
                    background: '#e2e8f0'
                }} />

                <div
    onClick={() => navigate("/dashboard/profile")}
    style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
    }}
>
    <div
        style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "#ede9fe",
            color: "#7c3aed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
        }}
    >
        JD
    </div>

    <span
        className="username-display"
        style={{
            color: "#334155",
            fontSize: "13.5px",
            fontWeight: 600,
            whiteSpace: "nowrap",
        }}
    >
        John Doe
    </span>
</div>


            </div>

            <style>{`
                .header-search { transition: background 0.2s ease; }
                .header-search:focus-within { background-color: #e9edf3 !important; }
                @media (max-width: 768px) {
                    .header-search { display: none !important; }
                }
                @media (max-width: 640px) {
                    .username-display { display: none !important; }
                }
            `}</style>
        </header>
    );
}

const iconBtnStyle = {
    position: 'relative',
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    border: 'none',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0
};