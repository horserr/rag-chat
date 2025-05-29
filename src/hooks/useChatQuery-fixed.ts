import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatMessage } from "../types";
import { MessageService } from "../services/message_service";
import { TokenService } from "../services/token_service";
import type { MessageDto } from "../models/message";

// Convert MessageDto to ChatMessage format
const convertMessageDtoToChatMessage = (msg: MessageDto): ChatMessage => {
  return {
    id: msg.id.toString(),
    text: msg.content,
    sender: msg.role === "User" ? "user" : "bot",
    timestamp: new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z'),
  };
};

export const useChatQuery = (initialSessionId?: number) => {
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<number | undefined>(initialSessionId);
  const [isLoading, setIsLoading] = useState(false);

  // Get current token
  const token = TokenService.getToken();

  // Query for messages
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', currentSessionId, token],
    queryFn: async () => {
      if (!token || !currentSessionId) return [];

      const messageService = new MessageService(token, currentSessionId);
      const response = await messageService.get_messages(0, 100);
      return response.data.map(convertMessageDtoToChatMessage);
    },
    enabled: !!token && !!currentSessionId,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!token || !currentSessionId) throw new Error('No token or session');

      setIsLoading(true);
      const messageService = new MessageService(token, currentSessionId);

      // Define streaming update callback
      const handleStreamUpdate = (content: string) => {
        // Update the query cache with streaming content
        queryClient.setQueryData(['messages', currentSessionId, token], (oldMessages: ChatMessage[] = []) => {
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
            return [...oldMessages, {
              id: `stream-${Date.now()}`,
              text: content,
              sender: "bot" as const,
              timestamp: new Date(),
              isStreaming: true
            }];
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

      queryClient.setQueryData(['messages', currentSessionId, token], (oldMessages: ChatMessage[] = []) => [
        ...oldMessages,
        userMessage
      ]);

      return await messageService.send_message(text, handleStreamUpdate);
    },
    onSuccess: () => {
      // Refresh messages after sending to get the final state
      queryClient.invalidateQueries({ queryKey: ['messages', currentSessionId, token] });
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

      queryClient.setQueryData(['messages', currentSessionId, token], (oldMessages: ChatMessage[] = []) => [
        ...oldMessages,
        errorResponse
      ]);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  // Set a new active session
  const setSession = useCallback((sessionId: number) => {
    setCurrentSessionId(sessionId);
    // Clear any loading state when switching sessions
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback((text: string) => {
    sendMessageMutation.mutate(text);
  }, [sendMessageMutation]);

  return {
    messages,
    sendMessage,
    isLoading: isLoading || sendMessageMutation.isPending,
    setSession,
    currentSessionId,
    loadingMessages,
  };
};
