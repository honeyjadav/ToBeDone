import { useEffect, useRef } from "react";
import {
    Snackbar,
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";

const TYPE_CONFIG = {
    DIGEST: { icon: AutoAwesomeIcon, color: "#7c3aed", bg: "#f3f0fe" },
    DIRECT: { icon: AlternateEmailIcon, color: "#3b82f6", bg: "#eff6ff" },
    TASK: {icon: AssignmentIcon,color: "#059669",bg: "#ecfdf5",},
};

/* =========================================================
   NOTIFICATION SOUND — module-level singletons, survive
   component unmount/remount (e.g. workspace switch)
   ========================================================= */

let audioContext = null;
let hasPlayedOnce = false; // tracks across remounts, not just this instance

const SOUND_PREF_KEY = "notificationSoundEnabled";

export const isNotificationSoundEnabled = () => {
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    return stored === null ? true : stored === "true"; // default: on
};

export const setNotificationSoundEnabled = (enabled) => {
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
};

const getAudioContext = () => {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        audioContext = new AudioContext();
    }
    return audioContext;
};

// Unlock once globally, not tied to this component's lifecycle
let audioUnlockBound = false;
const bindAudioUnlockOnce = () => {
    if (audioUnlockBound) return;
    audioUnlockBound = true;

    const unlock = async () => {
        try {
            const context = getAudioContext();
            if (context?.state === "suspended") {
                await context.resume();
            }
        } catch (error) {
            console.warn("Unable to unlock notification audio:", error);
        }
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
};

bindAudioUnlockOnce(); // run once when this module first loads

const playNotificationSound = async () => {
    if (!isNotificationSoundEnabled()) return;

    try {
        const context = getAudioContext();
        if (!context) return;

        if (context.state === "suspended") {
            await context.resume();
        }

        const now = context.currentTime;

        // First ding
        const osc1 = context.createOscillator();
        const gain1 = context.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc1.connect(gain1);
        gain1.connect(context.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        // Second ding
        const osc2 = context.createOscillator();
        const gain2 = context.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1175, now + 0.08);
        gain2.gain.setValueAtTime(0, now + 0.08);
        gain2.gain.linearRampToValueAtTime(0.16, now + 0.09);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc2.connect(gain2);
        gain2.connect(context.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.3);
    } catch (error) {
        console.warn("Unable to play notification sound:", error);
    }
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function NotificationToast({ notification, onClose, onOpen }) {
    const previousNotificationId = useRef(null);

    useEffect(() => {
        if (!notification) return;

        const notificationId =
            notification.notificationId ||
            notification._id ||
            notification.id;

        if (!notificationId) return;

        if (!hasPlayedOnce) {
            hasPlayedOnce = true;
            previousNotificationId.current = notificationId;
            return;
        }

        if (previousNotificationId.current !== notificationId) {
            previousNotificationId.current = notificationId;
            playNotificationSound();
        }
    }, [notification]);

    if (!notification) return null;

    const cfg =
        TYPE_CONFIG[notification.type] || TYPE_CONFIG.DIRECT;

    const Icon = cfg.icon;

    const handleOpen = () => {
        onOpen?.(notification);
        onClose?.();
    };

    return (
        <Snackbar
            open={Boolean(notification)}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            sx={{ mt: 7 }}
        >
            <Box
                onClick={handleOpen}
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                    width: 360,
                    maxWidth: "calc(100vw - 32px)",
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.15)",
                    cursor: "pointer",
                    animation:
                        "notificationSlideIn 0.25s ease-out",
                    "@keyframes notificationSlideIn": {
                        from: {
                            opacity: 0,
                            transform: "translateX(30px)",
                        },
                        to: {
                            opacity: 1,
                            transform: "translateX(0)",
                        },
                    },
                    "&:hover": {
                        boxShadow:
                            "0 12px 35px rgba(15, 23, 42, 0.20)",
                    },
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "9px",
                        flexShrink: 0,
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: "13.5px",
                            fontWeight: 700,
                            color: "#1e293b",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {notification.title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "12.5px",
                            color: "#64748b",
                            mt: 0.35,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {notification.summary}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            mt: 0.6,
                        }}
                    >
                        Just now
                    </Typography>
                </Box>

                <IconButton
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose?.();
                    }}
                    sx={{
                        p: 0.4,
                        flexShrink: 0,
                        "&:hover": {
                            backgroundColor: "#f1f5f9",
                        },
                    }}
                >
                    <CloseIcon
                        sx={{
                            fontSize: 16,
                            color: "#94a3b8",
                        }}
                    />
                </IconButton>
            </Box>
        </Snackbar>
    );
}