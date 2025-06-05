import {
  CheckCircle as CompletedIcon,
  Error as ErrorIcon,
  MoreVert as MoreIcon,
  Schedule as PendingIcon,
  PlayArrow as StartIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  LinearProgress,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
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
  onDelete?: (taskId: string | number) => void;
  onRename?: (taskId: string | number, newName: string) => void;
  loading?: boolean;
}

/**
 * Get the appropriate icon for a given evaluation status
 * @param status The evaluation status
 * @returns React element with the appropriate icon
 */
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
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

/**
 * Get the appropriate color for a given evaluation status
 * @param status The evaluation status
 * @returns MUI color string for the status
 */
const getStatusColor = (
  status: string
): "success" | "error" | "primary" | "warning" | "default" => {
  switch (status.toLowerCase()) {
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

/**
 * A button wrapped in motion effects for animated interactions
 */
const MotionButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium" | "large";
  sx?: SxProps<Theme>;
  title?: string;
  "aria-label"?: string;
}> = ({
  children,
  onClick,
  disabled = false,
  variant = "text",
  color = "primary",
  size = "medium",
  sx,
  title,
  "aria-label": ariaLabel,
}) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{ display: "inline-block" }}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        onClick={onClick}
        sx={sx}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected = false,
  onClick,
  onHover,
  onDelete,
  onRename,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showRenameDialog, setShowRenameDialog] = React.useState(false);
  const [newName, setNewName] = React.useState(task.name);
  const [renameError, setRenameError] = React.useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleRenameClick = () => {
    setNewName(task.name);
    setRenameError("");
    setShowRenameDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(task.id);
    }
    setShowDeleteDialog(false);
  };

  const handleRenameConfirm = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setRenameError("任务名称不能为空");
      return;
    }
    if (trimmedName === task.name) {
      setShowRenameDialog(false);
      return;
    }
    if (onRename) {
      onRename(task.id, trimmedName);
    }
    setShowRenameDialog(false);
  };

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
    <>
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
              {(onDelete || onRename) && (
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreIcon />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onRename && (
          <MenuItem onClick={handleRenameClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>重命名</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>删除</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除任务 "{task.name}" 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>取消</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={showRenameDialog}
        onClose={() => setShowRenameDialog(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>重命名任务</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="任务名称"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setRenameError("");
            }}
            error={!!renameError}
            helperText={renameError}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRenameDialog(false)}>取消</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/**
 * Evaluation status types
 */
type EvaluationStatus = "completed" | "failed" | "running" | "pending";

/**
 * Evaluation data structure
 */
interface EvaluationData {
  id: string | number;
  name?: string;
  status: EvaluationStatus | string;
  eval_type?: string;
  metric?: string;
  result?: number;
  created_at?: string;
}

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

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
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

/**
 * Props for the LoadingState component
 */
interface LoadingStateProps {
  /**
   * The type of items being loaded
   */
  type: "tasks" | "evaluations";
  /**
   * The number of skeleton placeholders to show
   */
  count?: number;
}

/**
 * LoadingState component displays skeleton placeholders while content is loading
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  count = 3,
}) => {
  return (
    <Box sx={{ opacity: 0.7 }}>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} sx={{ mb: 2 }}>
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
        </Box>
      ))}
    </Box>
  );
};

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
export const EmptyState: React.FC<EmptyStateProps> = ({
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
