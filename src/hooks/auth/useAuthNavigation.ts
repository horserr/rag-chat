import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import { useAuthStatus } from "./useAuthStatus";
import { TokenService } from "../../services/token_service";

/**
 * Hook for handling authentication-related navigation
 * Manages post-login navigation and unauthenticated user redirects
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { data: authData, isLoading: authLoading } = useAuthStatus();
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  // Monitor auth state changes after login
  useEffect(() => {
    if (isWaitingForAuth && !authLoading && authData?.isLoggedIn) {
      console.log("Auth check completed, navigating to chat");
      setIsWaitingForAuth(false);
      navigate("/chat");
    }
  }, [authData?.isLoggedIn, authLoading, isWaitingForAuth, navigate]);

  const loginWithNavigation = useCallback(
    async (credentials: { email: string; password: string }) => {
      return new Promise<void>((resolve, reject) => {
        loginMutation.mutate(credentials, {
          onSuccess: (result) => {
            if (result.status_code === 200 && result.data) {
              console.log("Login successful, waiting for auth check...");
              setIsWaitingForAuth(true);
              resolve();
            } else {
              reject(new Error("Login failed"));
            }
          },
          onError: (error) => {
            console.error("Login error:", error);
            reject(error);
          },
        });
      });
    },
    [loginMutation]
  );

  const redirectToLoginIfUnauthenticated = useCallback(() => {
    const hasValidToken = TokenService.isTokenValid();

    if (
      !authLoading &&
      authData &&
      !authData.isLoggedIn &&
      !isWaitingForAuth &&
      !hasValidToken
    ) {
      navigate("/login");
    }
  }, [authData, authLoading, navigate, isWaitingForAuth]);

  return {
    loginWithNavigation,
    redirectToLoginIfUnauthenticated,
    isLoading: loginMutation.isPending || isWaitingForAuth,
    error: loginMutation.error,
  };
};
