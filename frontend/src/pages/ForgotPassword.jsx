import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Stack } from "@mui/material";
import APICallService from "../services/APICallService";
import AuthPageWrapper from "./AuthPageWrapper";

const VIBRANT_PURPLE = "#7c3aed";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await APICallService.forgotPassword(
        email.trim()
      );

      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(
          payload?.message || "Unable to send password reset link."
        );
      }

      setSuccess(
        payload.message ||
          "Password reset link has been sent to your email."
      );

      // Your backend sends the reset link by email.
      // Do NOT navigate immediately to reset-password.
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];

        setError(
          firstError?.message || "Invalid email address."
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        setError("No Internet connection.");
      } else {
        setError(
          error.message ||
            "Unable to send password reset link."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const QuestionIllustration = () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 24 24"
      fill="none"
      stroke={VIBRANT_PURPLE}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.15 }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  return (
    <AuthPageWrapper
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a password reset link."
      illustration={<QuestionIllustration />}
      onSubmit={handleContinue}
      buttonText={loading ? "Sending..." : "Send Reset Link"}
    >
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
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          placeholder="your@email.com"
          required
          disabled={loading}
          error={!!error}
          helperText={error}
          sx={{
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
          }}
        />

        {success && (
          <Typography
            fontSize="0.85rem"
            color="green"
            sx={{ mt: 1 }}
          >
            {success}
          </Typography>
        )}

        <Typography
          fontSize="0.8rem"
          color="#64748b"
          sx={{ mt: 0.5 }}
        >
          Check your email for the password reset link.
        </Typography>
      </Stack>
    </AuthPageWrapper>
  );
}
