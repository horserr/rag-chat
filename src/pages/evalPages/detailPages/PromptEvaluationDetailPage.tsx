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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import type {
  PromptEvaluationResponse,
  PromptTaskResponse,
} from "../../../models/prompt-evaluation";
import { EvaluationService as PromptEvaluationService } from "../../../services/eval/prompt/evaluation.service";
import { TaskService as PromptTaskService } from "../../../services/eval/prompt/task.service";

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

  const [task, setTask] = useState<PromptTaskResponse | null>(null);
  const [evaluation, setEvaluation] = useState<PromptEvaluationResponse | null>(
    null
  );
  const [evaluationHistory, setEvaluationHistory] = useState<
    PromptEvaluationResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promptTaskService = useMemo(() => new PromptTaskService(), []);
  const promptEvaluationService = useMemo(
    () => new PromptEvaluationService(),
    []
  );

  // Load task details
  const loadTask = useCallback(async () => {
    if (!taskId) return;

    try {
      const response = await promptTaskService.getTaskById(parseInt(taskId));
      setTask(response);
    } catch (err) {
      console.error("Error loading task:", err);
      setError("Failed to load task details");
    }
  }, [taskId, promptTaskService]);

  // Load evaluation details
  const loadEvaluation = useCallback(async () => {
    if (!taskId || !evaluationId) return;

    try {
      const response = await promptEvaluationService.getEvaluationById(
        parseInt(taskId),
        parseInt(evaluationId)
      );
      setEvaluation(response);
    } catch (err) {
      console.error("Error loading evaluation:", err);
      setError("Failed to load evaluation details");
    }
  }, [taskId, evaluationId, promptEvaluationService]);

  // Load evaluation history
  const loadEvaluationHistory = useCallback(async () => {
    if (!taskId) return;

    try {
      const response = await promptTaskService.getTaskEvaluations(
        parseInt(taskId)
      );
      if ("detail" in response) {
        setEvaluationHistory([]);
      } else {
        setEvaluationHistory(response as unknown as PromptEvaluationResponse[]);
      }
    } catch (err) {
      console.error("Error loading evaluation history:", err);
      setEvaluationHistory([]);
    }
  }, [taskId, promptTaskService]);

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

  // Handle new evaluation
  const handleNewEvaluation = async () => {
    if (!taskId || !newPrompt.trim()) return;

    setIsSubmitting(true);
    try {
      await promptEvaluationService.createEvaluation(parseInt(taskId), {
        prompt: newPrompt.trim(),
      });

      // Close dialog and refresh evaluations
      setShowNewEvaluationDialog(false);
      setNewPrompt("");
      loadEvaluationHistory();
    } catch (err) {
      console.error("Error creating evaluation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare chart data for evaluation history
  const prepareChartData = () => {
    const labels = evaluationHistory.map((_, index) => `评估 ${index + 1}`);

    return {
      labels,
      datasets: [
        {
          label: "Prompt 评分",
          data: evaluationHistory.map((evaluation) =>
            parseInt(evaluation.promptScore)
          ),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.1,
        },
        {
          label: "BLEU4 分数",
          data: evaluationHistory.map((evaluation) => evaluation.bleu4Score),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.1,
        },
        {
          label: "语义相似度",
          data: evaluationHistory.map(
            (evaluation) => evaluation.semanticSimilarity
          ),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
        {
          label: "词汇多样性",
          data: evaluationHistory.map(
            (evaluation) => evaluation.lexicalDiversity
          ),
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Prompt 评估趋势",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const handleBack = () => {
    navigate('/evaluation/prompt');
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 4) return "success";
    if (numScore >= 3) return "warning";
    return "error";
  };
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "400px" }, flexShrink: 0 }}>
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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button startIcon={<BackIcon />} onClick={handleBack}>
            返回
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {task?.taskName || "Prompt 评估详情"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          任务 ID: {taskId} {evaluationId && `| 评估 ID: ${evaluationId}`}
        </Typography>
      </Box>{" "}
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            {/* Current Evaluation Details */}
            {evaluation && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  {" "}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AnalyticsIcon color="secondary" />
                    评估结果
                  </Typography>
                  {/* Metrics Grid using CSS Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(4, 1fr)",
                      },
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h4" color="secondary">
                        {evaluation.promptScore}
                      </Typography>
                      <Typography variant="caption">Prompt 评分</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        {evaluation.bleu4Score.toFixed(3)}
                      </Typography>
                      <Typography variant="caption">BLEU4</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        {evaluation.semanticSimilarity.toFixed(3)}
                      </Typography>
                      <Typography variant="caption">语义相似度</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        {evaluation.lexicalDiversity.toFixed(3)}
                      </Typography>
                      <Typography variant="caption">词汇多样性</Typography>
                    </Paper>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  {/* Prompt Details */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PromptIcon color="secondary" />
                    Prompt 内容
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        原始 Prompt:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, whiteSpace: "pre-wrap" }}
                      >
                        {evaluation.prompt}
                      </Typography>

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        优化建议:
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {evaluation.modificationReason}
                      </Typography>

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        优化后 Prompt:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {evaluation.modifiedPrompt}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`编辑距离: ${evaluation.editDistance.toFixed(3)}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`ROUGE-L: ${evaluation.rougeLScore.toFixed(3)}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`实体 F1: ${evaluation.entityF1.toFixed(3)}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Evaluation History Chart */}
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <TrendIcon color="secondary" />
                    评估趋势分析
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewEvaluationDialog(true)}
                    size="small"
                  >
                    新增评估
                  </Button>
                </Box>

                {evaluationHistory.length > 0 ? (
                  <Box sx={{ height: 300 }}>
                    <Line data={prepareChartData()} options={chartOptions} />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      暂无历史评估数据
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => setShowNewEvaluationDialog(true)}
                    >
                      创建首个评估
                    </Button>
                  </Box>
                )}
              </CardContent>{" "}
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", md: "400px" }, flexShrink: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  历史评估
                </Typography>
                <List sx={{ maxHeight: 400, overflow: "auto" }}>
                  {" "}
                  {evaluationHistory.map((evaluation, index) => (
                    <ListItem
                      key={evaluation.evalId}
                      sx={{
                        border: 1,
                        borderColor:
                          evaluation.evalId.toString() === evaluationId
                            ? "secondary.main"
                            : "divider",
                        borderRadius: 1,
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/evaluation/prompt/${taskId}/eval/${evaluation.evalId}`
                        )
                      }
                    >
                      <ListItemText
                        primary={`评估 ${index + 1}`}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              评分: {evaluation.promptScore}
                            </Typography>
                            <Typography variant="caption" display="block">
                              BLEU4: {evaluation.bleu4Score.toFixed(3)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={evaluation.promptScore}
                        size="small"
                        color={getScoreColor(evaluation.promptScore)}
                      />
                    </ListItem>
                  ))}
                </List>
                {evaluationHistory.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无评估记录
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      sx={{ mt: 1 }}
                      size="small"
                      onClick={() => setShowNewEvaluationDialog(true)}
                    >
                      创建评估
                    </Button>
                  </Box>
                )}{" "}
              </CardContent>
            </Card>
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
            rows={6}
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
            提示: 评估将分析 Prompt 的质量、清晰度和效果等多个维度
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewEvaluationDialog(false)}>
            取消
          </Button>
          <Button
            onClick={handleNewEvaluation}
            variant="contained"
            disabled={!newPrompt.trim() || isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : "开始评估"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromptEvaluationDetailPage;
