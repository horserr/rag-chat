import React from "react";
import { Box } from "@mui/material";
import type { ChatMessage as ChatMessageType } from "../../../types";
import MessageAvatar from "./MessageAvatar";
import MessageHeader from "./MessageHeader";
import MessageBubble from "./MessageBubble";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
  return (
    <Box
      key={message.id}
      className="message-animation"
      sx={{
        display: "flex",
        justifyContent:
          message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "24px",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection:
            message.sender === "user" ? "row-reverse" : "row",
          maxWidth: "80%",
        }}
      >
        <MessageAvatar sender={message.sender} />
        <Box>
          <MessageHeader sender={message.sender} timestamp={message.timestamp} />
          <MessageBubble
            sender={message.sender}
            text={message.text}
            isError={message.isError}
            isStreaming={message.isStreaming}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
