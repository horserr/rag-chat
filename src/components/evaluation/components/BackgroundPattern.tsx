import React from "react";
import { Box } from "@mui/material";

interface BackgroundPatternProps {
  color: string;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ color }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          ${color},
          ${color} 1px,
          transparent 1px,
          transparent 20px
        )`,
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundPattern;
