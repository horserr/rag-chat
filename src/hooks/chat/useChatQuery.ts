import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage } from "../../types";
import { MessageService } from "../../services/chat/message.service";
import { TokenService } from "../../services/auth/token.service";
import type { MessageDto } from "../../models/message";

// Convert MessageDto to ChatMessage format
const convertMessageDtoToChatMessage = (msg: MessageDto): ChatMessage => {
  return {
    id: msg.id.toString(),
    text: msg.content,
    sender: msg.role === "User" ? "user" : "bot",
    timestamp: new Date(
      msg.created_at.endsWith("Z") ? msg.created_at : msg.created_at + "Z"
    ),
  };
};

export const useChatQuery = (sessionId: number | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const token = TokenService.getToken();

  // Query for messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", sessionId, token],
    queryFn: async () => {
      if (!token || !sessionId) return [];

      const messageService = new MessageService(token, sessionId);
      const response = await messageService.get_messages(0, 100);
      if (response.status_code !== 200 || !response.data) {
        throw new Error(
          `Failed to fetch messages: ${response.status_code} - ${
            response.message || "Unknown error"
          }`
        );
      }
      return response.data.map(convertMessageDtoToChatMessage);
    },
    enabled: !!token && !!sessionId,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    // optimistic update
    onMutate: (text: string) => {
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      };

      // Add user message immediately to the cache
      queryClient.setQueryData(
        ["messages", sessionId, token],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, userMessage]
      );
    },
    mutationFn: async (text: string) => {
      if (!token || !sessionId) throw new Error("No token or session");

      const messageService = new MessageService(token, sessionId);
      // Define streaming update callback
      const handleStreamUpdate = (content: string) => {
        // Update the query cache with streaming content
        queryClient.setQueryData(
          ["messages", sessionId, token],
          (oldMessages: ChatMessage[] = []) => {
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
              return [
                ...oldMessages,
                {
                  id: `stream-${Date.now()}`,
                  text: content,
                  sender: "bot" as const,
                  timestamp: new Date(),
                  isStreaming: true,
                },
              ];
            }
          }
        );
      };

      return await messageService.send_message(text, handleStreamUpdate);
    },
    onSuccess: () => {
      // Refresh messages after sending to get the final chat response
      queryClient.invalidateQueries({
        queryKey: ["messages", sessionId, token],
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      // Add error message to the cache
      const errorResponse: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I couldn't process your message. Please try again or check your connection.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };

      queryClient.setQueryData(
        ["messages", sessionId, token],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, errorResponse]
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const sendMessage = useCallback(
    (text: string) => {
      sendMessageMutation.mutate(text);
    },
    [sendMessageMutation]
  );

  return {
    messages,
    sendMessage,
    isLoading: isLoading || sendMessageMutation.isPending,
    isLoadingMessages,
  };
};
