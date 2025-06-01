import { Box } from "@mui/material";
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatInputArea from "./ChatInputArea";
import ChatMessageList from "./ChatMessageList";
import { useChatQuery } from "../../hooks/useChatQuery";

interface ChatWorkspaceProps {
  sessionId?: number;
  isHistoryPanelOpen: boolean; // Retaining for backwards compatibility
  onToggleHistoryPanel: () => void; // Retaining for backwards compatibility
}

/**
 * ChatWorkspace - Main chat content area
 * Contains the header, message list, and input area
 */
const ChatWorkspace = ({
  sessionId,
  isHistoryPanelOpen,
  onToggleHistoryPanel,
}: ChatWorkspaceProps) => {
  // Use the chat query hook to manage messages and session state
  const {
    messages,
    sendMessage,
    isLoading: isThinking,
    loadingMessages,
    setSession,
    currentSessionId,
  } = useChatQuery(sessionId);

  // Update session when sessionId prop changes
  React.useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      setSession(sessionId);
    }
  }, [sessionId, currentSessionId, setSession]);

  // Determine if we should show loading state
  const isLoadingMessages = loadingMessages && !!sessionId;
  // Disable input when loading messages or when no session is selected
  const isInputDisabled = isLoadingMessages || !sessionId;  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.default",
        overflow: "hidden",
        minWidth: 0, // Prevent flex item from overflowing
      }}
    >
      {/* Chat Header with toggle button */}
      <ChatHeader
        isHistoryPanelOpen={isHistoryPanelOpen}
        onToggleHistoryPanel={onToggleHistoryPanel}
      />

      {/* Messages Area */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoadingMessages || isThinking}
      />

      {/* Input Area */}
      <ChatInputArea
        onSendMessage={sendMessage}
        isThinking={isThinking}
        isDisabled={isInputDisabled}
      />
    </Box>
  );
};

export default ChatWorkspace;
