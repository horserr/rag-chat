export interface EvaluationCardProps {
  id: string;
  title: string;
  date: string;
  type: "rag" | "prompt";
  metrics?: {
    name: string;
    value: number;
    status: "good" | "neutral" | "bad";
  }[];
  description?: string;
}

export interface FormData {
  title: string;
  description: string;
  dataset: string;
  metrics: string[];
  customMetric: string;
  threshold: number;
  enableRealTimeMonitoring: boolean;
}

export const animations = {
  hoverTransition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  cardTransform: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)", // Further optimized for snappier response
  underlineAnimation: "0.4s cubic-bezier(0.33, 1, 0.68, 1)",
  glowTransition:
    "background 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  diagonalLineAnimation: "0.45s cubic-bezier(0.16, 1, 0.3, 1)", // Adjusted timing for better visual harmony
  tagAnimation: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
};
