import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  ArrowBack as BackIcon,
  TextFields as PromptIcon,
  TrendingUp as TrendIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import {
  usePromptTask,
  usePromptEvaluation,
  usePromptEvaluations,
  useCreatePromptEvaluation,
} from "../../../hooks/evaluation/usePromptQueries";
import type { PromptEvaluation } from "../../../models/prompt-evaluation";

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

const PromptEvaluationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId, evaluationId } = useParams<{
    taskId: string;
    evaluationId?: string;
  }>();

  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");

  const taskIdNum = taskId ? parseInt(taskId) : 0;
  const evaluationIdNum = evaluationId ? parseInt(evaluationId) : 0;

  // Query hooks
  const {
    data: task,
    isLoading: taskLoading,
    error: taskError,
  } = usePromptTask(taskIdNum, !!taskId);

  const {
    data: evaluation,
    isLoading: evaluationLoading,
    error: evaluationError,
  } = usePromptEvaluation(
    taskIdNum,
    evaluationIdNum,
    !!taskId && !!evaluationId
  );

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = usePromptEvaluations(taskIdNum, !!taskId);

  // Mutation hooks
  const createEvaluationMutation = useCreatePromptEvaluation();

  const evaluationHistory = evaluationsData?.evaluations || [];

  const handleCreateEvaluation = async () => {
    if (!taskId || !newPrompt.trim()) return;

    try {
      await createEvaluationMutation.mutateAsync({
        taskId: taskIdNum,
        evaluationData: { prompt: newPrompt.trim() },
      });
      setNewPrompt("");
      setShowNewEvaluationDialog(false);
      navigate(`/evaluation/prompt/${taskId}`);
    } catch (error) {
      console.error("Failed to create evaluation:", error);
    }
  };

  const handleBack = () => {
    navigate(`/evaluation/prompt/${taskId}`);
  };
  const getScoreColor = (score: string | number) => {
    const numScore = typeof score === "string" ? parseFloat(score) : score;
    if (numScore >= 4) return "success";
    if (numScore >= 3) return "warning";
    return "error";
  }; // Chart data preparation
  const chartData = {
    labels: evaluationHistory.map(
      (_: PromptEvaluation, index: number) => `评估 ${index + 1}`
    ),
    datasets: [
      {
        label: "Prompt 评分",
        data: evaluationHistory.map((evalItem: PromptEvaluation) =>
          parseInt(evalItem.promptScore)
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "BLEU4 分数",
        data: evaluationHistory.map(
          (evalItem: PromptEvaluation) => evalItem.bleu4Score * 10
        ), // Scale for visibility
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
      {
        label: "语义相似度",
        data: evaluationHistory.map(
          (evalItem: PromptEvaluation) => evalItem.semanticSimilarity * 10
        ),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "评估指标趋势",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const isLoading = taskLoading || (evaluationId && evaluationLoading);
  const hasError = taskError || evaluationError || evaluationsError;

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" sx={{ fontSize: "2rem", mt: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Skeleton variant="rectangular" width="50%" height={300} />
          <Skeleton variant="rectangular" width="50%" height={300} />
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
        <Button variant="contained" onClick={handleBack}>
          返回
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            返回
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {task?.taskName || `任务 #${taskId}`}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {evaluation ? `评估详情 #${evaluationId}` : "Prompt 评估任务详细信息"}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
          {/* Left Panel - Evaluation Details */}
          <Box sx={{ flex: 1 }}>
            {evaluation ? (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PromptIcon color="primary" />
                      <Typography variant="h6">评估 #{evaluationId}</Typography>
                    </Box>
                    <Chip
                      label={`评分: ${evaluation.promptScore}`}
                      color={
                        getScoreColor(evaluation.promptScore) as
                          | "success"
                          | "warning"
                          | "error"
                      }
                      size="medium"
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Prompt 内容:
                  </Typography>
                  <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {evaluation.prompt}
                    </Typography>
                  </Paper>

                  <Typography variant="h6" gutterBottom>
                    评估指标:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}
                  >
                    <Chip
                      icon={<AnalyticsIcon />}
                      label={`BLEU4: ${evaluation.bleu4Score.toFixed(4)}`}
                      variant="outlined"
                    />
                    <Chip
                      icon={<TrendIcon />}
                      label={`语义相似度: ${evaluation.semanticSimilarity.toFixed(
                        4
                      )}`}
                      variant="outlined"
                    />
                    <Chip
                      icon={<AnalyticsIcon />}
                      label={`词汇多样性: ${evaluation.lexicalDiversity.toFixed(
                        4
                      )}`}
                      variant="outlined"
                    />
                  </Box>

                  {evaluation.groundTruthResponse && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        标准答案:
                      </Typography>
                      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {evaluation.groundTruthResponse}
                        </Typography>
                      </Paper>
                    </>
                  )}

                  {evaluation.response && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        模型回答:
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {evaluation.response}
                        </Typography>
                      </Paper>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    任务信息
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="任务ID"
                        secondary={task?.taskId || taskId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="任务名称"
                        secondary={task?.taskName || "未知"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="评估总数"
                        secondary={evaluationHistory.length}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewEvaluationDialog(true)}
                    fullWidth
                  >
                    新增 Prompt 评估
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Right Panel - Evaluation History & Analytics */}
          <Box sx={{ flex: 1 }}>
            {/* Evaluation History */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  评估历史
                </Typography>
                {evaluationsLoading ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} variant="rectangular" height={60} />
                    ))}
                  </Box>
                ) : evaluationHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    暂无评估记录
                  </Typography>
                ) : (
                  <List>
                    {evaluationHistory
                      .slice(0, 5)
                      .map((evalItem: PromptEvaluation) => (
                        <ListItem
                          key={evalItem.evalId}
                          sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            mb: 1,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                            bgcolor:
                              evaluation?.evalId === evalItem.evalId
                                ? "action.selected"
                                : "inherit",
                          }}
                          onClick={() =>
                            navigate(
                              `/evaluation/prompt/${taskId}/${evalItem.evalId}`
                            )
                          }
                        >
                          <ListItemText
                            primary={`评估 #${evalItem.evalId}`}
                            secondary={
                              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Chip
                                  label={evalItem.promptScore}
                                  size="small"
                                  color={
                                    getScoreColor(evalItem.promptScore) as
                                      | "success"
                                      | "warning"
                                      | "error"
                                  }
                                />
                                <Chip
                                  label={`BLEU4: ${evalItem.bleu4Score.toFixed(
                                    3
                                  )}`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Analytics Chart */}
            {evaluationHistory.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    性能趋势
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
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
            rows={8}
            fullWidth
            variant="outlined"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="请输入要评估的 Prompt..."
            sx={{ mt: 2 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            提示: 新的评估将会与现有评估进行对比分析
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
            {createEvaluationMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "开始评估"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromptEvaluationDetailPage;
