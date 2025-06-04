import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  usePromptTask,
  usePromptEvaluation,
  usePromptEvaluations,
  useCreatePromptEvaluation,
} from './usePromptQueries';

/**
 * Custom hook for managing prompt evaluation detail page logic
 */
export const usePromptDetailLogic = () => {
  const navigate = useNavigate();
  const { taskId, evaluationId } = useParams<{
    taskId: string;
    evaluationId?: string;
  }>();

  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");

  const taskIdNum = taskId ? parseInt(taskId) : 0;
  const evaluationIdNum = evaluationId ? parseInt(evaluationId) : 0;

  // Query hooks
  const {
    data: task,
    isLoading: taskLoading,
    error: taskError,
  } = usePromptTask(taskIdNum, !!taskId);

  const {
    data: evaluation,
    isLoading: evaluationLoading,
    error: evaluationError,
  } = usePromptEvaluation(
    taskIdNum,
    evaluationIdNum,
    !!taskId && !!evaluationId
  );

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = usePromptEvaluations(taskIdNum, !!taskId);

  // Mutation hooks
  const createEvaluationMutation = useCreatePromptEvaluation();

  const evaluationHistory = evaluationsData?.evaluations || [];

  // Handlers
  const handleCreateEvaluation = async () => {
    if (!taskId || !newPrompt.trim()) return;

    try {
      await createEvaluationMutation.mutateAsync({
        taskId: taskIdNum,
        evaluationData: { prompt: newPrompt.trim() },
      });
      setNewPrompt("");
      setShowNewEvaluationDialog(false);
      navigate(`/evaluation/prompt/${taskId}`);
    } catch (error) {
      console.error("Failed to create evaluation:", error);
    }
  };

  const handleBack = () => {
    navigate(`/evaluation/prompt/${taskId}`);
  };

  const handleEvaluationClick = (evalId: number) => {
    navigate(`/evaluation/prompt/${taskId}/${evalId}`);
  };

  // Computed states
  const isLoading = taskLoading || (evaluationId && evaluationLoading);
  const hasError = taskError || evaluationError || evaluationsError;

  return {
    // Data
    task,
    evaluation,
    evaluationHistory,
    taskId,
    evaluationId: evaluationIdNum,

    // Loading states
    isLoading,
    evaluationsLoading,
    hasError,

    // Dialog state
    showNewEvaluationDialog,
    setShowNewEvaluationDialog,
    newPrompt,
    setNewPrompt,

    // Handlers
    handleCreateEvaluation,
    handleBack,
    handleEvaluationClick,

    // Mutation state
    isCreatingEvaluation: createEvaluationMutation.isPending,
  };
};
