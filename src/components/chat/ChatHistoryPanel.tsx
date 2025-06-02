import { Collapse } from "@mui/material";
import ChatHistorySidebar from "./ChatHistorySidebar";

interface ChatHistoryPanelProps {
  isOpen: boolean;
  sessionId: number | null; // Allow null for no session selected
  setSessionId: (id: number | null) => void;
}

/**
 * ChatHistoryPanel - Wrapper component for the collapsible chat history sidebar
 * Handles the animation and positioning of the history panel
 */
const ChatHistoryPanel = ({
  isOpen,
  sessionId,
  setSessionId,
}: ChatHistoryPanelProps) => {
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
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      <ChatHistorySidebar
        isOpen={isOpen}
        sessionId={sessionId}
        setSessionId={setSessionId}
      />
    </Collapse>
  );
};

export default ChatHistoryPanel;
