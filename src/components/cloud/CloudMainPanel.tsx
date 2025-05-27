// src/components/cloud/CloudMainPanel.tsx
import React from "react";
import { Typography, Paper } from "@mui/material";
import CloudUploader from "./CloudUploader";


const CloudMainPanel: React.FC = () => {
  return (
    <Paper sx={{ padding: 2, minHeight: 200 }}>
      <Typography variant="h5" gutterBottom>
        我的云盘
      </Typography>
      <CloudUploader />
    </Paper>
  );
};

export default CloudMainPanel;

