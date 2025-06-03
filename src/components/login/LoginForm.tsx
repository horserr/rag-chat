import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigateAfterLogin } from "../../hooks/auth/useNavigateAfterLogin";
import LoginFormFields from "./LoginFormFields";
import LoginFormSubmit from "./LoginFormSubmit";
import LoginFormError from "./LoginFormError";

const LoginForm: React.FC = () => {
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
    </Box>
  );
};

export default LoginForm;
