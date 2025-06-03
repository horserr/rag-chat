import { Box, Paper, Typography } from "@mui/material";
import "highlight.js/styles/github.css"; // 你可以选择其他主题
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import StreamingCursor from "./StreamingCursor";

interface MessageBubbleProps {
  sender: "user" | "bot";
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
  // 用户消息显示为纯文本，助手消息显示为 Markdown
  const shouldRenderMarkdown = sender === "bot";

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
      {shouldRenderMarkdown ? (
        <Box
          sx={{
            "& p": { margin: "0 0 8px 0" },
            "& p:last-child": { margin: 0 },
            "& pre": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              padding: "12px",
              borderRadius: "6px",
              overflow: "auto",
              fontSize: "0.875rem",
              margin: "8px 0",
            },
            "& code": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "0.875rem",
            },
            "& pre code": {
              backgroundColor: "transparent",
              padding: 0,
            },
            "& ul, & ol": {
              margin: "8px 0",
              paddingLeft: "24px",
            },
            "& blockquote": {
              borderLeft: "4px solid #ddd",
              paddingLeft: "16px",
              margin: "8px 0",
              fontStyle: "italic",
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              margin: "16px 0 8px 0",
              fontWeight: "bold",
            },
            "& h1:first-of-type, & h2:first-of-type, & h3:first-of-type": {
              marginTop: 0,
            },
            wordBreak: "break-word",
            lineHeight: 1.6,
            color: isError ? "error.main" : "inherit",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {text}
          </ReactMarkdown>
          {isStreaming && <StreamingCursor />}
        </Box>
      ) : (
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
      )}
    </Paper>
  );
};

export default MessageBubble;
