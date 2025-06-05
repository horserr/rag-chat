import type {
  EvaluationDetails,
  SingleTurnEvaluationDetails,
  CustomEvaluationDetails,
  MultiTurnEvaluationDetails,
} from "../../../models/rag-evaluation";

/**
 * 安全获取评估指标名称
 */
export const getMetricName = (eval_: EvaluationDetails | null): string => {
  if (!eval_) return '';

  switch (eval_.eval_type) {
    case "single_turn":
      return `Metric ID: ${(eval_ as SingleTurnEvaluationDetails).parameters.metric_id}`;
    case "custom":
      return (eval_ as CustomEvaluationDetails).parameters.eval_metric;
    case "multi_turn":
      return (eval_ as MultiTurnEvaluationDetails).parameters.eval_metric;
    default:
      return '';
  }
};

/**
 * 安全获取评估结果数值
 */
export const getEvaluationResult = (eval_: EvaluationDetails | null): number => {
  if (!eval_) return 0;

  if (eval_.eval_type === "multi_turn") {
    // For multi-turn evaluations, calculate average of coherence values
    const multiTurnEval = eval_ as MultiTurnEvaluationDetails;
    if (Array.isArray(multiTurnEval.result)) {
      const sum = multiTurnEval.result.reduce((acc, item) => acc + item.coherence, 0);
      return multiTurnEval.result.length > 0 ? sum / multiTurnEval.result.length : 0;
    }
    return 0;
  }

  return eval_.result || 0;
};
