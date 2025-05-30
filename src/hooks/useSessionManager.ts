import { useState, useEffect, useCallback } from "react";
import { useCreateSession } from "./useSessions";
import { useAuthCheck } from "./useAuth";
import { useNavigate } from "react-router-dom";
import type { SessionDto } from "../models/session";

// Constants
const MAX_RETRIES = 3;

// Helper function to check if error is authentication related
const isAuthenticationError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 401;
  }
  return false;
};

// Helper function to determine if session should be created
const shouldCreateSession = (
  isAuthenticated: boolean | undefined,
  hasSessionId: boolean,
  retryCount: number
): boolean => {
  return Boolean(isAuthenticated && !hasSessionId && retryCount < MAX_RETRIES);
};

/**
 * Custom hook to manage session initialization and authentication
 * Handles session creation when user is authenticated
 */
export const useSessionManager = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // External hooks
  const { data: authData, isLoading: authLoading } = useAuthCheck();
  const createSessionMutation = useCreateSession();

  // Handle successful session creation
  const handleSessionSuccess = useCallback((newSession: SessionDto) => {
    setSessionId(newSession.id);
    setIsCreatingSession(false);
    setRetryCount(0);
  }, []);

  // Handle session creation error
  const handleSessionError = useCallback(
    (error: unknown) => {
      console.error("Error creating new session:", error);
      setIsCreatingSession(false);

      // Handle authentication errors - redirect to login
      if (isAuthenticationError(error)) {
        console.error(
          "Authentication failed - token may be invalid or expired"
        );
        navigate("/login");
        return;
      }

      // Increment retry count for other errors
      setRetryCount((prev) => {
        const newRetryCount = prev + 1;
        if (newRetryCount >= MAX_RETRIES) {
          console.error(
            `Failed to create session after ${MAX_RETRIES} attempts`
          );
        }
        return newRetryCount;
      });
    },
    [navigate]
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

  // Handle unauthenticated users - redirect to login
  const handleUnauthenticatedUser = useCallback(() => {
    if (!authLoading && authData && !authData.isLoggedIn) {
      navigate("/login");
    }
  }, [authData, authLoading, navigate]);

  // Auto-create session when conditions are met
  const handleAutoSessionCreation = useCallback(() => {
    if (
      shouldCreateSession(authData?.isLoggedIn, Boolean(sessionId), retryCount)
    ) {
      createSession();
    }
  }, [authData?.isLoggedIn, sessionId, retryCount, createSession]);

  // Manual retry function
  const retryCreateSession = useCallback(() => {
    setRetryCount(0);
    setIsCreatingSession(false);
  }, []);

  // Effects
  useEffect(handleUnauthenticatedUser, [handleUnauthenticatedUser]);
  useEffect(handleAutoSessionCreation, [handleAutoSessionCreation]);

  // Computed values
  const isLoading =
    authLoading || (isCreatingSession && createSessionMutation.isPending);
  const hasFailedToCreateSession = retryCount >= MAX_RETRIES;

  return {
    sessionId,
    setSessionId,
    isLoading,
    isAuthenticated: authData?.isLoggedIn,
    retryCreateSession,
    hasFailedToCreateSession,
  };
};
