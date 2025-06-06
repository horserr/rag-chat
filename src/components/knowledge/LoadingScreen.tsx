import React from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

/**
 * Loading screen component for use during data fetching operations
 */
const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingScreen;
