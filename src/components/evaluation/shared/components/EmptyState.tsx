import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /**
   * The type of empty state to display
   */
  type: "tasks" | "evaluations";
  /**
   * Optional action to perform when the button is clicked
   */
  onAction?: () => void;
  /**
   * Optional label for the action button
   */
  actionLabel?: string;
  /**
   * Optional custom message to display
   */
  customMessage?: string;
}

/**
 * EmptyState component displayed when there are no tasks or evaluations
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
  customMessage,
}) => {
  const isTasksEmpty = type === "tasks";

  // Default messages
  const title =
    customMessage || (isTasksEmpty ? "暂无评估任务" : "该任务暂无评估记录");
  const subtitle = isTasksEmpty
    ? "开始创建您的第一个评估任务，体验智能评估功能"
    : "为此任务创建评估记录以开始分析";

  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <Box
          component={motion.div}
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 2 }}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            borderRadius: "50%",
            opacity: 0.7,
          }}
        />
      </Box>
      <Typography
        variant="h6"
        color="text.primary"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 300, mx: "auto" }}
      >
        {subtitle}
      </Typography>
      {onAction && actionLabel && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              console.log(`Action button clicked: ${actionLabel}`);
              onAction();
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #1976d2)",
                boxShadow: "0 12px 32px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export { EmptyState };
