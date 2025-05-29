import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HomeHeaderProps {
  isLoggedIn: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleEvalClick = () => {
    navigate('/evaluation');
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src="/icon.png"
          alt="Logo"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          RAG Chat
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isLoggedIn ? (
          <>
            <Button
              variant="text"
              color="primary"
              onClick={handleChatClick}
            >
              Chat
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEvalClick}
            >
              Evaluation
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default HomeHeader;
