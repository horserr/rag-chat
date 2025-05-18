import React from 'react';
import { Box, Typography } from '@mui/material';

const EvaluationPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Evaluation Page
      </Typography>
      <Typography variant="body1">
        This is where the RAG application and prompt evaluation features will be implemented.
      </Typography>
      {/* Evaluation components and forms will go here */}
    </Box>
  );
};

export default EvaluationPage;
