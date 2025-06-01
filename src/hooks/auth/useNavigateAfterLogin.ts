import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "./useLogin";
import { useAuthCheck } from "./useAuthCheck";
import type { LoginDto } from "../../models/auth";

// Hook for handling post-login navigation
export const useNavigateAfterLogin = () => {
  const loginMutation = useLogin();
  // todo check data is null or not.
  const { data: hasToken } = useAuthCheck();
  const navigate = useNavigate();
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  // Monitor auth state changes after login
  useEffect(() => {
    if (isWaitingForAuth && hasToken) {
      console.log("Auth check completed, navigating to chat");
      setIsWaitingForAuth(false);
      navigate("/chat");
    }
  }, [hasToken, isWaitingForAuth, navigate]);

  const navigateAfterLogin = async (credentials: LoginDto) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      if (result.status_code === 200 && result.data) {
        console.log("Login successful, waiting for auth check...");
        setIsWaitingForAuth(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // 可选：如果需要上层处理错误
    }
  };

  return {
    navigateAfterLogin,
    isLoading: loginMutation.isPending || isWaitingForAuth,
    error: loginMutation.error,
  };
};

export default useNavigateAfterLogin;
