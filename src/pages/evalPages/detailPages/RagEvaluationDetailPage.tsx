import {
  Analytics as AnalyticsIcon,
  ArrowBack as BackIcon,
  DataObject as DataIcon,
  Assessment as MetricIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  RagEvaluationHistoryList,
  RagSampleContent,
  generateRagChartData,
  getStatusColor,
  getStatusIcon,
  ragChartOptions,
} from "../../../components/evaluation/shared";
import { useRagDetailLogic } from "../../../hooks/evaluation";

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
  const {
    task,
    currentEval,
    evaluationHistory,
    evaluationId,
    isLoading,
    evaluationsLoading,
    hasError,
    handleBack,
    handleEvaluationClick,
    getMetricName,
    getEvaluationResult,
  } = useRagDetailLogic();

  // Prepare chart data for evaluation history
  const chartData = generateRagChartData(evaluationHistory);

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
        </Alert>{" "}
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={handleBack}
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
          {" "}
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Evaluation Detail
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          task: {task.name} | taskID: {evaluationId}
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
                  <Typography variant="h6">评估详情</Typography>{" "}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {React.createElement(getStatusIcon(currentEval.status))}
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
                  <Typography variant="body1">
                    {getMetricName(currentEval)}
                  </Typography>
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

                <RagSampleContent evaluation={currentEval} />
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
                  <Line data={chartData} options={ragChartOptions} />
                </Box>
              )}
              {/* History List */}
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                历史记录
              </Typography>{" "}
              <RagEvaluationHistoryList
                evaluationHistory={evaluationHistory}
                isLoading={evaluationsLoading}
                currentEvaluationId={evaluationId}
                onEvaluationClick={handleEvaluationClick}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default RagEvaluationDetailPage;
