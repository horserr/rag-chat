import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "../types";
import { MessageService } from "../services/message_service";
import { TokenService } from "../services/token_service";
import { SessionService } from "../services/session_service";
import { MessageDto } from "../models/message";

// Convert MessageDto to ChatMessage format
const convertMessageDtoToChatMessage = (msg: MessageDto): ChatMessage => {
  return {
    id: msg.id.toString(),
    text: msg.content,
    sender: msg.role === "User" ? "user" : "bot",
    timestamp: new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z'),
  };
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    try {
      const botResponse = await sendMessageToApi(text);
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error appropriately, e.g., show an error message to the user
      const errorResponse: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        text: "Sorry, I couldn't process your message.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    }
    setIsLoading(false);
  }, []);

  return { messages, sendMessage, isLoading };
};
