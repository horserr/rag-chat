import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth_service";
import { TokenService } from "../services/token_service";

const authService = new AuthService();

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authService.login({ email, password });
      return result;
    },
    onSuccess: (result) => {
      if (result.status_code === 200 && result.data) {
        console.log("Login successful, setting token:", result.data);
        TokenService.setToken(result.data);

        // Trigger re-fetch of auth status instead of directly setting cache
        // This ensures React Query naturally updates the state
        queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
      }
    },
  });
};

// todo add userid representing for different user
// Hook for checking authentication status
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: () => {
      const token = TokenService.getToken();
      const isValid = TokenService.isTokenValid();

      // If token exists but is invalid, clear it
      if (!isValid && token) {
        TokenService.clearToken();
      }

      return {
        isLoggedIn: isValid,
        token: isValid ? token : null,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable automatic refetching
    retry: false, // Don't retry on failure
  });
};

// Hook for handling post-login navigation
export const useLoginWithNavigation = () => {
  const loginMutation = useLogin();
  const { data: authData, isLoading: authLoading } = useAuthCheck();
  const navigate = useNavigate();
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

  return {
    loginWithNavigation,
    isLoading: loginMutation.isPending || isWaitingForAuth,
    error: loginMutation.error,
  };
};
