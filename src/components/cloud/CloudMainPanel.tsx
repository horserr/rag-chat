// src/components/cloud/CloudMainPanel.tsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const CloudMainPanel: React.FC = () => {
  return (
    <Paper sx={{ padding: 2, minHeight: 200 }}>
      <Typography variant="body1">
        Welcome to your Cloud Storage. Upload and manage your files here.
      </Typography>
    </Paper>
  );
};

export default CloudMainPanel;

