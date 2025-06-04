import {
  Analytics as DetailsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvaluationManager } from "../../../hooks/evaluation/useEvaluationManager";
import {
  useRagTasks,
  useRagEvaluations,
  useRagPrefetch,
  useRagCacheManager,
} from "../../../hooks/evaluation/useRagQueries";
import {
  TaskCard,
  EvaluationCard,
  EmptyState,
} from "../../../components/evaluation/shared/EvaluationComponents";
import type { TaskDto, EvaluationListItem } from "../../../models/rag-evaluation";

const RagEvaluationOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const evaluationManager = useEvaluationManager();

  // Selected task state
  const [selectedTask, setSelectedTask] = useState<string | null>(taskId || null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Query hooks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useRagTasks();

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = useRagEvaluations(selectedTask || '', !!selectedTask);
  // Prefetch hooks
  const { prefetchTask, prefetchEvaluations } = useRagPrefetch();
  const { invalidateTaskData } = useRagCacheManager();

  const tasks = tasksData?.tasks || [];
  const evaluations = evaluationsData?.evaluations || [];

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
    navigate(`/evaluation/rag/${taskId}`);
  };
  const handleTaskHover = (taskId: string) => {
    prefetchTask(taskId);
    prefetchEvaluations(taskId);
  };

  const handleViewDetails = (evaluationId: string) => {
    if (selectedTask) {
      evaluationManager.navigateToRagDetails(selectedTask, evaluationId);
    }
  };

  const handleRefresh = () => {
    refetchTasks();
    if (selectedTask) {
      invalidateTaskData(selectedTask);
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
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Task List Panel */}
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
              <IconButton onClick={handleRefresh} disabled={tasksLoading}>
                <RefreshIcon />
              </IconButton>
            </Box>            {/* Tasks List */}
            <Stack spacing={2}>
              {tasksLoading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <TaskCard
                      key={i}
                      task={{ id: '', name: '' }}
                      onClick={() => {}}
                      loading={true}
                    />
                  ))}
                </>
              )}

              {tasksError && (
                <Alert severity="error">
                  Failed to load tasks: {(tasksError as Error).message}
                </Alert>
              )}

              {!tasksLoading && !tasksError && tasks.length === 0 && (
                <EmptyState
                  type="tasks"
                  onAction={() => navigate("/evaluation")}
                  actionLabel="创建新任务"
                />
              )}

              {!tasksLoading && !tasksError && tasks.map((task: TaskDto) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTask === task.id}
                  onClick={() => handleTaskSelect(task.id)}
                  onHover={() => handleTaskHover(task.id)}
                />
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Evaluation Details Panel */}
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
              </Box>              {/* Evaluations List */}
              <Stack spacing={2}>
                {evaluationsLoading && (
                  <>
                    {[1, 2].map((i) => (
                      <EvaluationCard
                        key={i}
                        evaluation={{ id: '', status: '' }}
                        onViewDetails={() => {}}
                        loading={true}
                      />
                    ))}
                  </>
                )}

                {evaluationsError && (
                  <Alert severity="error">
                    Failed to load evaluations: {(evaluationsError as Error).message}
                  </Alert>
                )}

                {!evaluationsLoading && !evaluationsError && evaluations.length === 0 && (
                  <EmptyState type="evaluations" />
                )}

                {!evaluationsLoading && !evaluationsError && evaluations.map((evaluation: EvaluationListItem) => (
                  <EvaluationCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    onViewDetails={() => handleViewDetails(evaluation.id)}
                  />
                ))}
              </Stack>
            </Box>
          </motion.div>
        ) : (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
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