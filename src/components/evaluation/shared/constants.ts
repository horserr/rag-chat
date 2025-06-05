// 评估页面的共享常量
export const EVALUATION_CONSTANTS = {
  ANIMATION: {
    DURATION: 0.3,
    HOVER_SCALE: 1.02,
    TAP_SCALE: 0.98,
  },
  LAYOUT: {
    PANEL_WIDTH_FULL: "100%",
    PANEL_WIDTH_HALF: "50%",
    DIALOG_MAX_WIDTH: "md" as const,
  },
  MOCK_LOADING_ITEMS: [1, 2, 3],
} as const;

export const CHART_COLORS = {
  PRIMARY: "rgb(75, 192, 192)",
  PRIMARY_BG: "rgba(75, 192, 192, 0.2)",
  SECONDARY: "rgb(255, 99, 132)",
  SECONDARY_BG: "rgba(255, 99, 132, 0.2)",
  TERTIARY: "rgb(54, 162, 235)",
  TERTIARY_BG: "rgba(54, 162, 235, 0.2)",
} as const;

export const EVALUATION_STATUS = {
  COMPLETED: "completed",
  FAILED: "failed",
  RUNNING: "running",
  PENDING: "pending",
} as const;

export type EvaluationStatus = (typeof EVALUATION_STATUS)[keyof typeof EVALUATION_STATUS];
