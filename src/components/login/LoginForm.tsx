import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import LoginFormFields from "./LoginFormFields";
import LoginFormSubmit from "./LoginFormSubmit";
import LoginFormError from "./LoginFormError";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (result) => {
          if (result.status_code === 200 && result.data) {
            navigate("/chat");
          }
        },
      }
    );
  };

  const error = loginMutation.error
    ? loginMutation.error instanceof Error
      ? loginMutation.error.message
      : "Login failed. Please try again."
    : null;

  return (
    <Box component="form" onSubmit={handleLogin} noValidate>
      <LoginFormFields
        email={email}
        password={password}
        showPassword={showPassword}
        error={Boolean(error)}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
      />

      <LoginFormError error={error} />

      <LoginFormSubmit
        isLoading={loginMutation.isPending}
        onSubmit={() => {}}
      />
    </Box>
  );
};

export default LoginForm;
