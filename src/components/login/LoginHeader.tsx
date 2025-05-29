import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
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
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleHomeClick}
      >
        <Avatar
          src="/icon.png"
          alt="Logo"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          RAG Chat
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginHeader;
