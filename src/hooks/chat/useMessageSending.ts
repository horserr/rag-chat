import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageService } from "../../services/message_service";
import { TokenService } from "../../services/token_service";
import type { ChatMessage } from "../../types";

/**
 * Hook for sending messages
 * Only responsible for message sending functionality
 */
export const useMessageSending = (sessionId?: number) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const token = TokenService.getToken();

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!token || !sessionId) throw new Error('No token or session');

      setIsLoading(true);
      const messageService = new MessageService(token, sessionId);

      // Define streaming update callback
      const handleStreamUpdate = (content: string) => {
        // Update the query cache with streaming content
        queryClient.setQueryData(['messages', sessionId, token], (oldMessages: ChatMessage[] = []) => {
          const lastMessage = oldMessages[oldMessages.length - 1];
          if (lastMessage?.sender === "bot" && lastMessage.isStreaming) {
            // Update the streaming message
            return oldMessages.map((msg, index) => {
              if (index === oldMessages.length - 1) {
                return { ...msg, text: content };
              }
              return msg;
            });
          } else {
            // Add a new bot message
            const streamingMessage: ChatMessage = {
              id: `streaming-${Date.now()}`,
              text: content,
              sender: "bot",
              timestamp: new Date(),
              isStreaming: true,
            };
            return [...oldMessages, streamingMessage];
          }
        });
      };

      // Add user message immediately to the cache
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      };

      queryClient.setQueryData(['messages', sessionId, token], (oldMessages: ChatMessage[] = []) => [
        ...oldMessages,
        userMessage
      ]);

      return await messageService.send_message(text, handleStreamUpdate);
    },
    onSuccess: () => {
      // Refresh messages after sending to get the final state
      queryClient.invalidateQueries({ queryKey: ['messages', sessionId, token] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      // Add error message to the cache
      const errorResponse: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I couldn't process your message. Please try again or check your connection.",
        sender: "bot",
        timestamp: new Date(),
        isError: true
      };

      queryClient.setQueryData(['messages', sessionId, token], (oldMessages: ChatMessage[] = []) => [
        ...oldMessages,
        errorResponse
      ]);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return {
    sendMessage: sendMessageMutation.mutate,
    isLoading: isLoading || sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
};
