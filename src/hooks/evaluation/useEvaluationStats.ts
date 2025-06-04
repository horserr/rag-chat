import { useEffect, useState, useCallback, useMemo } from 'react';
import { TaskService as RagTaskService } from '../../services/eval/rag/task.service';
import { TaskService as PromptTaskService } from '../../services/eval/prompt/task.service';

interface EvaluationStats {
  ragCount: number;
  promptCount: number;
  loading: boolean;
  error: string | null;
}

export const useEvaluationStats = () => {
  const [stats, setStats] = useState<EvaluationStats>({
    ragCount: 0,
    promptCount: 0,
    loading: true,
    error: null,
  });

  const ragTaskService = useMemo(() => new RagTaskService(), []);
  const promptTaskService = useMemo(() => new PromptTaskService(), []);

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Get RAG tasks count
      const ragTasks = await ragTaskService.getTasks();
      const ragCount = ragTasks.tasks?.length || 0;

      // Get Prompt tasks count
      const promptTasks = await promptTaskService.getAllTasks();
      const promptCount = promptTasks?.length || 0;

      setStats({
        ragCount,
        promptCount,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch evaluation stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load evaluation statistics',
      }));
    }
  }, [ragTaskService, promptTaskService]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...stats,
    refetch: fetchStats,
  };
};
