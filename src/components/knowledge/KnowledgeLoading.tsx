import React from 'react';
import { Box, CircularProgress, Fade, Paper, Skeleton } from '@mui/material';

const KnowledgeLoading: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: "primary.main",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Skeleton
              variant="text"
              width={200}
              height={24}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width={150}
              height={16}
              sx={{ mx: "auto" }}
            />
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default KnowledgeLoading;
