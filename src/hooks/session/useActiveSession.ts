import { useState, useCallback, useEffect } from "react";
import { useSessionCreation } from "./useSessionCreation";
import { useAuthStatus } from "../auth/useAuthStatus";
import { useErrorHandling } from "../common/useErrorHandling";
import { useRetry } from "../common/useRetry";
import type { SessionDto } from "../../models/session";

/**
 * Hook for managing the currently active session
 * Handles session initialization and state management
 */
export const useActiveSession = () => {
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const { data: authData, isLoading: authLoading } = useAuthStatus();
  const createSessionMutation = useSessionCreation();
  const { handleAuthenticationError } = useErrorHandling();  const { shouldRetry, hasMaxRetriesReached, incrementRetry, resetRetry } = useRetry({
    maxRetries: 3,
  });

  // Handle successful session creation
  const handleSessionSuccess = useCallback((newSession: SessionDto) => {
    setSessionId(newSession.id);
    setIsCreatingSession(false);
    resetRetry();
  }, [resetRetry]);

  // Handle session creation error
  const handleSessionError = useCallback(
    (error: unknown) => {
      console.error("Error creating new session:", error);
      setIsCreatingSession(false);

      // Handle authentication errors - redirect to login
      if (handleAuthenticationError(error)) {
        return;
      }

      // Increment retry count for other errors
      incrementRetry();
    },
    [handleAuthenticationError, incrementRetry]
  );

  // Main session creation function
  const createSession = useCallback(() => {
    // Prevent duplicate calls
    if (isCreatingSession || createSessionMutation.isPending) {
      return;
    }

    setIsCreatingSession(true);
    createSessionMutation.mutate(undefined, {
      onSuccess: handleSessionSuccess,
      onError: handleSessionError,
    });
  }, [
    createSessionMutation,
    isCreatingSession,
    handleSessionSuccess,
    handleSessionError,
  ]);

  // Auto-create session when conditions are met
  useEffect(() => {
    const shouldCreateSession = Boolean(
      authData?.isLoggedIn && !sessionId && shouldRetry
    );

    if (shouldCreateSession) {
      createSession();
    }
  }, [authData?.isLoggedIn, sessionId, shouldRetry, createSession]);

  // Manual retry function
  const retryCreateSession = useCallback(() => {
    resetRetry();
    setIsCreatingSession(false);
  }, [resetRetry]);

  const isLoading = authLoading || (isCreatingSession && createSessionMutation.isPending);

  return {
    sessionId,
    setSessionId,
    isLoading,
    isAuthenticated: authData?.isLoggedIn,
    retryCreateSession,
    hasFailedToCreateSession: hasMaxRetriesReached,
    createSession,
  };
};
