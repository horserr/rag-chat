import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService } from "../../services/session.service";
import { TokenService } from "../../services/token.service";
import type { SessionDto } from "../../models/session";

/**
 * Hook for session operations like delete
 * Only responsible for session operations
 */
export const useSessionOperations = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  const deleteSession = useMutation({
    mutationFn: async (sessionId: number) => {
      if (!token) throw new Error("No token");

      const sessionService = new SessionService(token);
      return await sessionService.delete_session(sessionId);
    },
    onSuccess: (_, sessionId) => {
      // Remove the session from the cache for the current token
      const token = TokenService.getToken();
      queryClient.setQueryData(
        ["sessions", token],
        (oldSessions: SessionDto[] = []) =>
          oldSessions.filter((session) => session.id !== sessionId)
      );
      // Also clear messages cache for this session
      queryClient.removeQueries({ queryKey: ["messages", sessionId] });
    },
  });
  return {
    deleteSession: deleteSession.mutate,
    deleteMutation: deleteSession,
  };
};
