import React, { useState } from "react";
import { Box } from "@mui/material";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMainContent from "../components/chat/ChatMainContent";
import LoadingScreen from "../components/common/LoadingScreen";
import { useChatQuery } from "../hooks/useChatQuery";
import { useSessionManager } from "../hooks/useSessionManager";

/**
 * ChatPage component represents the main chat interface
 * It includes the chat history sidebar, message list, and input area
 */
const ChatPage: React.FC = () => {
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);

  // Session management with authentication
  const {
    sessionId,
    setSessionId,
    isLoading: sessionLoading,
  } = useSessionManager();

  // Chat functionality with React Query
  const { messages, sendMessage, isLoading, setSession, currentSessionId } =
    useChatQuery(sessionId);

  const handleToggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleSelectSession = (id: number) => {
    setSessionId(id);
    setSession(id);
  };

  // Show loading while auth is being checked or session is being created
  if (sessionLoading) {
    return <LoadingScreen message="Loading chat..." />;
  }
  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* History Panel with animation */}
      <ChatSidebar
        isOpen={isHistoryPanelOpen}
        sessionId={currentSessionId}
        onSelectSession={handleSelectSession}
      />

      {/* Main Chat Content Area */}
      <ChatMainContent
        messages={messages}
        isLoading={isLoading}
        isHistoryPanelOpen={isHistoryPanelOpen}
        onToggleHistoryPanel={handleToggleHistoryPanel}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
};

export default ChatPage;
