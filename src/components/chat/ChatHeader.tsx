import React from 'react';
import {
  Box, Typography, IconButton, Chip, useTheme, Tooltip
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

interface ChatHeaderProps {
  isHistoryPanelOpen: boolean;
  onToggleHistoryPanel: () => void;
  title?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isHistoryPanelOpen,
  onToggleHistoryPanel,
  title = "New Chat Session"
}) => {
  const theme = useTheme();
  return (
    <Box sx={{
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      backgroundColor: 'white',
    }}>
      {/* Session info and controls below */}
      <Box sx={{
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Tooltip title={isHistoryPanelOpen ? "Hide history (Ctrl+Shift+H)" : "Show history (Ctrl+Shift+H)"}>
          <IconButton
            onClick={onToggleHistoryPanel}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              mr: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(67, 97, 238, 0.08)',
                color: theme.palette.primary.main
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Chip
          label="Active"
          size="small"
          color="primary"
          sx={{
            height: '24px',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: '0.7rem'
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatHeader;
