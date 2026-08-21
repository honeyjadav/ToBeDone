import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { LOCAL_STORAGE_KEYS } from "../constants/Constants";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const VIBRANT_PURPLE = "#7c3aed";

const inputStyles = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${VIBRANT_PURPLE}`,
  },
};

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
  mb: 4,
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Clear any lingering registration state to ensure correct 2FA mode detection
      sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);

      await login(email, password);
      navigate("/two-factor-auth");

      /*
        Expected backend response:

        {
          token: "JWT_TOKEN"
        }
      */
    } catch (error) {
      console.error("Login error:", error);

      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      const message =
        serverMessage ||
        error?.message ||
        "Internal Server Error. Please try again later.";

      setError(typeof message === "string" ? message : String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 3,
        position: "relative",
        overflow: "hidden",

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
      {/* Background Yellow Blob */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "5%",
          width: "500px",
          height: "600px",
          backgroundColor: "#fbbf24",
          borderRadius: "50% / 10% 60% 30% 90%",
          transform: "rotate(20deg)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      {/* Background Yellow Blob */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "10%",
          width: "600px",
          height: "700px",
          backgroundColor: "#fbbf24",
          borderRadius: "50% / 80% 30% 90% 10%",
          transform: "rotate(-10deg)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      {/* Background Dots */}
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
          sx={{
            cursor: "pointer",
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap="6px"
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
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "1000px",
            borderRadius: 6,
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxShadow:
              "0 30px 60px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
            mb: 4,
          }}
        >
          <Grid
            container
            direction={isTablet ? "column-reverse" : "row"}
          >
            {/* Left Pane */}
            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              p={isTablet ? 4 : 8}
              pb={isTablet ? 4 : 10}
              position="relative"
            >
              <LaptopMacIcon
                sx={{
                  fontSize: "20rem",
                  color: VIBRANT_PURPLE,
                  opacity: 0.1,
                  position: "absolute",
                  top: "15%",
                  transform: "scale(1.2)",
                  zIndex: 0,
                }}
              />

              <Stack
                alignItems="center"
                zIndex={1}
                position="relative"
              >
                <Box
                  sx={{
                    width: "300px",
                    height: "220px",
                    backgroundColor: "#e2e8f0",
                    borderRadius: "24px",
                    mb: 5,
                    opacity: 0.5,
                  }}
                />

                <Typography
                  variant="h6"
                  color={VIBRANT_PURPLE}
                  fontWeight={700}
                  fontSize="1.25rem"
                  letterSpacing="-0.25px"
                >
                  Igniting the innovative self
                </Typography>
              </Stack>
            </Grid>

            {/* Right Pane */}
            <Grid
              item
              xs={12}
              md={6}
              p={isTablet ? 4 : 8}
              backgroundColor="#ffffff"
              borderRadius={
                isTablet
                  ? "0"
                  : "0 24px 24px 0"
              }
              borderLeft={
                isTablet
                  ? "none"
                  : "1px solid #e2e8f0"
              }
            >
              <Stack spacing={3.5}>

                {/* Login / Signup Switcher */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  my={2}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    backgroundColor="#f1f5f9"
                    borderRadius="50px"
                    padding="4px"
                    gap="4px"
                  >
                    {[
                      {
                        label: "Signup",
                        path: "/register",
                      },
                      {
                        label: "Login",
                        path: "/login",
                        active: true,
                      },
                    ].map((tab) => (
                      <Button
                        key={tab.label}
                        variant={
                          tab.active
                            ? "contained"
                            : "text"
                        }
                        onClick={() =>
                          navigate(tab.path)
                        }
                        sx={{
                          borderRadius: "50px",
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 600,
                          px: 6,
                          py: 1.25,
                          color: tab.active
                            ? "white"
                            : "#64748b",
                          backgroundColor:
                            tab.active
                              ? VIBRANT_PURPLE
                              : "transparent",

                          "&:hover": {
                            backgroundColor:
                              tab.active
                                ? VIBRANT_PURPLE
                                : "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  <Stack spacing={2.2}>

                    {/* Email */}
                    <Stack spacing={0.8}>
                      <Typography
                        fontSize="0.9rem"
                        fontWeight={600}
                        color="#1e293b"
                      >
                        Email
                      </Typography>

                      <TextField
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        fullWidth
                        placeholder="Enter your email"
                        required
                        sx={inputStyles}
                      />
                    </Stack>

                    {/* Password */}
                    <Stack spacing={0.8}>
                      <Typography
                        fontSize="0.9rem"
                        fontWeight={600}
                        color="#1e293b"
                      >
                        Password
                      </Typography>

                      <TextField
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        fullWidth
                        placeholder="Enter your password"
                        required
                        sx={inputStyles}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  setShowPassword(
                                    (show) => !show
                                  )
                                }
                                edge="end"
                                sx={{
                                  color: "#94a3b8",
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>

                    {/* Remember / Forgot */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={-0.5}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) =>
                              setRememberMe(
                                e.target.checked
                              )
                            }
                            sx={{
                              color: "#cbd5e1",
                              "&.Mui-checked": {
                                color: VIBRANT_PURPLE,
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            fontSize="0.9rem"
                            color="#64748b"
                            fontWeight={500}
                          >
                            Remember me
                          </Typography>
                        }
                      />

                      <Link
                        href="#"
                        underline="hover"
                        onClick={() =>
                          navigate(
                            "/forgot-password"
                          )
                        }
                        sx={{
                          fontSize: "0.9rem",
                          color: "#64748b",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Forgot Password
                      </Link>
                    </Stack>

                    {/* API Error */}
                    {error && (
                      <Typography
                        sx={{
                          color: "#dc2626",
                          fontSize: "0.875rem",
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </Typography>
                    )}

                    {/* Login Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{
                        backgroundColor:
                          VIBRANT_PURPLE,
                        color: "white",
                        padding: "14px",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "12px",
                        mt: 1,
                        boxShadow:
                          "0 6px 18px rgba(124, 58, 237, 0.4)",

                        "&:hover": {
                          backgroundColor:
                            VIBRANT_PURPLE,
                          boxShadow:
                            "0 8px 24px rgba(124, 58, 237, 0.5)",
                        },
                      }}
                    >
                      {loading
                        ? "Logging in..."
                        : "Login"}
                    </Button>

                  </Stack>
                </form>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}