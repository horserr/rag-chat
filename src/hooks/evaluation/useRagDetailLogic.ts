import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useRagTask,
  useRagEvaluation,
  useRagEvaluations,
} from './useRagQueries';
import type {
  EvaluationDetails,
  SingleTurnEvaluationDetails,
  CustomEvaluationDetails,
  MultiTurnEvaluationDetails,
} from '../../models/rag-evaluation';

/**
 * Custom hook for managing RAG evaluation detail page logic
 */
export const useRagDetailLogic = () => {
  const navigate = useNavigate();
  const { taskId = "", evaluationId = "" } = useParams<{
    taskId: string;
    evaluationId?: string;
  }>();

  // React Query hooks
  const {
    data: taskData,
    isLoading: taskLoading,
    error: taskError,
  } = useRagTask(taskId);

  const {
    data: evaluationData,
    isLoading: evaluationLoading,
    error: evaluationError,
  } = useRagEvaluation(taskId, evaluationId, !!evaluationId);

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = useRagEvaluations(taskId);

  // Extract data from queries
  const task = taskData?.task || null;
  const currentEval = evaluationData || null;

  // Memoize evaluation history to avoid dependency changes on every render
  const evaluationHistory = useMemo(() =>
    evaluationsData?.evaluations || [],
    [evaluationsData]
  );

  // Computed states
  const isLoading = taskLoading || evaluationLoading || evaluationsLoading;
  const hasError = taskError || evaluationError || evaluationsError;

  // Handlers
  const handleBack = () => {
    navigate(`/evaluation/rag/${taskId}`);
  };

  const handleEvaluationClick = (evalId: string) => {
    navigate(`/evaluation/rag/${taskId}/${evalId}`);
  };

  // Helper functions
  const getMetricName = (eval_: EvaluationDetails | null): string => {
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

  const getEvaluationResult = (eval_: EvaluationDetails | null): number => {
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

  return {
    // Data
    task,
    currentEval,
    evaluationHistory,
    taskId,
    evaluationId,

    // Loading states
    isLoading,
    evaluationsLoading,
    hasError,

    // Handlers
    handleBack,
    handleEvaluationClick,

    // Helper functions
    getMetricName,
    getEvaluationResult,
  };
};
