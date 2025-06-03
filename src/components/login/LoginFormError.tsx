import React from "react";
import { Typography } from "@mui/material";

interface LoginFormErrorProps {
  error?: string | null;
}

const LoginFormError: React.FC<LoginFormErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
      {error}
    </Typography>
  );
};

export default LoginFormError;
