import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Analytics as DetailsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  usePromptTasks,
  usePromptEvaluations,
  usePromptPrefetch,
  usePromptCacheManager,
  useCreatePromptEvaluation,
} from '../../../hooks/evaluation/usePromptQueries';
import {
  TaskCard,
  EvaluationCard,
  EmptyState,
} from '../../../components/evaluation/shared/EvaluationComponents';
import type { PromptTask, PromptEvaluationResponse } from '../../../models/prompt-evaluation';
import { useEvaluationManager } from '../../../hooks/evaluation/useEvaluationManager';

const PromptEvaluationOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const evaluationManager = useEvaluationManager();

  // Selected task state
  const [selectedTask, setSelectedTask] = useState<number | null>(taskId ? parseInt(taskId) : null);
  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');

  // Query hooks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = usePromptTasks();

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = usePromptEvaluations(selectedTask || 0, !!selectedTask);

  // Prefetch hooks
  const { prefetchTask, prefetchEvaluations } = usePromptPrefetch();
  const { invalidateTaskData } = usePromptCacheManager();

  // Mutation hooks
  const createEvaluationMutation = useCreatePromptEvaluation();

  const tasks = tasksData?.tasks || [];
  const evaluations = evaluationsData?.evaluations || [];

  const handleTaskSelect = (taskId: number) => {
    setSelectedTask(taskId);
    navigate(`/evaluation/prompt/${taskId}`);
  };

  const handleTaskHover = (taskId: number) => {
    prefetchTask(taskId);
    prefetchEvaluations(taskId);
  };

  const handleViewDetails = (evaluationId: number) => {
    if (selectedTask) {
      evaluationManager.navigateToPromptDetails(selectedTask, evaluationId);
    }
  };

  const handleRefresh = () => {
    refetchTasks();
    if (selectedTask) {
      invalidateTaskData(selectedTask);
    }
  };

  const handleCreateEvaluation = async () => {
    if (!selectedTask || !newPrompt.trim()) return;

    try {
      await createEvaluationMutation.mutateAsync({
        taskId: selectedTask,
        evaluationData: { prompt: newPrompt.trim() },
      });
      setNewPrompt('');
      setShowNewEvaluationDialog(false);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
    }
  };

  const isDetailView = !!selectedTask;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h4" fontWeight="bold">
          Prompt 评估管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理和优化 Prompt 的质量评估
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
              <Typography variant="h6">Prompt 任务</Typography>
              <IconButton onClick={handleRefresh} disabled={tasksLoading}>
                <RefreshIcon />
              </IconButton>
            </Box>

            {/* Tasks List */}
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

              {!tasksLoading && !tasksError && tasks.map((task: PromptTask) => (
                <TaskCard
                  key={task.taskId}
                  task={{ id: task.taskId, name: task.taskName, description: `Task ID: ${task.taskId}` }}
                  isSelected={selectedTask === task.taskId}
                  onClick={() => handleTaskSelect(task.taskId)}
                  onHover={() => handleTaskHover(task.taskId)}
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
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewEvaluationDialog(true)}
                    color="secondary"
                  >
                    新增评估
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DetailsIcon />}
                    onClick={() => setShowDetailDialog(true)}
                  >
                    查看详情
                  </Button>
                </Box>
              </Box>

              {/* Evaluations List */}
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
                )}                {!evaluationsLoading && !evaluationsError && evaluations.map((evaluation: PromptEvaluationResponse) => (
                  <EvaluationCard
                    key={evaluation.evalId}
                    evaluation={{                      id: evaluation.evalId,
                      status: 'completed',
                      result: parseFloat(evaluation.promptScore),
                      name: `评估 #${evaluation.evalId}`,
                      created_at: new Date().toISOString() // Adding ISO date string since createdAt is missing
                    }}
                    onViewDetails={() => handleViewDetails(evaluation.evalId)}
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
                请选择一个 Prompt 任务
              </Typography>
              <Typography variant="body1" color="text.secondary">
                从左侧列表中选择一个任务来查看其评估记录
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* New Evaluation Dialog */}
      <Dialog
        open={showNewEvaluationDialog}
        onClose={() => setShowNewEvaluationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>新增 Prompt 评估</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Prompt 内容"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="请输入要评估的 Prompt..."
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            提示: 评估将分析 Prompt 的质量、清晰度和效果等多个维度
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewEvaluationDialog(false)}>
            取消
          </Button>
          <Button
            onClick={handleCreateEvaluation}
            variant="contained"
            disabled={!newPrompt.trim() || createEvaluationMutation.isPending}
          >
            {createEvaluationMutation.isPending ? <CircularProgress size={20} /> : '开始评估'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default PromptEvaluationOverviewPage;
