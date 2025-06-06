import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  VerifiedUser,
} from "@mui/icons-material";

interface RegisterFormFieldsProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    verificationCode: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (field: string, value: string) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSendCode: () => void;
  isCodeLoading: boolean;
  countdown: number;
  canSendCode: boolean;
  error: boolean;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  formData,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSendCode,
  isCodeLoading,
  countdown,
  canSendCode,
  error,
}) => {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        error={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <Button
          variant="outlined"
          onClick={onSendCode}
          disabled={!formData.email || !canSendCode || isCodeLoading}
          sx={{
            minWidth: 120,
            mt: 2,
            height: "56px",
          }}
        >
          {countdown > 0 ? `${countdown}s` : isCodeLoading ? "Sending..." : "Send Code"}
        </Button>
      </Box>

      <TextField
        margin="normal"
        required
        fullWidth
        id="verificationCode"
        label="Verification Code"
        name="verificationCode"
        value={formData.verificationCode}
        onChange={(e) => onInputChange("verificationCode", e.target.value)}
        error={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VerifiedUser color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={(e) => onInputChange("password", e.target.value)}
        error={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={onTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={(e) => onInputChange("confirmPassword", e.target.value)}
        error={error || Boolean(formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={onToggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
    </>
  );
};

export default RegisterFormFields;
