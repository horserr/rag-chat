import React from 'react';
import { Collapse } from '@mui/material';
import ChatHistorySidebar from './ChatHistorySidebar';

interface ChatHistoryPanelProps {
  isOpen: boolean;
  sessionId?: number;
  onSelectSession: (id: number) => void;
}

/**
 * ChatHistoryPanel - Wrapper component for the collapsible chat history sidebar
 * Handles the animation and positioning of the history panel
 */
const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  isOpen,
  sessionId,
  onSelectSession
}) => {
  return (
    <Collapse
      in={isOpen}
      orientation="horizontal"
      timeout={300}
      sx={{
        height: "100%",
        overflow: "hidden",
        transitionProperty: "width, min-width, max-width",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "300ms",
        width: isOpen ? "280px" : "0px",
        minWidth: isOpen ? "280px" : "0px",
        maxWidth: isOpen ? "280px" : "0px",
        position: "relative",
      }}
    >
      <ChatHistorySidebar
        isOpen={isOpen}
        sessionId={sessionId}
        onSelectSession={onSelectSession}
      />
    </Collapse>
  );
};

export default ChatHistoryPanel;
