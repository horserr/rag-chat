import { useQuery } from "@tanstack/react-query";
import { MessageService } from "../../services/message_service";
import { TokenService } from "../../services/token_service";
import type { MessageDto } from "../../models/message";
import type { ChatMessage } from "../../types";

// Convert MessageDto to ChatMessage format
const convertMessageDtoToChatMessage = (msg: MessageDto): ChatMessage => {
  return {
    id: msg.id.toString(),
    text: msg.content,
    sender: msg.role === "User" ? "user" : "bot",
    timestamp: new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z'),
  };
};

/**
 * Hook for managing messages in a session
 * Only responsible for fetching and caching messages
 */
export const useMessages = (sessionId?: number) => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ['messages', sessionId, token],
    queryFn: async () => {
      if (!token || !sessionId) return [];

      const messageService = new MessageService(token, sessionId);
      const response = await messageService.get_messages(0, 100);
      return response.data.map(convertMessageDtoToChatMessage);
    },
    enabled: !!token && !!sessionId,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
