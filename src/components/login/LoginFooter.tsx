import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 NJU RAG Platform
      </Typography>
    </Box>
  );
};

export default LoginFooter;
