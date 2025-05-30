import { useQuery } from "@tanstack/react-query";
import { TokenService } from "../../services/token_service";

/**
 * Hook for checking authentication status
 * Only responsible for checking if user is authenticated
 */
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["auth", "status"],
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
    refetchInterval: false,
    retry: false,
  });
};
