import type { ChartOptions } from 'chart.js';

/**
 * 基础图表配置
 * Basic chart configuration generator
 */
export const getBaseChartOptions = (title: string): ChartOptions<'line'> => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: title,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 10,
    },
  },
});

// Note: The specific chart data generation functions are in their dedicated files:
// - promptChartConfig.ts - for Prompt evaluation charts
// - ragChartConfig.ts - for RAG evaluation charts
