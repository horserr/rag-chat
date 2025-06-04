import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { EvaluationService as PromptEvaluationService } from '../../services/eval/prompt/evaluation.service';
import { TaskService as PromptTaskService } from '../../services/eval/prompt/task.service';
import type {
  PromptTaskListResponse as TaskListResponse,
  PromptTaskResponse as TaskResponse,
  PromptEvaluation,
  PromptEvaluationListResponse as EvaluationListResponse,
  CreatePromptEvaluationDto as CreateEvaluationDto,
} from '../../models/prompt-evaluation';

// Query keys
export const promptQueryKeys = {
  all: ['prompt'] as const,
  tasks: () => [...promptQueryKeys.all, 'tasks'] as const,
  task: (taskId: number) => [...promptQueryKeys.all, 'task', taskId] as const,
  evaluations: (taskId: number) => [...promptQueryKeys.all, 'evaluations', taskId] as const,
  evaluation: (taskId: number, evaluationId: number) => [
    ...promptQueryKeys.all,
    'evaluation',
    taskId,
    evaluationId,
  ] as const,
} as const;

// Services instances (singleton pattern)
const promptTaskService = new PromptTaskService();
const promptEvaluationService = new PromptEvaluationService();

// Hook for fetching all Prompt tasks
export const usePromptTasks = () => {
  return useQuery({
    queryKey: promptQueryKeys.tasks(),
    queryFn: async (): Promise<TaskListResponse> => {
      const tasks = await promptTaskService.getAllTasks();
      return { tasks } as TaskListResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a specific Prompt task
export const usePromptTask = (taskId: number, enabled = true) => {
  return useQuery({
    queryKey: promptQueryKeys.task(taskId),
    queryFn: async (): Promise<TaskResponse> => {
      return await promptTaskService.getTaskById(taskId);
    },
    enabled: enabled && !!taskId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching evaluations for a specific task
export const usePromptEvaluations = (taskId: number, enabled = true) => {
  return useQuery({
    queryKey: promptQueryKeys.evaluations(taskId),
    queryFn: async (): Promise<EvaluationListResponse> => {
      const result = await promptTaskService.getTaskEvaluations(taskId);
      // Check if result is an error response or an array
      if ('detail' in result) {
        return { evaluations: [] }; // Return empty evaluations if error
      } else if (Array.isArray(result)) {
        return { evaluations: result };
      } else {
        return result as EvaluationListResponse; // If it's already in the right format
      }
    },
    enabled: enabled && !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for fetching a specific evaluation
export const usePromptEvaluation = (
  taskId: number,
  evaluationId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: promptQueryKeys.evaluation(taskId, evaluationId),
    queryFn: async (): Promise<PromptEvaluation> => {
      return await promptEvaluationService.getEvaluationById(taskId, evaluationId);
    },
    enabled: enabled && !!taskId && !!evaluationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for prefetching data (for hover effects, etc.)
export const usePromptPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchTask = useCallback(
    (taskId: number) => {
      queryClient.prefetchQuery({
        queryKey: promptQueryKeys.task(taskId),
        queryFn: () => promptTaskService.getTaskById(taskId),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchEvaluations = useCallback(
    (taskId: number) => {
      queryClient.prefetchQuery({
        queryKey: promptQueryKeys.evaluations(taskId),
        queryFn: async () => {
          const result = await promptTaskService.getTaskEvaluations(taskId);
          if ('detail' in result) {
            return { evaluations: [] };
          } else if (Array.isArray(result)) {
            return { evaluations: result };
          } else {
            return result as EvaluationListResponse;
          }
        },
        staleTime: 2 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchEvaluation = useCallback(
    (taskId: number, evaluationId: number) => {
      queryClient.prefetchQuery({
        queryKey: promptQueryKeys.evaluation(taskId, evaluationId),
        queryFn: () => promptEvaluationService.getEvaluationById(taskId, evaluationId),
        staleTime: 1 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return {
    prefetchTask,
    prefetchEvaluations,
    prefetchEvaluation,
  };
};

// Mutation hooks for creating/updating evaluations
export const useCreatePromptEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      evaluationData,
    }: {
      taskId: number;
      evaluationData: CreateEvaluationDto;
    }) => {
      return await promptEvaluationService.createEvaluation(taskId, evaluationData);
    },
    onSuccess: (_data, variables) => {
      // Invalidate evaluations list to refresh it
      queryClient.invalidateQueries({
        queryKey: promptQueryKeys.evaluations(variables.taskId),
      });
    },
  });
};

// Hook for managing cache invalidation
export const usePromptCacheManager = () => {
  const queryClient = useQueryClient();

  const invalidateAllPromptData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: promptQueryKeys.all });
  }, [queryClient]);

  const invalidateTaskData = useCallback((taskId: number) => {
    queryClient.invalidateQueries({ queryKey: promptQueryKeys.task(taskId) });
    queryClient.invalidateQueries({ queryKey: promptQueryKeys.evaluations(taskId) });
  }, [queryClient]);

  const invalidateEvaluationData = useCallback((taskId: number, evaluationId: number) => {
    queryClient.invalidateQueries({
      queryKey: promptQueryKeys.evaluation(taskId, evaluationId)
    });
  }, [queryClient]);

  return {
    invalidateAllPromptData,
    invalidateTaskData,
    invalidateEvaluationData,
  };
};
