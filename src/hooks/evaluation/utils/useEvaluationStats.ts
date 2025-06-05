import { useMemo } from 'react';
import { useRagTasks } from '../queries/useRagQueries';
import { usePromptTasks } from '../queries/usePromptQueries';

export const useEvaluationStats = () => {
  // Use React Query hooks to leverage existing caching mechanisms
  const {
    data: ragTasksData,
    isLoading: ragLoading,
    error: ragError,
    refetch: refetchRagTasks,
  } = useRagTasks();

  const {
    data: promptTasksData,
    isLoading: promptLoading,
    error: promptError,
    refetch: refetchPromptTasks,
  } = usePromptTasks();

  // Calculate stats from React Query data
  const stats = useMemo(() => {
    const ragCount = ragTasksData?.tasks?.length || 0;
    const promptCount = promptTasksData?.tasks?.length || 0;
    const loading = ragLoading || promptLoading;
    const error = ragError || promptError
      ? 'Failed to load evaluation statistics'
      : null;

    return {
      ragCount,
      promptCount,
      loading,
      error,
    };
  }, [
    ragTasksData?.tasks?.length,
    promptTasksData?.tasks?.length,
    ragLoading,
    promptLoading,
    ragError,
    promptError,
  ]);

  // Combined refetch function
  const refetch = useMemo(() => async () => {
    await Promise.all([refetchRagTasks(), refetchPromptTasks()]);
  }, [refetchRagTasks, refetchPromptTasks]);

  return {
    ...stats,
    refetch,
  };
};
