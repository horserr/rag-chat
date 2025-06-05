import {
  CheckCircle as CompletedIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  PlayArrow as StartIcon,
} from "@mui/icons-material";

/**
 * Get the appropriate icon for a given evaluation status
 * @param status The evaluation status
 * @returns React element with the appropriate icon
 */
export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CompletedIcon color="success" />;
    case "failed":
      return <ErrorIcon color="error" />;
    case "running":
      return <StartIcon color="primary" />;
    case "pending":
      return <PendingIcon color="warning" />;
    default:
      return <PendingIcon color="action" />;
  }
};

/**
 * Get the appropriate color for a given evaluation status
 * @param status The evaluation status
 * @returns MUI color string for the status
 */
export const getStatusColor = (
  status: string
): "success" | "error" | "primary" | "warning" | "default" => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "running":
      return "primary";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

/**
 * Evaluation status types
 */
export type EvaluationStatus = "completed" | "failed" | "running" | "pending";

/**
 * Evaluation data structure
 */
export interface EvaluationData {
  id: string | number;
  name?: string;
  status: EvaluationStatus | string;
  eval_type?: string;
  metric?: string;
  result?: number;
  created_at?: string;
}
