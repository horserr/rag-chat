import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface MessageHeaderProps {
  sender: "user" | "assistant";
  timestamp: string;
}

const MessageHeader = ({ sender, timestamp }: MessageHeaderProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 0.5,
        flexDirection: sender === "user" ? "row-reverse" : "row",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          ml: sender === "user" ? 0 : 1,
          mr: sender === "user" ? 1 : 0,
          fontWeight: 500,
        }}
      >
        {sender === "user" ? "You" : "Assistant"}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          opacity: 0.6,
          ml: sender === "user" ? 0 : 1,
          mr: sender === "user" ? 1 : 0,
        }}
      >
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
    </Box>
  );
};

export default MessageHeader;
