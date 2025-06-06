import React, { useState } from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import { useRegistration, useVerificationCode } from "../../hooks/auth/useRegistration";
import RegisterFormFields from "./RegisterFormFields";
import RegisterFormSubmit from "./RegisterFormSubmit";
import RegisterFormError from "./RegisterFormError";
import RegisterSuccess from "./RegisterSuccess";
import SimpleCaptcha from "./SimpleCaptcha";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const { register, isLoading, error, isSuccess } = useRegistration();
  const {
    sendVerificationCode,
    isLoading: isCodeLoading,
    error: codeError,
    countdown,
    canSendCode,
  } = useVerificationCode();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSendCode = () => {
    if (!formData.email || !isCaptchaValid) return;
    sendVerificationCode(formData.email);
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.verificationCode || !isCaptchaValid) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        verification_code: formData.verificationCode,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const getErrorMessage = () => {
    if (error) {
      return error instanceof Error ? error.message : "Registration failed. Please try again.";
    }
    if (codeError) {
      return codeError instanceof Error ? codeError.message : "Failed to send verification code.";
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  if (isSuccess) {
    return <RegisterSuccess onSwitchToLogin={onSwitchToLogin} />;
  }

  return (
    <Box component="form" onSubmit={handleRegister} noValidate>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="primary"
        textAlign="center"
      >
        Create Account
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Join RAG Assistant to access intelligent document retrieval
      </Typography>

      <RegisterFormFields
        formData={formData}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onInputChange={handleInputChange}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
        onToggleConfirmPasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
        onSendCode={handleSendCode}
        isCodeLoading={isCodeLoading}
        countdown={countdown}
        canSendCode={canSendCode && isCaptchaValid}
        error={Boolean(getErrorMessage())}
      />

      <SimpleCaptcha
        onVerify={setIsCaptchaValid}
        error={Boolean(getErrorMessage())}
      />

      <RegisterFormError error={getErrorMessage()} />

      <RegisterFormSubmit
        isLoading={isLoading}
        onSubmit={handleRegister}
        disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.verificationCode || formData.password !== formData.confirmPassword || !isCaptchaValid}
      />

      <Divider sx={{ my: 2 }} />

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onSwitchToLogin}
            sx={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;
