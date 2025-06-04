import type { ChartOptions } from 'chart.js';
import type { PromptEvaluation } from '../../../models/prompt-evaluation';

/**
 * Generate chart data for prompt evaluation trends
 */
export const generatePromptChartData = (evaluationHistory: PromptEvaluation[]) => {
  return {
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
};

/**
 * Chart options for prompt evaluation trends
 */
export const promptChartOptions: ChartOptions<'line'> = {
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
