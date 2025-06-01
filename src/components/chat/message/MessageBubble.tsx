import { Paper, Typography } from "@mui/material";
import StreamingCursor from "./StreamingCursor";

interface MessageBubbleProps {
  sender: "user" | "assistant";
  text: string;
  isError?: boolean;
  isStreaming?: boolean;
}

const MessageBubble = ({
  sender,
  text,
  isError,
  isStreaming,
}: MessageBubbleProps) => {
  return (
    <Paper
      elevation={0}
      className={sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}
      sx={{
        padding: "14px 20px",
        display: "inline-block",
        maxWidth: "100%",
        borderColor: isError ? "error.light" : "inherit",
        borderWidth: isError ? 1 : 0,
        borderStyle: isError ? "solid" : "none",
        backgroundColor: isError ? "rgba(211, 47, 47, 0.05)" : undefined,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: 1.6,
          color: isError ? "error.main" : "inherit",
        }}
      >
        {text}
        {isStreaming && <StreamingCursor />}
      </Typography>
    </Paper>
  );
};

export default MessageBubble;
