import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Analytics as AnalyticsIcon,
  DataObject as DataIcon,
  Assessment as MetricIcon,
  CheckCircle,
  Error,
  HourglassEmpty,
  Sync,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskService as RagTaskService } from '../../../services/eval/rag/task.service';
import { EvaluationService as RagEvaluationService } from '../../../services/eval/rag/evaluation.service';
import type {
  TaskResponse,
  EvaluationListResponse,
  EvaluationDetails as EvaluationDetail,
} from '../../../models/rag-evaluation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RagEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId = '', evaluationId = '' } = useParams<{ taskId: string; evaluationId?: string }>();  const [task, setTask] = useState<TaskResponse['task'] | null>(null);
  const [currentEval, setCurrentEval] = useState<EvaluationDetail | null>(null);
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationListResponse['evaluations']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useMemo to prevent recreating service instances on every render
  const ragTaskService = useMemo(() => new RagTaskService(), []);
  const ragEvaluationService = useMemo(() => new RagEvaluationService(), []);

  // Load task details
  const loadTask = useCallback(async () => {
    try {
      const response = await ragTaskService.getTaskById(taskId);
      setTask(response.task);
    } catch (err) {
      console.error('Error loading task:', err);
      setError('Failed to load task details');
    }
  }, [taskId, ragTaskService]);  // Load evaluation details
  const loadEvaluation = useCallback(async () => {
    if (!evaluationId) return;

    try {
      // First, check if this evaluation is still in progress
      const statusResponse = await ragEvaluationService.getEvaluationStatus(taskId, evaluationId);

      // Set current evaluation with status info we have now
      if (!currentEval) {
        // Set some basic details we know from the status
        setCurrentEval({
          id: evaluationId,
          task_id: taskId,
          status: statusResponse.status,
          created_at: new Date().toISOString(),
          eval_type: "single_turn", // Default assumption until we get full details
          metric: "evaluation",
          result: 0,
          samples: {
            user_input: "Loading...",
            response: "Loading...",
          }
        } as unknown as EvaluationDetail);
      }

      if (statusResponse.status === 'pending' || statusResponse.status === 'running') {
        console.log(`Evaluation ${evaluationId} still running, setting up polling...`);

        // If already completed, just load the details
        const response = await ragEvaluationService.getEvaluationDetails(taskId, evaluationId);
        setCurrentEval(response as unknown as EvaluationDetail);

        // Schedule regular status updates
        setTimeout(loadEvaluation, 5000);
      } else {
        // If already completed, just load the details
        const response = await ragEvaluationService.getEvaluationDetails(taskId, evaluationId);
        setCurrentEval(response as unknown as EvaluationDetail);
      }
    } catch (err) {
      console.error('Error loading evaluation:', err);
      setError('Failed to load evaluation details');
    }
  }, [taskId, evaluationId, ragEvaluationService, currentEval]);

  // Load evaluation history
  const loadEvaluationHistory = useCallback(async () => {
    try {
      const response = await ragEvaluationService.getEvaluations(taskId);
      setEvaluationHistory(response.evaluations);
    } catch (err) {
      console.error('Error loading evaluation history:', err);
    }
  }, [taskId, ragEvaluationService]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadTask(),
        evaluationId ? loadEvaluation() : Promise.resolve(),
        loadEvaluationHistory(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [loadTask, loadEvaluation, loadEvaluationHistory, evaluationId]);

  // Prepare chart data for evaluation history
  const chartData = {
    labels: evaluationHistory.map((_, index) => `评估 ${index + 1}`),
    datasets: [
      {
        label: '评估得分',
        data: evaluationHistory.map(item => item.result || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '评估趋势',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };
  const handleBack = () => {
    navigate('/evaluation/rag');
  };
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
          <Box sx={{ width: '33.33%' }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          返回
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Button startIcon={<BackIcon />} onClick={handleBack}>
            返回
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {task?.name || 'RAG 评估详情'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          任务 ID: {taskId} {evaluationId && `| 评估 ID: ${evaluationId}`}
        </Typography>
      </Box>      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            {/* Current Evaluation Details */}
            {currentEval && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon color="primary" />
                    评估结果
                  </Typography>

                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                    gap: 2,
                    mb: 3
                  }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {typeof currentEval.result === 'number' ? currentEval.result.toFixed(3) : 'N/A'}
                      </Typography>
                      <Typography variant="caption">总体得分</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        {currentEval.eval_type}
                      </Typography>
                      <Typography variant="caption">评估类型</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      {currentEval.status === 'completed' ? (
                        <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle sx={{ mr: 0.5 }} fontSize="small" />
                          已完成
                        </Typography>
                      ) : currentEval.status === 'failed' ? (
                        <Typography variant="h6" color="error.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Error sx={{ mr: 0.5 }} fontSize="small" />
                          失败
                        </Typography>
                      ) : currentEval.status === 'running' ? (
                        <Typography variant="h6" color="info.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sync sx={{ mr: 0.5 }} fontSize="small" />
                          进行中
                        </Typography>
                      ) : (
                        <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HourglassEmpty sx={{ mr: 0.5 }} fontSize="small" />
                          等待中
                        </Typography>
                      )}
                      <Typography variant="caption">状态</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        {new Date(currentEval.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption">创建时间</Typography>
                    </Paper>
                  </Box>                  <Divider sx={{ my: 2 }} />

                  {/* Sample Data Preview */}
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DataIcon color="secondary" />
                    样本数据
                  </Typography>

                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List>                      <ListItem>
                        <ListItemText
                          primary="用户输入"
                          secondary={
                            (() => {
                              if (typeof currentEval.samples === 'object' && currentEval.samples) {
                                if ('user_input' in currentEval.samples) {                                  if (Array.isArray(currentEval.samples.user_input)) {
                                    // MultiTurn case - user_input is MultiTurnConversationItem[]
                                    return currentEval.samples.user_input
                                      .map((item) => `${item.type === 'human' ? '用户' : 'AI'}: ${item.content}`)
                                      .join(' | ');
                                  } else {
                                    // SingleTurn/Custom case - user_input is string
                                    return currentEval.samples.user_input;
                                  }
                                }
                              }
                              return 'N/A';
                            })()
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="系统回答"
                          secondary={
                            typeof currentEval.samples === 'object' && 'response' in currentEval.samples
                              ? currentEval.samples.response
                              : 'N/A'
                          }
                        />
                      </ListItem>
                      {typeof currentEval.samples === 'object' && 'retrieved_contexts' in currentEval.samples && currentEval.samples.retrieved_contexts && (
                        <ListItem>
                          <ListItemText
                            primary="检索上下文"
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                {currentEval.samples.retrieved_contexts.map((context: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={`上下文 ${index + 1}: ${context.substring(0, 50)}...`}
                                    sx={{ m: 0.5 }}
                                    size="small"
                                  />
                                ))}
                              </Box>
                            }
                          />
                        </ListItem>
                      )}
                      {typeof currentEval.samples === 'object' && 'reference' in currentEval.samples && currentEval.samples.reference && (
                        <ListItem>
                          <ListItemText
                            primary="参考答案"
                            secondary={currentEval.samples.reference}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Evaluation History Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MetricIcon color="primary" />
                  评估趋势分析
                </Typography>

                {evaluationHistory.length > 0 ? (
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      暂无历史评估数据
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: '33.33%' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  历史评估
                </Typography>

                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {evaluationHistory.map((item, index) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        border: 1,
                        borderColor: item.id === evaluationId ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => navigate(`/evaluation/rag/${taskId}/eval/${item.id}`)}
                    >
                      <ListItemText
                        primary={`评估 ${index + 1}`}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              得分: {item.result?.toFixed(3) || 'N/A'}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {new Date(item.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'completed' ? 'success' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>

                {evaluationHistory.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无评估记录
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RagEvaluationDetailPage;
