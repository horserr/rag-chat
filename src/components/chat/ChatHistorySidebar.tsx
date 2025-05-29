import React from 'react';
import {
  Box, Typography, Button, Divider, useTheme, Paper,
  List, ListItem, IconButton, CircularProgress
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSessions, useCreateSession, useDeleteSession } from '../../hooks/useSessions';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  sessionId?: number;
  onSelectSession?: (id: number) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ isOpen, sessionId, onSelectSession }) => {
  const theme = useTheme();

  // Use React Query hooks for session management
  const { data: sessions = [], isLoading: loading } = useSessions();
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  const handleNewSession = async () => {
    if (!onSelectSession) return;

    createSessionMutation.mutate(undefined, {
      onSuccess: (newSession) => {
        // Select the new session
        onSelectSession(newSession.id);
      },
      onError: (error) => {
        console.error("Error creating new session:", error);
      }
    });
  };
  const handleDeleteSession = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selection when deleting

    deleteSessionMutation.mutate(id, {
      onError: (error) => {
        console.error("Error deleting session:", error);
      }
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '280px',
        flexShrink: 0,
        padding: '16px',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.paper,
        transition: 'opacity 300ms ease',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '1.05rem',
              color: theme.palette.text.primary
            }}
          >
            Chat History
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleNewSession}
          startIcon={<AddIcon />}
        >
          New
        </Button>
      </Box>      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ overflow: 'auto', flex: 1, pb: 1 }}>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <ListItem
                key={session.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    sx={{ opacity: 0.7 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ mb: 1 }}
              >
                <Button
                  fullWidth
                  onClick={() => onSelectSession && onSelectSession(session.id)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 1.5,
                    px: 2,
                    borderRadius: '10px',
                    backgroundColor: sessionId === session.id ? 'rgba(67, 97, 238, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(67, 97, 238, 0.12)',
                    },
                    color: theme.palette.text.primary
                  }}
                >
                  <Box sx={{ width: '100%', pr: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: sessionId === session.id ? 600 : 400,
                        mb: 0.5,
                        color: sessionId === session.id ? theme.palette.primary.main : 'inherit',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {session.title || "New Chat"}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {new Date(session.active_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Button>
              </ListItem>
            ))
          ) : (
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1.5 }}>
                <HistoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>No History Yet</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
                Your conversations will appear here
              </Typography>
            </Box>
          )}
        </List>
      )}
    </Paper>
  );
};

export default ChatHistorySidebar;
