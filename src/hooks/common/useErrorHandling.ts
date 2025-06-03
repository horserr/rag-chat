import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to check if error is authentication related
const isAuthenticationError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 401;
  }
  return false;
};

export const useErrorHandling = () => {
  const navigate = useNavigate();

  const handleAuthenticationError = useCallback((error: unknown) => {
    if (isAuthenticationError(error)) {
      console.error("Authentication failed - token may be invalid or expired");
      navigate("/login");
      return true; // Indicates auth error was handled
    }
    return false; // Not an auth error
  }, [navigate]);

  const handleGenericError = useCallback((error: unknown, context: string) => {
    console.error(`Error in ${context}:`, error);
  }, []);

  return {
    isAuthenticationError,
    handleAuthenticationError,
    handleGenericError,
  };
};
