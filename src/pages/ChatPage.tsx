import React, { useState, useEffect } from "react";
import { Box, Collapse } from "@mui/material";
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatInputArea from "../components/chat/ChatInputArea";
import { useChat } from "../hooks/useChat";
import { SessionService } from "../services/session_service";
import { TokenService } from "../services/token_service";
import { useNavigate } from "react-router-dom";

/**
 * ChatPage component represents the main chat interface
 * It includes the chat history sidebar, message list, and input area
 */
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const { messages, sendMessage, isLoading, setSession, currentSessionId } = useChat(sessionId);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);
  const [sessionService, setSessionService] = useState<SessionService | null>(null);

  // Check for token and init session service
  useEffect(() => {
    const token = TokenService.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setSessionService(new SessionService(token));
  }, [navigate]);

  // Create a new session if none exists
  useEffect(() => {
    const createNewSession = async () => {
      if (!sessionService) return;

      try {
        const response = await sessionService.new_session();
        if (response.status_code === 200 && response.data) {
          setSessionId(response.data.id);
          setSession(response.data.id);
        }
      } catch (error) {
        console.error("Error creating new session:", error);
      }
    };

    if (sessionService && !sessionId) {
      createNewSession();
    }
  }, [sessionService, sessionId, setSession]);

  const handleToggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* History Panel with animation */}      <Collapse
        in={isHistoryPanelOpen}
        orientation="horizontal"
        timeout={300}
        sx={{
          height: "100%",
          overflow: "hidden",
          transitionProperty: "width, min-width, max-width",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "300ms",
          width: isHistoryPanelOpen ? "280px" : "0px",
          minWidth: isHistoryPanelOpen ? "280px" : "0px",
          maxWidth: isHistoryPanelOpen ? "280px" : "0px",
          position: "relative",
        }}
      >
        <ChatHistorySidebar
          isOpen={isHistoryPanelOpen}
          sessionId={currentSessionId}
          onSelectSession={(id) => {
            setSessionId(id);
            setSession(id);
          }}
        />
      </Collapse>

      {/* Main Chat Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "background.default",
          overflow: "hidden", // Prevents shadow issues with inner scrolling content
        }}
      >
        {/* Header with toggle button for history panel */}
        <ChatHeader
          isHistoryPanelOpen={isHistoryPanelOpen}
          onToggleHistoryPanel={handleToggleHistoryPanel}
        />

        {/* Messages Area */}
        <ChatMessageList messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <ChatInputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default ChatPage;
