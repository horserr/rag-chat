import {
  CheckCircle,
  Error,
  HourglassEmpty,
  Sync,
} from "@mui/icons-material";
import { EVALUATION_STATUS } from "./constants";

/**
 * 获取评估状态对应的图标
 */
export const getStatusIcon = (status: string) => {
  switch (status) {
    case EVALUATION_STATUS.COMPLETED:
      return <CheckCircle color="success" />;
    case EVALUATION_STATUS.FAILED:
      return <Error color="error" />;
    case EVALUATION_STATUS.RUNNING:
      return <Sync className="animate-spin" color="primary" />;
    default:
      return <HourglassEmpty color="action" />;
  }
};

/**
 * 获取评估状态对应的颜色
 */
export const getStatusColor = (
  status: string
): "success" | "error" | "primary" | "warning" | "default" => {
  switch (status) {
    case EVALUATION_STATUS.COMPLETED:
      return "success";
    case EVALUATION_STATUS.FAILED:
      return "error";
    case EVALUATION_STATUS.RUNNING:
      return "primary";
    case EVALUATION_STATUS.PENDING:
      return "warning";
    default:
      return "default";
  }
};

/**
 * 获取评分对应的颜色（用于Prompt评估）
 */
export const getScoreColor = (score: string | number): "success" | "warning" | "error" => {
  const numScore = typeof score === "string" ? parseFloat(score) : score;
  if (numScore >= 4) return "success";
  if (numScore >= 3) return "warning";
  return "error";
};
