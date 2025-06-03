import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface NavigationHeaderProps {
  showHomeNavigation?: boolean;
  title?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  showHomeNavigation = true,
  title = "RAG Chat"
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (showHomeNavigation) {
      navigate('/');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        justifyContent: 'space-between'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: showHomeNavigation ? 'pointer' : 'default',
          '&:hover': showHomeNavigation ? {
            opacity: 0.8,
          } : {},
        }}
        onClick={handleHomeClick}
      >
        <Avatar
          src="/icon.png"
          alt="Logo"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          {title}
        </Typography>
      </Box>      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          color="primary"
          variant={location.pathname.includes('/chat') ? "contained" : "text"}
          onClick={() => handleNavigation('/chat')}
          startIcon={<ChatIcon />}
          sx={{
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
            '&:active': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          Chat
        </Button>
        <Button
          color="primary"
          variant={location.pathname.includes('/evaluation') ? "contained" : "text"}
          onClick={() => handleNavigation('/evaluation')}
          startIcon={<AssessmentIcon />}
          sx={{
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
            '&:active': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          Evaluation
        </Button>
      </Box>
    </Box>
  );
};

export default NavigationHeader;
