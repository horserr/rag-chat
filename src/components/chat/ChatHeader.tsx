import React from 'react';
import {
  Box, Typography, IconButton, Chip, useTheme, Tooltip, Button
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import StorageIcon from '@mui/icons-material/Storage';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleNavigateToKnowledge = () => {
    navigate('/knowledge');
  };

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
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

          <Button
            variant="outlined"
            size="small"
            startIcon={<StorageIcon />}
            onClick={handleNavigateToKnowledge}
            sx={{
              fontSize: '0.75rem',
              textTransform: 'none'
            }}
          >
            Knowledge Base
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHeader;
