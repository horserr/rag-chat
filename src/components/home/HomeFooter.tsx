import React from 'react';
import { Box, Typography } from '@mui/material';

const HomeFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
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

export default HomeFooter;
