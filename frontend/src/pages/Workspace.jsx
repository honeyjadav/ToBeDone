import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Card,
  Grid,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  Modal,
  Avatar,
  InputAdornment,
} from "@mui/material";

import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { useAuth } from "../hooks/useAuth";
import APICallService from "../services/APICallService";

const VIBRANT_PURPLE = "#7c3aed";
const SEARCH_THRESHOLD = 6;
const CARD_HEIGHT = { xs: "auto", md: "640px" };

const AVATAR_PALETTE = [
  { bg: "#ede9fe", color: "#7c3aed" },
  { bg: "#dbeafe", color: "#2563eb" },
  { bg: "#dcfce7", color: "#16a34a" },
  { bg: "#fef3c7", color: "#d97706" },
  { bg: "#fce7f3", color: "#db2777" },
  { bg: "#e0e7ff", color: "#4f46e5" },
  { bg: "#ffe4e6", color: "#e11d48" },
];

function colorFor(id = "") {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const backgroundPatternBase = {
  content: '""',
  position: "absolute",
  border: "1px solid #d1d5db",
  borderRadius: "16px",
  transform: "rotate(-45deg)",
  zIndex: -1,
};

const headerStackStyles = {
  width: "100%",
  maxWidth: "1200px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3,
  flexShrink: 0,
};

const backgroundDots = [
  { top: 50, right: 30 },
  { top: 150, right: 80 },
  { top: 250, right: 50 },
  { bottom: 50, left: 30 },
  { bottom: 150, left: 80 },
  { bottom: 250, left: 50 },
].map((dot, i) => (
  <Box
    key={i}
    sx={{
      position: "absolute",
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: "#000000",
      opacity: 0.2,
      zIndex: 0,
      ...dot,
    }}
  />
));

const workspaceCardStyles = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  p: 2.5,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  display: "flex",
  alignItems: "center",
  gap: 2.5,
  width: "100%",
  flexShrink: 0,

  "&:hover": {
    borderColor: VIBRANT_PURPLE,
    backgroundColor: "#f8fafc",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(124, 58, 237, 0.12)",
  },
};

export default function WorkspaceSelection() {
  const navigate = useNavigate();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    workspaces,
    workspacesLoading,
    fetchWorkspaces,
    selectWorkspace,
    createWorkspace,
  } = useAuth();

  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  // Create workspace
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join workspace
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    fetchWorkspaces();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredWorkspaces = useMemo(() => {
    if (!query.trim()) {
      return workspaces;
    }

    const q = query.trim().toLowerCase();

    return workspaces.filter((w) =>
      w.name.toLowerCase().includes(q),
    );
  }, [workspaces, query]);

  const hasWorkspaces = workspaces.length > 0;

  // --------------------------------------------------
  // Select Workspace
  // --------------------------------------------------

  const handleSelectWorkspace = async (workspace) => {
    try {
      setError("");

      await selectWorkspace(workspace.workspaceId);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.message || "Unable to open that workspace.",
      );
    }
  };

  // --------------------------------------------------
  // Create Workspace
  // --------------------------------------------------

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    setCreateError("");

    if (!newName.trim()) {
      setCreateError("Workspace name is required.");
      return;
    }

    try {
      setCreating(true);

      await createWorkspace({
        name: newName.trim(),
      });

      setModalOpen(false);
      setNewName("");

      navigate("/dashboard");
    } catch (err) {
      setCreateError(
        err?.message || "Unable to create workspace.",
      );
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // Join Workspace
  // --------------------------------------------------

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();

    setJoinError("");

    const token = inviteToken.trim();

    if (!token) {
      setJoinError("Invite token is required.");
      return;
    }

    try {
      setJoining(true);

      const response =
        await APICallService.acceptInvite(token);

      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(
          payload?.message || "Unable to join workspace.",
        );
      }

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   message: "Invite accepted successfully",
       *   data: {
       *     workspaceId,
       *     role
       *   }
       * }
       */

      const joinedWorkspaceId =
        payload?.data?.workspaceId;

      if (!joinedWorkspaceId) {
        throw new Error(
          "Workspace joined, but workspace ID was not returned.",
        );
      }

      // Refresh workspace list so the newly joined
      // workspace appears immediately.
      await fetchWorkspaces();

      // Select the newly joined workspace.
      await selectWorkspace(joinedWorkspaceId);

      setInviteToken("");
      setJoinModalOpen(false);

      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Unable to join workspace.";

      setJoinError(message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 3,
        position: "relative",

        "&::before": {
          ...backgroundPatternBase,
          width: "300px",
          height: "300px",
          top: "10%",
          left: "-100px",
        },

        "&::after": {
          ...backgroundPatternBase,
          width: "400px",
          height: "400px",
          bottom: "-50px",
          right: "-100px",
        },
      }}
    >
      {/* Background shapes */}

      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "5%",
          width: "500px",
          height: "500px",
          backgroundColor: "#fbbf24",
          borderRadius: "50% / 10% 60% 30% 90%",
          transform: "rotate(20deg)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "10%",
          width: "600px",
          height: "500px",
          backgroundColor: "#fbbf24",
          borderRadius: "50% / 80% 30% 90% 10%",
          transform: "rotate(-10deg)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      {backgroundDots}

      {/* Header */}

      <Stack
        direction="row"
        sx={{
          ...headerStackStyles,
          px: (theme) =>
            theme.breakpoints.down("sm") ? 2 : 4,
        }}
        zIndex={1}
        position="relative"
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap="4px"
            width={28}
          >
            {[
              VIBRANT_PURPLE,
              "#000000",
              "#000000",
              VIBRANT_PURPLE,
            ].map((color, i) => (
              <Box
                key={i}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: "2.1rem",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "-1.5px",
            }}
          >
            ToBeDone
          </Typography>
        </Stack>
      </Stack>

      {/* Main Card */}

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          flex: 1,
          minHeight: 0,
          pb: 3,
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "1100px",
            height: CARD_HEIGHT,
            maxHeight: "100%",
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          <Grid
            container
            direction={
              isTablet ? "column-reverse" : "row"
            }
            spacing={0}
            sx={{ height: "100%" }}
          >
            {/* LEFT PANE */}

            <Grid
              item
              xs={12}
              md={5}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              p={isTablet ? 4 : 6}
              position="relative"
              sx={{
                background:
                  "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                overflow: "hidden",
                height: isTablet ? "auto" : "100%",
              }}
            >
              <Stack
                alignItems="center"
                gap={4}
                sx={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 300,
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LaptopMacIcon
                    sx={{
                      fontSize: "18rem",
                      color: VIBRANT_PURPLE,
                      opacity: 0.08,
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform:
                        "translate(-50%, -50%) scale(1.3)",
                    }}
                  />

                  <Box
                    sx={{
                      position: "relative",
                      width: "280px",
                      height: "200px",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "20px",
                      border: "2px solid #cbd5e1",
                      opacity: 0.6,
                      transform: "translateY(-18px)",
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: VIBRANT_PURPLE,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    letterSpacing: "-0.25px",
                  }}
                >
                  Select your active environment
                </Typography>
              </Stack>
            </Grid>

            {/* RIGHT PANE */}

            <Grid
              item
              xs={12}
              md={7}
              backgroundColor="#ffffff"
              borderRadius={
                isTablet ? "0" : "0 24px 24px 0"
              }
              borderLeft={
                isTablet ? "none" : "1px solid #e2e8f0"
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                height: isTablet ? "auto" : "100%",
                minHeight: 0,
                p: isTablet ? 4 : 5,
              }}
            >
              <Stack
                spacing={1}
                sx={{
                  flexShrink: 0,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "1.7rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Select Your Workspace
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Choose where you want to work today
                </Typography>
              </Stack>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    flexShrink: 0,
                    mb: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              {hasWorkspaces &&
                workspaces.length > SEARCH_THRESHOLD && (
                  <TextField
                    size="small"
                    placeholder="Search workspaces..."
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    sx={{
                      flexShrink: 0,
                      mb: 2,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{
                              fontSize: 18,
                              color: "#94a3b8",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

              {/* Workspace list */}

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: hasWorkspaces
                    ? "auto"
                    : "hidden",
                  pr: 1,

                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },

                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#e2e8f0",
                    borderRadius: "3px",
                  },

                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {workspacesLoading ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%" }}
                  >
                    <CircularProgress
                      sx={{
                        color: VIBRANT_PURPLE,
                      }}
                    />
                  </Stack>
                ) : !hasWorkspaces ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ede9fe",
                        color: VIBRANT_PURPLE,
                      }}
                    >
                      <AddBusinessIcon
                        sx={{ fontSize: 32 }}
                      />
                    </Box>

                    <Stack spacing={0.5}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: "1.05rem",
                        }}
                      >
                        No workspaces yet
                      </Typography>

                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: "0.9rem",
                          maxWidth: 320,
                        }}
                      >
                        You're not part of any workspace.
                        Create one to get started.
                      </Typography>
                    </Stack>
                  </Stack>
                ) : filteredWorkspaces.length === 0 ? (
                  <Typography
                    sx={{
                      color: "#64748b",
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    No workspaces match "{query}"
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {filteredWorkspaces.map((ws) => {
                      const { bg, color } = colorFor(
                        ws.workspaceId,
                      );

                      return (
                        <Box
                          key={ws.workspaceId}
                          sx={workspaceCardStyles}
                          onClick={() =>
                            handleSelectWorkspace(ws)
                          }
                        >
                          <Avatar
                            src={ws.logo || undefined}
                            variant="rounded"
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: "12px",
                              backgroundColor: bg,
                              color,
                              fontWeight: 700,
                              fontSize: "1rem",
                              flexShrink: 0,
                            }}
                          >
                            {!ws.logo &&
                              getInitials(ws.name)}
                          </Avatar>

                          <Stack
                            spacing={0.5}
                            sx={{
                              flexGrow: 1,
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              noWrap
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: "1rem",
                              }}
                            >
                              {ws.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                              }}
                            >
                              Role: {ws.role}
                            </Typography>
                          </Stack>

                          <ArrowForwardIosIcon
                            sx={{
                              color: "#cbd5e1",
                              fontSize: "1.1rem",
                              flexShrink: 0,
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              {/* Bottom Actions */}

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                  flexShrink: 0,
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Create */}

                <Button
                  onClick={() => {
                    setCreateError("");
                    setNewName("");
                    setModalOpen(true);
                  }}
                  startIcon={<AddIcon />}
                  sx={{
                    color: VIBRANT_PURPLE,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Create a new workspace
                </Button>

                {/* Join */}

                <Button
                  onClick={() => {
                    setJoinError("");
                    setInviteToken("");
                    setJoinModalOpen(true);
                  }}
                  startIcon={<GroupAddIcon />}
                  sx={{
                    color: VIBRANT_PURPLE,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Join a workspace
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* =====================================================
          CREATE WORKSPACE MODAL
          ===================================================== */}

      <Modal
        open={modalOpen}
        onClose={() =>
          !creating && setModalOpen(false)
        }
      >
        <Box
          component="form"
          onSubmit={handleCreateWorkspace}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxWidth: "90vw",
            backgroundColor: "#fff",
            borderRadius: "16px",
            p: 4,
            boxShadow: 24,
          }}
        >
          <Stack spacing={2.5}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Create a new workspace
            </Typography>

            <TextField
              label="Workspace name"
              value={newName}
              onChange={(e) =>
                setNewName(e.target.value)
              }
              fullWidth
              autoFocus
              required
              disabled={creating}
              error={!!createError}
              helperText={createError}
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Button
                onClick={() => setModalOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={creating}
                sx={{
                  backgroundColor: VIBRANT_PURPLE,

                  "&:hover": {
                    backgroundColor: "#6d28d9",
                  },
                }}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      {/* =====================================================
          JOIN WORKSPACE MODAL
          ===================================================== */}

      <Modal
        open={joinModalOpen}
        onClose={() =>
          !joining && setJoinModalOpen(false)
        }
      >
        <Box
          component="form"
          onSubmit={handleJoinWorkspace}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxWidth: "90vw",
            backgroundColor: "#fff",
            borderRadius: "16px",
            p: 4,
            boxShadow: 24,
          }}
        >
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Join a workspace
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                Enter the invite token you received by
                email.
              </Typography>
            </Stack>

            <TextField
              label="Invite token"
              placeholder="Enter invite token"
              value={inviteToken}
              onChange={(e) =>
                setInviteToken(e.target.value)
              }
              fullWidth
              autoFocus
              disabled={joining}
              error={!!joinError}
              helperText={joinError}
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Button
                onClick={() =>
                  setJoinModalOpen(false)
                }
                disabled={joining}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={
                  joining || !inviteToken.trim()
                }
                sx={{
                  backgroundColor: VIBRANT_PURPLE,

                  "&:hover": {
                    backgroundColor: "#6d28d9",
                  },
                }}
              >
                {joining ? "Joining..." : "Join"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}