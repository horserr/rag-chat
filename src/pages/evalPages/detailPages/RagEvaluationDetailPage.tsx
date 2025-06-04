import React, { useMemo } from "react";
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
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Analytics as AnalyticsIcon,
  DataObject as DataIcon,
  Assessment as MetricIcon,
  CheckCircle,
  Error,
  HourglassEmpty,
  Sync,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  useRagTask,
  useRagEvaluation,
  useRagEvaluations,
} from "../../../hooks/evaluation/useRagQueries";
import type {
  EvaluationDetails,
  SingleTurnEvaluationDetails,
  CustomEvaluationDetails,
  MultiTurnEvaluationDetails,
  SingleTurnSample,
  CustomSample,
  MultiTurnSample
} from "../../../models/rag-evaluation";

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
  const { taskId = "", evaluationId = "" } = useParams<{
    taskId: string;
    evaluationId?: string;
  }>();

  // React Query hooks
  const {
    data: taskData,
    isLoading: taskLoading,
    error: taskError,
  } = useRagTask(taskId);

  const {
    data: evaluationData,
    isLoading: evaluationLoading,
    error: evaluationError,
  } = useRagEvaluation(taskId, evaluationId, !!evaluationId);

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = useRagEvaluations(taskId);

  // Extract data from queries
  const task = taskData?.task || null;
  const currentEval = evaluationData || null;

  // Memoize evaluation history to avoid dependency changes on every render
  const evaluationHistory = useMemo(() =>
    evaluationsData?.evaluations || [],
    [evaluationsData]
  );

  // Loading state
  const isLoading = taskLoading || evaluationLoading || evaluationsLoading;
  const hasError = taskError || evaluationError || evaluationsError;

  // Prepare chart data for evaluation history
  const chartData = useMemo(
    () => ({
      labels: evaluationHistory.map((_, index) => `评估 ${index + 1}`),
      datasets: [
        {
          label: "评估得分",
          data: evaluationHistory.map((evalItem) => evalItem.result || 0),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    }),
    [evaluationHistory]
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "评估历史趋势",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle color="success" />;
      case "failed":
        return <Error color="error" />;
      case "running":
        return <Sync className="animate-spin" color="primary" />;
      default:
        return <HourglassEmpty color="action" />;
    }
  };

  const getStatusColor = (
    status: string
  ): "success" | "error" | "primary" | "default" => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "error";
      case "running":
        return "primary";
      default:
        return "default";
    }
  };

  // Helper function to safely get metric name based on evaluation type
  const getMetricName = (eval_: EvaluationDetails | null): string => {
    if (!eval_) return '';

    switch (eval_.eval_type) {
      case "single_turn":
        return `Metric ID: ${(eval_ as SingleTurnEvaluationDetails).parameters.metric_id}`;
      case "custom":
        return (eval_ as CustomEvaluationDetails).parameters.eval_metric;
      case "multi_turn":
        return (eval_ as MultiTurnEvaluationDetails).parameters.eval_metric;
      default:
        return '';
    }
  };

  // Helper function to safely get evaluation result as a number
  const getEvaluationResult = (eval_: EvaluationDetails | null): number => {
    if (!eval_) return 0;

    if (eval_.eval_type === "multi_turn") {
      // For multi-turn evaluations, calculate average of coherence values
      const multiTurnEval = eval_ as MultiTurnEvaluationDetails;
      if (Array.isArray(multiTurnEval.result)) {
        const sum = multiTurnEval.result.reduce((acc, item) => acc + item.coherence, 0);
        return multiTurnEval.result.length > 0 ? sum / multiTurnEval.result.length : 0;
      }
      return 0;
    }

    return eval_.result || 0;
  };

  // Helper function to render sample content based on evaluation type
  const renderSampleContent = (eval_: EvaluationDetails | null) => {
    if (!eval_ || !eval_.samples) return null;

    switch (eval_.eval_type) {
      case "single_turn": {
        const samples = (eval_ as SingleTurnEvaluationDetails).samples as SingleTurnSample;
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                用户输入
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2">{samples.user_input}</Typography>
              </Paper>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                系统响应
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2">{samples.response}</Typography>
              </Paper>
            </Box>
          </>
        );
      }
      case "custom": {
        const samples = (eval_ as CustomEvaluationDetails).samples as CustomSample;
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                用户输入
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2">{samples.user_input}</Typography>
              </Paper>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                系统响应
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2">{samples.response}</Typography>
              </Paper>
            </Box>
          </>
        );
      }
      case "multi_turn": {
        const samples = (eval_ as MultiTurnEvaluationDetails).samples as MultiTurnSample;
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              对话内容
            </Typography>
            {Array.isArray(samples.user_input) && samples.user_input.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: item.type === "human" ? "grey.50" : "primary.light",
                  color: item.type === "human" ? "text.primary" : "white"
                }}
              >
                <Typography variant="body2">
                  {item.type === "human" ? "用户: " : "AI: "}
                  {item.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        );
      }
      default:
        return <Typography>No sample data available</Typography>;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load data: {(hasError as Error).message}
        </Alert>
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate(`/evaluation/rag/${taskId}`)}
        >
          返回任务
        </Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Task not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate(`/evaluation/rag/${taskId}`)}
          >
            返回
          </Button>
          <Typography variant="h4" fontWeight="bold">
            评估详情
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          任务: {task.name} | 评估ID: {evaluationId}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Left Panel - Current Evaluation Details */}
        <Box sx={{ flex: 1 }}>
          {currentEval ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <AnalyticsIcon color="primary" />
                  <Typography variant="h6">评估详情</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getStatusIcon(currentEval.status)}
                    <Chip
                      label={currentEval.status}
                      color={getStatusColor(currentEval.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    评估类型
                  </Typography>
                  <Typography variant="body1">
                    {currentEval.eval_type}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    评估指标
                  </Typography>
                  <Typography variant="body1">{getMetricName(currentEval)}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    评估结果
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {(getEvaluationResult(currentEval) * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    创建时间
                  </Typography>
                  <Typography variant="body1">
                    {new Date(currentEval.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Alert severity="info">未选择具体的评估记录</Alert>
              </CardContent>
            </Card>
          )}

          {/* Evaluation Data */}
          {currentEval && currentEval.samples && (
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <DataIcon color="primary" />
                  <Typography variant="h6">评估数据</Typography>
                </Box>

                {renderSampleContent(currentEval)}
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right Panel - Evaluation History */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <MetricIcon color="primary" />
                <Typography variant="h6">评估历史</Typography>
              </Box>

              {/* Chart */}
              {evaluationHistory.length > 0 && (
                <Box sx={{ mb: 3, height: 300 }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              )}

              {/* History List */}
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                历史记录
              </Typography>
              {evaluationsLoading ? (
                <Box>
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={60}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              ) : evaluationHistory.length > 0 ? (
                <List dense>
                  {evaluationHistory.map((evaluation) => (
                    <ListItem
                      key={evaluation.id}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                        bgcolor:
                          evaluation.id === evaluationId
                            ? "action.selected"
                            : "background.paper",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                      onClick={() =>
                        navigate(`/evaluation/rag/${taskId}/${evaluation.id}`)
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2">
                              评估 #{evaluation.id.slice(0, 8)}
                            </Typography>
                            <Chip
                              label={evaluation.status}
                              color={getStatusColor(evaluation.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              结果: {evaluation.result !== undefined ? (evaluation.result * 100).toFixed(1) : 'N/A'}% |
                              {new Date(
                                evaluation.created_at
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">暂无评估历史记录</Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default RagEvaluationDetailPage;
