
// src/pages/CloudPage.tsx
import React from "react";
import { Box } from "@mui/material";
import CloudMainPanel from "../components/cloud/CloudMainPanel";




const CloudPage: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <CloudMainPanel />
    </Box>
  );
};

export default CloudPage;
