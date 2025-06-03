import { Paper } from "@mui/material";
import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "../../types";
import WelcomeMessage from "./WelcomeMessage";
import ChatMessage from "./message/ChatMessage";
import LoadingIndicator from "./message/LoadingIndicator";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Add blinking cursor animation for streaming messages
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        backgroundColor: "transparent",
        backgroundImage:
          "radial-gradient(rgba(67, 97, 238, 0.03) 2px, transparent 2px)",
        backgroundSize: "24px 24px",
        minHeight: 0, // Prevent flex item from overflowing
      }}
    >
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        messages.map((msg: ChatMessageType, index) => (
          <ChatMessage key={msg.id} message={msg} index={index} />
        ))
      )}
      {isLoading && <LoadingIndicator messagesCount={messages.length} />}
      <div ref={messagesEndRef} />
    </Paper>
  );
};

export default ChatMessageList;
