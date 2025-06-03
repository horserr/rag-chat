import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import MessageAvatar from "./MessageAvatar";

interface LoadingIndicatorProps {
  messagesCount: number;
}

const LoadingIndicator = ({ messagesCount }: LoadingIndicatorProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "0 16px 16px",
        animationDelay: `${messagesCount * 0.1}s`,
      }}
      className="message-animation"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MessageAvatar sender="assistant" />
        <Paper
          elevation={0}
          sx={{
            padding: "16px 24px",
            backgroundColor: "white",
            borderRadius: "18px 18px 18px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CircularProgress size={20} color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="body2" color="textSecondary">
            Thinking...
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoadingIndicator;
