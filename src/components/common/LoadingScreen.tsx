import React from 'react';
import { Box } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

/**
 * LoadingScreen - Simple loading screen component
 * Shows a loading message while the app is initializing
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading chat..."
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontWeight: 500,
        color: "text.secondary",
      }}
    >
      {message}
    </Box>
  );
};

export default LoadingScreen;
