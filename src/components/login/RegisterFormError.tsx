import React from "react";
import { Typography } from "@mui/material";

interface RegisterFormErrorProps {
  error?: string | null;
}

const RegisterFormError: React.FC<RegisterFormErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
      {error}
    </Typography>
  );
};

export default RegisterFormError;
