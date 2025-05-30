import { useState, useCallback } from "react";
import { useMessages } from "./useMessages";
import { useMessageSending } from "./useMessageSending";

/**
 * Hook that combines message management and sending for a complete chat experience
 * Orchestrates the interaction between messages and message sending
 */
export const useChatSession = (initialSessionId?: number) => {
  const [currentSessionId, setCurrentSessionId] = useState<number | undefined>(initialSessionId);

  const { data: messages = [], isLoading: loadingMessages } = useMessages(currentSessionId);
  const { sendMessage, isLoading: sendingMessage, error: sendError } = useMessageSending(currentSessionId);

  // Set a new active session
  const setSession = useCallback((sessionId: number) => {
    setCurrentSessionId(sessionId);
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    if (!currentSessionId) {
      console.error("Cannot send message: No active session");
      return;
    }
    sendMessage(text);
  }, [currentSessionId, sendMessage]);

  return {
    messages,
    sendMessage: handleSendMessage,
    isLoading: sendingMessage,
    loadingMessages,
    setSession,
    currentSessionId,
    error: sendError,
  };
};
