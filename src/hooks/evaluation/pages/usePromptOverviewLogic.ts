import { useState } from "react";
import {
  usePromptTasks,
  usePromptEvaluations,
  usePromptPrefetch,
  usePromptCacheManager,
  useCreatePromptEvaluation,
} from "../queries/usePromptQueries";
import { useOverviewPage } from "./useOverviewPage";

/**
 * Prompt评估Overview页面的业务逻辑hook
 */
export const usePromptOverviewLogic = () => {
  const [newPrompt, setNewPrompt] = useState("");
  const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState(false);

  const overviewLogic = useOverviewPage<number>({
    baseRoute: "/evaluation/prompt",
    detailRoute: "/evaluation/prompt",
  });

  // Query hooks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = usePromptTasks();

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = usePromptEvaluations(overviewLogic.selectedTask || 0, !!overviewLogic.selectedTask);

  // Prefetch hooks
  const { prefetchTask, prefetchEvaluations } = usePromptPrefetch();
  const { invalidateTaskData } = usePromptCacheManager();

  // Mutation hooks
  const createEvaluationMutation = useCreatePromptEvaluation();

  const tasks = tasksData?.tasks || [];
  const evaluations = evaluationsData?.evaluations || [];

  const handleTaskHover = (taskId: number) => {
    prefetchTask(taskId);
    prefetchEvaluations(taskId);
  };

  const handleRefresh = () => {
    refetchTasks();
    if (overviewLogic.selectedTask) {
      invalidateTaskData(overviewLogic.selectedTask);
    }
  };

  const handleCreateEvaluation = async () => {
    if (!overviewLogic.selectedTask || !newPrompt.trim()) return;

    try {
      await createEvaluationMutation.mutateAsync({
        taskId: overviewLogic.selectedTask,
        evaluationData: { prompt: newPrompt.trim() },
      });
      setNewPrompt("");
      setShowNewEvaluationDialog(false);
    } catch (error) {
      console.error("Failed to create evaluation:", error);
    }
  };

  return {
    ...overviewLogic,
    newPrompt,
    setNewPrompt,
    showNewEvaluationDialog,
    setShowNewEvaluationDialog,
    tasks,
    evaluations,
    tasksLoading,
    tasksError,
    evaluationsLoading,
    evaluationsError,
    createEvaluationMutation,
    handleTaskHover,
    handleRefresh,
    handleCreateEvaluation,
  };
};
