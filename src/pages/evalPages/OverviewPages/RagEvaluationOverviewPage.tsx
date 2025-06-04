import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  Alert,
  Skeleton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompletedIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Analytics as DetailsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { TaskService as RagTaskService } from "../../../services/eval/rag/task.service";
import { EvaluationService as RagEvaluationService } from "../../../services/eval/rag/evaluation.service";
import type {
  TaskListResponse,
  EvaluationListResponse,
  EvaluationStatusResponse,
  TaskDto,
  EvaluationListItem,
} from "../../../models/rag-evaluation";
import { useEvaluationManager } from "../../../hooks/evaluation/useEvaluationManager";

const RagEvaluationOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const evaluationManager = useEvaluationManager();
  const [tasks, setTasks] = useState<TaskListResponse["tasks"]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(
    taskId || null // 只有当URL中有taskId时才设置，否则为null
  );
  const [evaluations, setEvaluations] = useState<
    EvaluationListResponse["evaluations"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingStatuses, setPollingStatuses] = useState<
    Record<string, EvaluationStatusResponse>
  >({});
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const ragTaskService = useMemo(() => new RagTaskService(), []);
  const ragEvaluationService = useMemo(() => new RagEvaluationService(), []);
  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ragTaskService.getTasks();
      setTasks(response.tasks);

      // 移除自动选择第一个任务的逻辑，让用户手动选择
      // if (!selectedTask && response.tasks.length > 0) {
      //   setSelectedTask(response.tasks[0].id);
      // }
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [ragTaskService]); // 移除 selectedTask 依赖，避免不必要的重新执行

  // Poll evaluation status
  const pollEvaluationStatus = useCallback(
    async (taskId: string, evaluationId: string) => {
      try {
        const status = await evaluationManager.pollRagEvaluationStatus(
          taskId,
          evaluationId,
          (status: EvaluationStatusResponse) => {
            setPollingStatuses((prev) => ({
              ...prev,
              [evaluationId]: status,
            }));
          }
        );

        // When completed, refresh evaluations
        if (status.status === "completed" || status.status === "failed") {
          // Reload evaluations when completed
          const response = await ragEvaluationService.getEvaluations(taskId);
          setEvaluations(response.evaluations);
        }
      } catch (err) {
        console.error("Error polling evaluation status:", err);
      }
    },
    [evaluationManager, ragEvaluationService] // 移除 selectedTask 依赖，通过参数传递
  );

  // Load evaluations for selected task
  const loadEvaluations = useCallback(async () => {
    if (!selectedTask) return;

    try {
      const response = await ragEvaluationService.getEvaluations(selectedTask);
      setEvaluations(response.evaluations); // Start polling for pending/running evaluations
      response.evaluations
        .filter(
          (item: EvaluationListItem) =>
            item.status === "pending" || item.status === "running"
        )
        .forEach((item: EvaluationListItem) => {
          pollEvaluationStatus(selectedTask, item.id);
        });
    } catch (err) {
      console.error("Error loading evaluations:", err);
    }
  }, [selectedTask, ragEvaluationService, pollEvaluationStatus]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (selectedTask) {
      loadEvaluations();
    }
  }, [selectedTask, loadEvaluations]);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
    navigate(`/evaluation/rag/${taskId}`);
  };

  const handleViewDetails = (evaluationId: string) => {
    if (selectedTask) {
      evaluationManager.navigateToRagDetails(selectedTask, evaluationId);
    }
  };

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

  const isDetailView = !!selectedTask;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h4" fontWeight="bold">
          RAG 评估管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理和监控 RAG 系统的评估任务
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>        {/* Task List Panel */}
        <motion.div
          initial={false}
          animate={{ width: selectedTask ? "50%" : "100%" }}
          transition={{ duration: 0.3 }}
          style={{ borderRight: selectedTask ? "1px solid #e0e0e0" : "none" }}
        >
          <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">评估任务</Typography>
              <IconButton onClick={loadTasks} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Box>
            {loading && (
              <Grid container spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Grid size={{ xs: 12 }} key={i}>
                    <Skeleton variant="rectangular" height={120} />
                  </Grid>
                ))}
              </Grid>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}{" "}
            {!loading && !error && (
              <Grid container spacing={2}>
                {tasks.map((task: TaskDto) => (
                  <Grid size={{ xs: 12 }} key={task.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: selectedTask === task.id ? 2 : 1,
                        borderColor:
                          selectedTask === task.id ? "primary.main" : "divider",
                        "&:hover": {
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => handleTaskSelect(task.id)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                          }}
                        >
                          <Box>
                            <Typography variant="h6">{task.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {task.id}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <MoreIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {!loading && !error && tasks.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  暂无评估任务
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/evaluation")}
                >
                  创建新任务
                </Button>
              </Box>
            )}
          </Box>
        </motion.div>        {/* Evaluation Details Panel */}
        {isDetailView ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "50%" }}
          >
            <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">评估记录</Typography>
                <Button
                  variant="contained"
                  startIcon={<DetailsIcon />}
                  onClick={() => setShowDetailDialog(true)}
                >
                  查看详情
                </Button>
              </Box>{" "}
              <Grid container spacing={2}>
                {evaluations.map((evaluation: EvaluationListItem) => {
                  const currentStatus = pollingStatuses[evaluation.id] || {
                    status: evaluation.status,
                  };

                  return (
                    <Grid size={{ xs: 12 }} key={evaluation.id}>
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
                              {getStatusIcon(currentStatus.status)}
                              <Typography variant="h6">
                                {evaluation.name || `评估 ${evaluation.id}`}
                              </Typography>
                            </Box>
                            <Chip
                              label={currentStatus.status}
                              color={getStatusColor(currentStatus.status)}
                              size="small"
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            类型: {evaluation.eval_type} | 指标:{" "}
                            {evaluation.metric}
                          </Typography>

                          {currentStatus.status === "running" &&
                            currentStatus.progress !== undefined && (
                              <Box sx={{ mb: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={currentStatus.progress}
                                  sx={{ mb: 1 }}
                                />
                                <Typography variant="caption">
                                  进度: {currentStatus.progress}%
                                </Typography>
                              </Box>
                            )}

                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button
                              size="small"
                              onClick={() => handleViewDetails(evaluation.id)}
                              disabled={currentStatus.status === "pending"}
                            >
                              查看详情
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              {evaluations.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    该任务暂无评估记录
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>        ) : (
          // 当没有选择任务时显示的占位符
          <Box
            sx={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50"
            }}
          >
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                请选择一个评估任务
              </Typography>
              <Typography variant="body1" color="text.secondary">
                从左侧列表中选择一个任务来查看其评估记录
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>任务详情</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Typography>
              任务ID: {selectedTask}
              {/* Add more detailed information here */}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RagEvaluationOverviewPage;
