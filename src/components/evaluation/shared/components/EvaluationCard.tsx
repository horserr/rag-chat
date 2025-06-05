import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import MotionButton from "./MotionButton";
import { getStatusColor, getStatusIcon, type EvaluationData } from "./StatusUtils";

/**
 * Props for the EvaluationCard component
 */
interface EvaluationCardProps {
  /**
   * Evaluation data to display in the card
   */
  evaluation: EvaluationData;
  /**
   * Progress value for running evaluations (0-100)
   */
  progress?: number;
  /**
   * Callback when "View details" button is clicked
   */
  onViewDetails: () => void;
  /**
   * Whether the card is in loading state
   */
  loading?: boolean;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  progress,
  onViewDetails,
  loading = false,
}) => {
  // Create a callback handler for the view details action
  const handleViewDetails = React.useCallback(() => {
    console.log(`View details clicked for evaluation ID: ${evaluation.id}`);
    console.log(`Evaluation status: ${evaluation.status}`);
    console.log(`Navigation should occur to detail page for this evaluation`);

    // Add a small delay to ensure UI feedback before navigation
    setTimeout(() => {
      onViewDetails();
    }, 100);
  }, [evaluation.id, evaluation.status, onViewDetails]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="rectangular" width={80} height={24} />
          </Box>
          <Skeleton variant="text" height={20} width="70%" />
          <Skeleton variant="text" height={16} width="50%" sx={{ mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Skeleton variant="rectangular" width={100} height={36} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const isViewable = evaluation.status !== "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          position: "relative",
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {getStatusIcon(evaluation.status)}
              <Typography variant="h6" noWrap>
                {evaluation.name || `评估 ${evaluation.id}`}
              </Typography>
            </Box>
            <Chip
              label={evaluation.status}
              color={getStatusColor(evaluation.status)}
              size="small"
            />
          </Box>

          {(evaluation.eval_type || evaluation.metric) && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {evaluation.eval_type && `类型: ${evaluation.eval_type}`}
              {evaluation.eval_type && evaluation.metric && " | "}
              {evaluation.metric && `指标: ${evaluation.metric}`}
            </Typography>
          )}

          {evaluation.status === "running" && progress !== undefined && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                进度: {progress}%
              </Typography>
            </Box>
          )}

          {evaluation.result !== undefined &&
            evaluation.status === "completed" && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                结果: {evaluation.result.toFixed(3)}
              </Typography>
            )}

          {evaluation.created_at && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              创建时间: {new Date(evaluation.created_at).toLocaleString()}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <MotionButton
              variant="contained"
              color="primary"
              size="small"
              onClick={handleViewDetails}
              disabled={!isViewable}
              sx={{
                textTransform: "none",
                fontWeight: "500",
                padding: "4px 16px",
                borderRadius: "4px",
                boxShadow: isViewable ? 1 : 0,
                opacity: isViewable ? 1 : 0.6,
              }}
              aria-label="View evaluation details"
              title={
                isViewable
                  ? "View detailed evaluation information"
                  : "This evaluation cannot be viewed yet"
              }
            >
              View details
            </MotionButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EvaluationCard };
