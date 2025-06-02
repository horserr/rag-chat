import { useQuery } from "@tanstack/react-query";
import { SessionService } from "../../services/chat/session.service";
import { TokenService } from "../../services/auth/token.service";

/**
 * Hook for fetching and managing session list
 * Only responsible for session list data
 */
export const useSessionList = () => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ["sessions", token],
    queryFn: async () => {
      if (!token) throw new Error("No token");

      const sessionService = new SessionService(token);
      const response = await sessionService.get_sessions(0, 50);

      if (response.status_code === 200 && response.data) {
        return response.data;
      }
      return [];
    },
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
