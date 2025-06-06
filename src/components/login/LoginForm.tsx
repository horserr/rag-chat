import React, { useState } from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import { useNavigateAfterLogin } from "../../hooks/auth/useNavigateAfterLogin";
import LoginFormFields from "./LoginFormFields";
import LoginFormSubmit from "./LoginFormSubmit";
import LoginFormError from "./LoginFormError";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { navigateAfterLogin, isLoading, error } = useNavigateAfterLogin();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) return;

    try {
      await navigateAfterLogin({ email, password });
      // Navigation will happen automatically after auth check completes
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "Login failed. Please try again."
    : null;
  return (
    <Box component="form" onSubmit={handleLogin} noValidate>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="primary"
        textAlign="center"
      >
        Welcome Back
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Sign in to your account to continue
      </Typography>

      <LoginFormFields
        email={email}
        password={password}
        showPassword={showPassword}
        error={Boolean(errorMessage)}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
      />
      <LoginFormError error={errorMessage} />
      <LoginFormSubmit isLoading={isLoading} onSubmit={handleLogin} />

      <Divider sx={{ my: 2 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onSwitchToRegister}
            sx={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Create Account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
