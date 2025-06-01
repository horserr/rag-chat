import React from "react";
import { Box, useTheme, Paper, List, CircularProgress } from "@mui/material";
import {
  useSessions,
  useCreateSession,
  useDeleteSession,
} from "../../hooks/useSessions";
import SidebarHeader from "./sidebar/SidebarHeader";
import SessionListItem from "./sidebar/SessionListItem";
import EmptySessionsState from "./sidebar/EmptySessionsState";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  sessionId?: number;
  setSessionId: (id: number) => void;
}

const ChatHistorySidebar = ({
  isOpen,
  sessionId,
  setSessionId,
}: ChatHistorySidebarProps) => {
  const theme = useTheme();

  // Use React Query hooks for session management
  const { data: sessions = [], isLoading: loading } = useSessions();
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  const handleNewSession = async () => {
    createSessionMutation.mutate(undefined, {
      onSuccess: (newSession) => {
        // Select the new session
        setSessionId(newSession.id);
      },
      onError: (error) => {
        console.error("Error creating new session:", error);
      },
    });
  };

  const handleDeleteSession = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selection when deleting

    deleteSessionMutation.mutate(id, {
      onError: (error) => {
        console.error("Error deleting session:", error);
      },
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "280px",
        flexShrink: 0,
        padding: "16px",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        backgroundColor: theme.palette.background.paper,
        transition: "opacity 300ms ease",
        opacity: isOpen ? 1 : 0,
      }}
    >
      {" "}
      <SidebarHeader onNewSession={handleNewSession} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ overflow: "auto", flex: 1, pb: 1 }}>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                isSelected={sessionId === session.id}
                onSelect={setSessionId}
                onDelete={handleDeleteSession}
              />
            ))
          ) : (
            <EmptySessionsState />
          )}
        </List>
      )}
    </Paper>
  );
};

export default ChatHistorySidebar;
