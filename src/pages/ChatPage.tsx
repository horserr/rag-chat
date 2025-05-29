import React, { useState } from "react";
import { Box, Collapse } from "@mui/material";
import ChatHistorySidebar from "../components/chat/ChatHistorySidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatInputArea from "../components/chat/ChatInputArea";
import { useChatQuery } from "../hooks/useChatQuery";
import { useAuthCheck } from "../hooks/useAuth";
import { useCreateSession } from "../hooks/useSessions";
import { useNavigate } from "react-router-dom";

/**
 * ChatPage component represents the main chat interface
 * It includes the chat history sidebar, message list, and input area
 */
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);

  // Check authentication status using React Query
  const { data: authData } = useAuthCheck();
  const createSessionMutation = useCreateSession();

  // Use React Query for chat functionality
  const {
    messages,
    sendMessage,
    isLoading,
    setSession,
    currentSessionId,
  } = useChatQuery(sessionId);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (authData && !authData.isLoggedIn) {
      navigate("/login");
    }
  }, [authData, navigate]);

  // Create a new session if none exists and user is authenticated
  React.useEffect(() => {
    if (authData?.isLoggedIn && !sessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate(undefined, {
        onSuccess: (newSession) => {
          setSessionId(newSession.id);
          setSession(newSession.id);
        },
        onError: (error) => {
          console.error("Error creating new session:", error);
        }
      });
    }
  }, [authData, sessionId, createSessionMutation, setSession]);

  const handleToggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* History Panel with animation */}{" "}
      <Collapse
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
