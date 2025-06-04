import {
  Add as AddIcon,
  ArrowBack as BackIcon,
  TextFields as PromptIcon,
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
import React from "react";
import { Line } from "react-chartjs-2";
import { usePromptDetailLogic } from "../../../hooks/evaluation";
import {
  MetricChips,
  EvaluationHistoryList,
  PromptDisplay,
  ResponseDisplay,
  generatePromptChartData,
  promptChartOptions,
  getScoreColor
} from "../../../components/evaluation/shared";

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
  const {
    task,
    evaluation,
    evaluationHistory,
    taskId,
    evaluationId,
    isLoading,
    evaluationsLoading,
    hasError,
    showNewEvaluationDialog,
    setShowNewEvaluationDialog,
    newPrompt,
    setNewPrompt,
    handleCreateEvaluation,
    handleBack,
    handleEvaluationClick,
    isCreatingEvaluation,
  } = usePromptDetailLogic();  // Chart data preparation
  const chartData = generatePromptChartData(evaluationHistory);

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
                  </Box>                  <PromptDisplay prompt={evaluation.prompt} /><Typography variant="h6" gutterBottom>
                    评估指标:
                  </Typography>
                  <MetricChips evaluation={evaluation} />                  {evaluation.groundTruthResponse && (
                    <ResponseDisplay
                      title="标准答案:"
                      response={evaluation.groundTruthResponse}
                    />
                  )}

                  {evaluation.response && (
                    <ResponseDisplay
                      title="模型回答:"
                      response={evaluation.response}
                    />
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
                </Typography>                <EvaluationHistoryList
                  evaluationHistory={evaluationHistory}
                  isLoading={evaluationsLoading}
                  currentEvaluationId={evaluation?.evalId}
                  onEvaluationClick={handleEvaluationClick}
                  maxItems={5}
                />
              </CardContent>
            </Card>

            {/* Analytics Chart */}
            {evaluationHistory.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    性能趋势
                  </Typography>                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={promptChartOptions} />
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
            variant="contained"            disabled={!newPrompt.trim() || isCreatingEvaluation}
          >
            {isCreatingEvaluation ? (
              <CircularProgress size={20} />
            ) : (
              "开始评估"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>  );
};

export default PromptEvaluationDetailPage;
