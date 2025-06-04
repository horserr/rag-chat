import {
  CheckCircle as CompletedIcon,
  Error as ErrorIcon,
  MoreVert as MoreIcon,
  Schedule as PendingIcon,
  PlayArrow as StartIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface TaskCardProps {
  task: {
    id: string | number;
    name: string;
    description?: string;
  };
  isSelected?: boolean;
  onClick: () => void;
  onHover?: () => void;
  loading?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CompletedIcon color="success" />;
    case "failed":
      return <ErrorIcon color="error" />;
    case "running":
      return <StartIcon color="primary" />;
    case "pending":
      return <PendingIcon color="warning" />;
    default:
      return <PendingIcon color="action" />;
  }
};

const getStatusColor = (
  status: string
): "success" | "error" | "primary" | "warning" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "running":
      return "primary";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected = false,
  onClick,
  onHover,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          cursor: "pointer",
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? "primary.main" : "divider",
          "&:hover": {
            boxShadow: 2,
          },
        }}
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" noWrap>
                {task.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                ID: {task.id}
              </Typography>
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: "-webkit-box",
                    "-webkit-line-clamp": 2,
                    "-webkit-box-orient": "vertical",
                    overflow: "hidden",
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </Box>
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface EvaluationCardProps {
  evaluation: {
    id: string | number;
    name?: string;
    status: string;
    eval_type?: string;
    metric?: string;
    result?: number;
    created_at?: string;
  };
  progress?: number;
  onViewDetails: () => void;
  loading?: boolean;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  progress,
  onViewDetails,
  loading = false,
}) => {
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
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
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
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  backgroundColor: "grey.300",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: "primary.main",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={onViewDetails}
              disabled={evaluation.status === "pending"}
            >
              <Typography
                variant="button"
                color={
                  evaluation.status === "pending" ? "text.disabled" : "primary"
                }
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration:
                      evaluation.status !== "pending" ? "underline" : "none",
                  },
                }}
              >
                查看详情
              </Typography>
            </motion.button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface LoadingStateProps {
  type: "tasks" | "evaluations";
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  count = 3,
}) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {type === "tasks" ? (
            <TaskCard
              task={{ id: "", name: "" }}
              onClick={() => {}}
              loading={true}
            />
          ) : (
            <EvaluationCard
              evaluation={{ id: "", status: "" }}
              onViewDetails={() => {}}
              loading={true}
            />
          )}
        </div>
      ))}
    </>
  );
};

interface EmptyStateProps {
  type: "tasks" | "evaluations";
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
}) => {
  const isTasksEmpty = type === "tasks";

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {isTasksEmpty ? "暂无评估任务" : "该任务暂无评估记录"}
      </Typography>
      {onAction && actionLabel && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "16px",
          }}
          onClick={onAction}
        >
          {actionLabel}
        </motion.button>
      )}
    </Box>
  );
};
