import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types';

// Mock API function - replace with actual API call
const sendMessageToApi = async (message: string): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(7),
        text: `Bot response to: ${message}`,
        sender: 'bot',
        timestamp: new Date(),
      });
    }, 1000);
  });
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text,
      sender: 'user',
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
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    }
    setIsLoading(false);
  }, []);

  return { messages, sendMessage, isLoading };
};
