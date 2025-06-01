import { useState, useCallback } from "react";
import { useCreateSession } from "./useSessions";
import { useAuthCheck } from "./auth/useAuthCheck";

// Constants
const MAX_RETRIES = 3;

/**
 * Custom hook to manage session initialization and authentication
 * Handles session creation when user is authenticated
 */
export const useSessionManager = () => {
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // External hooks
  const { data: hasToken } = useAuthCheck();
  const createSessionMutation = useCreateSession();

  // Manual retry function
  const retryCreateSession = useCallback(() => {
    setRetryCount(0);
    setIsCreatingSession(false);
  }, []);

  // Computed values
  const isLoading = isCreatingSession && createSessionMutation.isPending;
  const hasFailedToCreateSession = retryCount >= MAX_RETRIES;

  return {
    sessionId,
    setSessionId,
    isLoading,
    isAuthenticated: hasToken,
    retryCreateSession,
    hasFailedToCreateSession,
  };
};
