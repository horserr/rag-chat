import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService } from "../../services/session.service";
import { TokenService } from "../../services/token.service";
import type { SessionDto } from "../../models/session";

/**
 * Hook for creating new sessions
 * Only responsible for session creation logic
 */
export const useSessionCreation = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No token");

      const sessionService = new SessionService(token);
      const response = await sessionService.new_session();

      console.log("Create session response:", response);

      if (response.status_code === 200 && response.data) {
        return response.data;
      }

      throw new Error(
        `Failed to create session: ${response.status_code} - ${
          response.message || 'Unknown error'
        }`
      );
    },
    onSuccess: (newSession: SessionDto) => {
      // Add the new session to the sessions cache for the current token
      const token = TokenService.getToken();
      queryClient.setQueryData(
        ["sessions", token],
        (oldSessions: SessionDto[] = []) => [newSession, ...oldSessions]
      );
    },
  });
};
