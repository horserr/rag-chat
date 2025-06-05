import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRagTasks,
  useRagEvaluations,
  useRagPrefetch,
  useRagCacheManager,
} from "../queries/useRagQueries";

interface UseRagOverviewLogicOptions {
  detailRoute: string;
}

/**
 * Hook for managing RAG evaluation overview page logic
 */
export function useRagOverviewLogic({
  detailRoute,
}: UseRagOverviewLogicOptions) {
  // Navigation and routing
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Parse path to determine if we're in detail view
  const isDetailView = selectedTask !== null;

  // Query hooks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useRagTasks();

  const {
    data: evaluationsData,
    isLoading: evaluationsLoading,
    error: evaluationsError,
  } = useRagEvaluations(selectedTask || "", !!selectedTask);

  // Prefetch hooks
  const { prefetchTask, prefetchEvaluations } = useRagPrefetch();
  const { invalidateTaskData } = useRagCacheManager();

  // Derived data
  const tasks = tasksData?.tasks || [];
  const evaluations = evaluationsData?.evaluations || [];

  // Event handlers
  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const handleTaskHover = (taskId: string) => {
    prefetchTask(taskId);
    prefetchEvaluations(taskId);
  };
  const handleViewDetails = (evaluationId: string) => {
    if (selectedTask) {
      navigate(`${detailRoute}/${selectedTask}/eval/${evaluationId}`);
    }
  };

  const handleNavigateToEvaluation = () => {
    navigate("/evaluation/rag/create");
  };

  const handleRefresh = () => {
    refetchTasks();
    if (selectedTask) {
      invalidateTaskData(selectedTask);
    }
  };
  return {
    selectedTask,
    setSelectedTask,
    tasks,
    evaluations,
    showDetailDialog,
    setShowDetailDialog,
    tasksLoading,
    tasksError,
    evaluationsLoading,
    evaluationsError,
    isDetailView,
    handleTaskSelect,
    handleTaskHover,
    handleViewDetails,
    handleNavigateToEvaluation,
    handleRefresh,
  };
}
