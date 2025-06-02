import { useQuery } from "@tanstack/react-query";
import { TokenService } from "../../services/auth/token.service";

// todo add userid representing for different user

/**
 * Custom hook for checking authentication status
 * @returns {boolean} - Returns true if user is authenticated, false otherwise
 */
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: () => !!TokenService.getToken(),
    refetchInterval: false, // Disable automatic refetching
    retry: false, // Don't retry on failure
    placeholderData: false, // Initial value before the query runs
  });
};

export default useAuthCheck;
