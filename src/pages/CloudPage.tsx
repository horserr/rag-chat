
// src/pages/CloudPage.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import CloudMainPanel from "../components/cloud/CloudMainPanel"; 

const CloudPage: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Cloud Storage
      </Typography>
      <CloudMainPanel /> {/* 👈 显示主面板（你需要确保这个组件不是空的） */}
    </Box>
  );
};

export default CloudPage;
