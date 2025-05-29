import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionService } from '../services/session_service';
import { TokenService } from '../services/token_service';
import type { SessionDto } from '../models/session';

// Hook for fetching sessions
export const useSessions = () => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ['sessions', token], // Include token in query key to handle token changes
    queryFn: async () => {
      if (!token) throw new Error('No token');

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
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: 1, // Retry only once on failure
  });
};

// Hook for creating a new session
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No token');

      const sessionService = new SessionService(token);
      const response = await sessionService.new_session();

      if (response.status_code === 200 && response.data) {
        return response.data;
      }
      throw new Error('Failed to create session');
    },    onSuccess: (newSession: SessionDto) => {
      // Add the new session to the sessions cache for the current token
      const token = TokenService.getToken();
      queryClient.setQueryData(['sessions', token], (oldSessions: SessionDto[] = []) => [
        newSession,
        ...oldSessions
      ]);
    },
  });
};

// Hook for deleting a session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      if (!token) throw new Error('No token');

      const sessionService = new SessionService(token);
      return await sessionService.delete_session(sessionId);
    },    onSuccess: (_, sessionId) => {
      // Remove the session from the cache for the current token
      const token = TokenService.getToken();
      queryClient.setQueryData(['sessions', token], (oldSessions: SessionDto[] = []) =>
        oldSessions.filter(session => session.id !== sessionId)
      );
      // Also clear messages cache for this session
      queryClient.removeQueries({ queryKey: ['messages', sessionId] });
    },
  });
};
