import { useState, useEffect } from 'react';
import { useCreateSession } from './useSessions';
import { useAuthCheck } from './useAuth';
import { useNavigate } from 'react-router-dom';
import type { SessionDto } from '../models/session';

/**
 * Custom hook to manage session initialization and authentication
 * Handles session creation when user is authenticated
 */
export const useSessionManager = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Authentication state
  const { data: authData, isLoading: authLoading } = useAuthCheck();

  // Session creation state
  const createSessionMutation = useCreateSession();

  // Handle authentication check and redirect if needed
  useEffect(() => {
    if (!authLoading && authData && !authData.isLoggedIn) {
      navigate("/login");
    }
  }, [authData, authLoading, navigate]);

  // Handle session creation once when authenticated
  useEffect(() => {
    // Only attempt to create a session when:
    // 1. User is authenticated
    // 2. We don't have a session ID yet
    // 3. We haven't started the session creation process
    // 4. The creation mutation isn't already in progress
    if (
      authData?.isLoggedIn &&
      !sessionId &&
      !isCreatingSession &&
      !createSessionMutation.isPending
    ) {
      // Mark that we're starting session creation to prevent duplicate calls
      setIsCreatingSession(true);

      createSessionMutation.mutate(undefined, {
        onSuccess: (newSession: SessionDto) => {
          setSessionId(newSession.id);
        },
        onError: (error: unknown) => {
          console.error("Error creating new session:", error);
          // Allow retry on error by resetting the creation flag
          setIsCreatingSession(false);
        },
      });
    }
  }, [
    authData?.isLoggedIn,
    sessionId,
    isCreatingSession,
    createSessionMutation,
  ]);

  const isLoading = authLoading || (isCreatingSession && createSessionMutation.isPending);

  return {
    sessionId,
    setSessionId,
    isLoading,
    isAuthenticated: authData?.isLoggedIn,
  };
};
