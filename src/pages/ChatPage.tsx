import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatHistoryPanel from "../components/chat/ChatHistoryPanel";
import ChatWorkspace from "../components/chat/ChatWorkspace";

/**
 * ChatPage component represents the main chat interface
 * It includes the chat history sidebar, message list, and input area
 */
const ChatPage: React.FC = () => {
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const handleToggleHistoryPanel = () =>
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  // Keyboard shortcut for toggling history panel (Ctrl+Shift+H)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "H") {
        event.preventDefault();
        setIsHistoryPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* History Panel with animation */}
      <ChatHistoryPanel
        isOpen={isHistoryPanelOpen}
        sessionId={sessionId}
        setSessionId={setSessionId}
      />{" "}
      {/* Main Chat Content Area */}
      <ChatWorkspace
        sessionId={sessionId}
        isHistoryPanelOpen={isHistoryPanelOpen}
        onToggleHistoryPanel={handleToggleHistoryPanel}
      />
    </Box>
  );
};

export default ChatPage;
