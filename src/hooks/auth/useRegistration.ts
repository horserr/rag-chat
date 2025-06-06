import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../services/auth/auth.service";
import type { RegisterDto, VerificationCodeDto } from "../../models/auth";

const authService = new AuthService();

export const useVerificationCode = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const mutation = useMutation({
    mutationFn: (verificationDto: VerificationCodeDto) =>
      authService.sendVerificationCode(verificationDto),
    onSuccess: () => {
      setIsCodeSent(true);
      // Start 60 second countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error) => {
      console.error("Failed to send verification code:", error);
      setIsCodeSent(false);
    },
  });

  const sendVerificationCode = (email: string) => {
    if (countdown > 0) return; // Prevent sending if countdown is active
    mutation.mutate({ email });
  };

  return {
    sendVerificationCode,
    isLoading: mutation.isPending,
    error: mutation.error,
    isCodeSent,
    countdown,
    canSendCode: countdown === 0,
  };
};

export const useRegistration = () => {
  const mutation = useMutation({
    mutationFn: (registerDto: RegisterDto) => authService.register(registerDto),
    onSuccess: (result) => {
      console.log("Registration successful:", result);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const register = (registerData: RegisterDto) => {
    mutation.mutate(registerData);
  };

  return {
    register,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};
