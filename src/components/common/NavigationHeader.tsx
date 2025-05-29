import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NavigationHeaderProps {
  showHomeNavigation?: boolean;
  title?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  showHomeNavigation = true,
  title = "RAG Chat"
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (showHomeNavigation) {
      navigate('/');
    }
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
      </Box>
    </Box>
  );
};

export default NavigationHeader;
