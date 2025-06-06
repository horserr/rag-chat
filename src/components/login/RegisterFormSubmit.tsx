import React from "react";
import {
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";

interface RegisterFormSubmitProps {
  isLoading: boolean;
  disabled?: boolean;
  onSubmit: () => void;
}

const RegisterFormSubmit: React.FC<RegisterFormSubmitProps> = ({
  isLoading,
  disabled = false,
  onSubmit,
}) => {
  const theme = useTheme();

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      disabled={isLoading || disabled}
      onClick={onSubmit}
      sx={{
        mt: 1,
        mb: 2,
        py: 1.5,
        fontWeight: "bold",
        position: "relative",
      }}
    >
      {isLoading ? (
        <CircularProgress
          size={24}
          sx={{
            color: theme.palette.primary.contrastText,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      ) : (
        "Create Account"
      )}
    </Button>
  );
};

export default RegisterFormSubmit;
