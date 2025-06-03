import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompletedIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskService as PromptTaskService } from '../services/eval/prompt/task.service';
import { EvaluationService as PromptEvaluationService } from '../services/eval/prompt/evaluation.service';
import type {
  PromptTask,
  PromptEvaluationResponse,
} from '../models/prompt-evaluation';
import { useEvaluationManager } from '../hooks/evaluation/useEvaluationManager';

const PromptEvaluationOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const evaluationManager = useEvaluationManager();

  const [tasks, setTasks] = useState<PromptTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<number | null>(taskId ? parseInt(taskId) : null);
  const [evaluations, setEvaluations] = useState<PromptEvaluationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promptTaskService = useMemo(() => new PromptTaskService(), []);
  const promptEvaluationService = useMemo(() => new PromptEvaluationService(), []);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const tasksData = await promptTaskService.getAllTasks();
      setTasks(tasksData);

      // If no specific task selected, select the first one
      if (!selectedTask && tasksData.length > 0) {
        setSelectedTask(tasksData[0].taskId);
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedTask, promptTaskService]);

  // Load evaluations for selected task
  const loadEvaluations = useCallback(async () => {
    if (!selectedTask) return;

    try {
      const response = await promptTaskService.getTaskEvaluations(selectedTask);      // Check if it's an error response
      if ('detail' in response) {
        console.log('No evaluations found for this task');
        setEvaluations([]);
      } else {
        setEvaluations((response as unknown) as PromptEvaluationResponse[]);
      }
    } catch (err) {
      console.error('Error loading evaluations:', err);
      setEvaluations([]);
    }
  }, [selectedTask, promptTaskService]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (selectedTask) {
      loadEvaluations();
    }
  }, [selectedTask, loadEvaluations]);

  const handleTaskSelect = (taskId: number) => {
    setSelectedTask(taskId);
    navigate(`/evaluation/prompt/${taskId}`);
  };

  const handleViewDetails = (evaluationId: number) => {
    if (selectedTask) {
      evaluationManager.navigateToPromptDetails(selectedTask, evaluationId);
    }
  };

  const handleNewEvaluation = async () => {
    if (!selectedTask || !newPrompt.trim()) return;

    setIsSubmitting(true);
    try {
      await promptEvaluationService.createEvaluation(selectedTask, {
        prompt: newPrompt.trim(),
      });

      // Close dialog and refresh evaluations
      setShowNewEvaluationDialog(false);
      setNewPrompt('');
      loadEvaluations();
    } catch (err) {
      console.error('Error creating evaluation:', err);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 4) return 'success';
    if (numScore >= 3) return 'warning';
    return 'error';
  };

  const isDetailView = !!selectedTask;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" fontWeight="bold">
          Prompt 评估管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理和优化 Prompt 的质量评估
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Task List Panel */}
        <motion.div
          initial={false}
          animate={{ width: isDetailView ? '50%' : '100%' }}
          transition={{ duration: 0.3 }}
          style={{ borderRight: isDetailView ? '1px solid #e0e0e0' : 'none' }}
        >
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Prompt 任务</Typography>
              <IconButton onClick={loadTasks} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Box>            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={100} />
                ))}
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}            {!loading && !error && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tasks.map((task) => (
                  <Card
                    key={task.taskId}
                    sx={{
                      cursor: 'pointer',
                      border: selectedTask === task.taskId ? 2 : 1,
                      borderColor: selectedTask === task.taskId ? 'secondary.main' : 'divider',
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => handleTaskSelect(task.taskId)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="h6">{task.taskName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {task.taskId}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {!loading && !error && tasks.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  暂无 Prompt 任务
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/evaluation')}
                >
                  创建新任务
                </Button>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Evaluation Details Panel */}
        {isDetailView && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '50%' }}
          >
            <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">评估记录</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewEvaluationDialog(true)}
                  color="secondary"
                >
                  新增评估
                </Button>
              </Box>              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {evaluations.map((evaluation) => (
                  <Card key={evaluation.evalId}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CompletedIcon color="success" />
                          <Typography variant="h6">
                            评估 #{evaluation.evalId}
                          </Typography>
                        </Box>
                        <Chip
                          label={`评分: ${evaluation.promptScore}`}
                          color={getScoreColor(evaluation.promptScore) as 'success' | 'warning' | 'error'}
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        Prompt: {evaluation.prompt}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={`BLEU4: ${evaluation.bleu4Score.toFixed(3)}`} size="small" />
                        <Chip label={`相似度: ${evaluation.semanticSimilarity.toFixed(3)}`} size="small" />
                        <Chip label={`多样性: ${evaluation.lexicalDiversity.toFixed(3)}`} size="small" />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          onClick={() => handleViewDetails(evaluation.evalId)}
                        >
                          查看详情
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {evaluations.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    该任务暂无评估记录
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => setShowNewEvaluationDialog(true)}
                  >
                    创建首个评估
                  </Button>
                </Box>
              )}
            </Box>
          </motion.div>
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
          </Button>          <Button
            onClick={handleNewEvaluation}
            variant="contained"
            disabled={!newPrompt.trim() || isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : '开始评估'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromptEvaluationOverviewPage;
