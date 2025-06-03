import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "../types";
import { MessageService } from "../services/chat/message.service";
import { TokenService } from "../services/auth/token.service";
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

export const useChat = (initialSessionId?: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageService, setMessageService] = useState<MessageService | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<number | undefined>(initialSessionId);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Initialize message service when session ID changes
  useEffect(() => {
    const token = TokenService.getToken();
    if (token && currentSessionId) {
      setMessageService(new MessageService(token, currentSessionId));
    }
  }, [currentSessionId]);

  // Load messages when message service is ready
  useEffect(() => {
    const fetchMessages = async () => {
      if (!messageService) return;

      setLoadingMessages(true);
      try {
        const response = await messageService.get_messages(0, 100);
        const formattedMessages = response.data.map(convertMessageDtoToChatMessage);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (messageService) {
      fetchMessages();
    }
  }, [messageService]);

  // Set a new active session
  const setSession = useCallback((sessionId: number) => {
    setCurrentSessionId(sessionId);
    setMessages([]);
  }, []);
  const sendMessage = useCallback(async (text: string) => {
    if (!currentSessionId || !messageService) {
      console.error("Cannot send message: No active session or message service");
      // Display an error message to the user
      setMessages((prevMessages) => [...prevMessages, {
        id: `error-${Date.now()}`,
        text: "Error: Session not initialized. Please refresh the page or create a new session.",
        sender: "bot",
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    // Create and add user message to the UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Define streaming update callback
      const handleStreamUpdate = (content: string) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.sender === "bot" && lastMessage.isStreaming) {
            // Update the streaming message
            return prevMessages.map((msg, index) => {
              if (index === prevMessages.length - 1) {
                return { ...msg, text: content };
              }
              return msg;
            });
          } else {
            // Add a new bot message
            return [...prevMessages, {
              id: `stream-${Date.now()}`,
              text: content,
              sender: "bot" as const,
              timestamp: new Date(),
              isStreaming: true
            }];
          }
        });
      };      // Send message with streaming updates
      console.log('Sending message to API with streaming updates');
      await messageService.send_message(text, handleStreamUpdate);

      // After streaming is complete, fetch all messages to ensure consistency
      console.log('Streaming complete, refreshing messages');
      const messagesResponse = await messageService.get_messages(0, 100);
      const formattedMessages = messagesResponse.data.map(convertMessageDtoToChatMessage);
      setMessages(formattedMessages);} catch (error) {
      console.error("Error sending message:", error);
      // Handle error appropriately with a user-friendly message
      const errorResponse: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I couldn't process your message. Please try again or check your connection.",
        sender: "bot",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, messageService]);

  return {
    messages,
    sendMessage,
    isLoading,
    loadingMessages,
    setSession,
    currentSessionId
  };
};
