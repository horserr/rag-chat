import React from "react";
import { Box } from "@mui/material";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInputArea from "./ChatInputArea";
import type { ChatMessage } from "../../types";

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isHistoryPanelOpen: boolean; // Retaining for backwards compatibility
  onToggleHistoryPanel: () => void; // Retaining for backwards compatibility
  onSendMessage: (text: string) => void;
}

/**
 * ChatWorkspace - Main chat content area
 * Contains the header, message list, and input area
 */
const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  isLoading,
  isHistoryPanelOpen,
  onToggleHistoryPanel,
  onSendMessage,
}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Chat Header with toggle button */}
      <ChatHeader
        isHistoryPanelOpen={isHistoryPanelOpen}
        onToggleHistoryPanel={onToggleHistoryPanel}
      />

      {/* Messages Area */}
      <ChatMessageList messages={messages} isLoading={isLoading} />

      {/* Input Area */}
      <ChatInputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </Box>
  );
};

export default ChatWorkspace;
