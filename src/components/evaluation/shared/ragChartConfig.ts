import type { ChartOptions } from 'chart.js';
import type { EvaluationListItem } from '../../../models/rag-evaluation';

/**
 * Generate chart data for RAG evaluation trends
 */
export const generateRagChartData = (evaluationHistory: EvaluationListItem[]) => {
  return {
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
  };
};

/**
 * Chart options for RAG evaluation trends
 */
export const ragChartOptions: ChartOptions<'line'> = {
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
