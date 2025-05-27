import React from 'react';
import { Box, Avatar, Typography, useTheme } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WelcomeMessageProps {
  // Can add props later if needed
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.text.secondary,
        opacity: 0.8
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          color: theme.palette.primary.main
        }}
      >
        <SmartToyOutlinedIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        How can I help you today?
      </Typography>
      <Typography variant="body2" sx={{ maxWidth: 400, textAlign: 'center' }}>
        Ask me any question and I'll do my best to provide accurate and helpful information.
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
