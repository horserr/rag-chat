import React from "react";
import { Box, useTheme } from "@mui/material";

const StreamingCursor = () => {
  const theme = useTheme();

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "8px",
        height: "16px",
        ml: 0.5,
        backgroundColor: theme.palette.primary.main,
        animation: "blink 1s infinite",
      }}
    />
  );
};

export default StreamingCursor;
