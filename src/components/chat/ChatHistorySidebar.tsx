import React from 'react';
import {
  Box, Typography, Button, Divider, Badge, useTheme, Paper, Tooltip
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

interface ChatHistorySidebarProps {
  isOpen: boolean;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ isOpen }) => {
  const theme = useTheme();

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
        backgroundColor: 'rgba(247,250,252,0.7)',
        transition: 'opacity 300ms ease',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

      <Divider sx={{ mb: 2 }} />

      {/* History items */}
      <Box sx={{ mb: 1 }}>
        {[1, 2, 3].map((item) => (
          <Button
            key={item}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              py: 1.5,
              px: 2,
              mb: 1,
              borderRadius: '10px',
              backgroundColor: item === 1 ? 'rgba(67, 97, 238, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(67, 97, 238, 0.12)',
              },
              color: theme.palette.text.primary
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: item === 1 ? 600 : 400,
                  mb: 0.5,
                  color: item === 1 ? theme.palette.primary.main : 'inherit',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {`Chat Session ${item}`}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Badge
                  color="primary"
                  variant="dot"
                  sx={{ mr: 1, display: item === 1 ? 'inline-flex' : 'none' }}
                />
                May {17 + item}, 2025
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>      <Box sx={{ flexGrow: 1 }} />

      <Tooltip title="Create new chat">
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: '10px',
            py: 1,
            mt: 2,
            borderColor: 'rgba(0,0,0,0.1)',
            color: theme.palette.text.secondary
          }}
        >
          + New Chat
        </Button>
      </Tooltip>
    </Paper>
  );
};

export default ChatHistorySidebar;
