import React, { useState, useEffect } from "react";
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

  // Authentication state
  const { data: authData, isLoading: authLoading } = useAuthCheck();

  // Session creation state
  const createSessionMutation = useCreateSession();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Chat functionality with React Query
  const {
    messages,
    sendMessage,
    isLoading,
    setSession,
    currentSessionId,
  } = useChatQuery(sessionId);

  // Handle authentication check and redirect if needed
  useEffect(() => {
    if (!authLoading && authData && !authData.isLoggedIn) {
      navigate("/login");
    }
  }, [authData, authLoading, navigate]);

  // Handle session creation once when authenticated
  useEffect(() => {
    // Only attempt to create a session when:
    // 1. User is authenticated
    // 2. We don't have a session ID yet
    // 3. We haven't started the session creation process
    // 4. The creation mutation isn't already in progress
    if (
      authData?.isLoggedIn &&
      !sessionId &&
      !isCreatingSession &&
      !createSessionMutation.isPending
    ) {
      // Mark that we're starting session creation to prevent duplicate calls
      setIsCreatingSession(true);

      createSessionMutation.mutate(undefined, {
        onSuccess: (newSession) => {
          setSessionId(newSession.id);
          setSession(newSession.id);
        },
        onError: (error) => {
          console.error("Error creating new session:", error);
          // Allow retry on error by resetting the creation flag
          setIsCreatingSession(false);
        }
      });
    }
  }, [
    authData?.isLoggedIn,
    sessionId,
    isCreatingSession,
    createSessionMutation,
    setSession
  ]);

  const handleToggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  };
  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };
  // Show loading while auth is being checked or session is being created
  if (authLoading || (isCreatingSession && createSessionMutation.isPending)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontWeight: 500,
          color: "text.secondary"
        }}
      >
        Loading chat...
      </Box>
    );
  }

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
