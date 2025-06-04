import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  CreateEvaluationDto,
  EvaluationDetails,
  EvaluationListItem,
  EvaluationListResponse,
  EvaluationStatusResponse,
  TaskListResponse,
  TaskResponse,
} from "../../models/rag-evaluation";
import { EvaluationService as RagEvaluationService } from "../../services/eval/rag/evaluation.service";
import { TaskService as RagTaskService } from "../../services/eval/rag/task.service";

// Query keys
export const ragQueryKeys = {
  all: ["rag"] as const,
  tasks: () => [...ragQueryKeys.all, "tasks"] as const,
  task: (taskId: string) => [...ragQueryKeys.all, "task", taskId] as const,
  evaluations: (taskId: string) =>
    [...ragQueryKeys.all, "evaluations", taskId] as const,
  evaluation: (taskId: string, evaluationId: string) =>
    [...ragQueryKeys.all, "evaluation", taskId, evaluationId] as const,
  evaluationStatus: (taskId: string, evaluationId: string) =>
    [...ragQueryKeys.all, "evaluation-status", taskId, evaluationId] as const,
} as const;

// Services instances (singleton pattern)
const ragTaskService = new RagTaskService();
const ragEvaluationService = new RagEvaluationService();

// Hook for fetching all RAG tasks
export const useRagTasks = () => {
  return useQuery({
    queryKey: ragQueryKeys.tasks(),
    queryFn: async (): Promise<TaskListResponse> => {
      return await ragTaskService.getTasks();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

// Hook for fetching a specific RAG task
export const useRagTask = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ragQueryKeys.task(taskId),
    queryFn: async (): Promise<TaskResponse> => {
      return await ragTaskService.getTaskById(taskId);
    },
    enabled: enabled && !!taskId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching evaluations for a specific task
export const useRagEvaluations = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ragQueryKeys.evaluations(taskId),
    queryFn: async (): Promise<EvaluationListResponse> => {
      return await ragEvaluationService.getEvaluations(taskId);
    },
    enabled: enabled && !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for evaluations as they change more frequently)
    gcTime: 5 * 60 * 1000,
    refetchInterval: (query) => {
      // Auto-refetch if there are pending or running evaluations
      const data = query.state.data;
      if (!data?.evaluations) return false;
      const hasPendingEvals = data.evaluations.some(
        (evaluation: EvaluationListItem) =>
          evaluation.status === "pending" || evaluation.status === "running"
      );
      return hasPendingEvals ? 5000 : false; // 5 seconds
    },
  });
};

// Hook for fetching a specific evaluation
export const useRagEvaluation = (
  taskId: string,
  evaluationId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ragQueryKeys.evaluation(taskId, evaluationId),
    queryFn: async (): Promise<EvaluationDetails> => {
      return await ragEvaluationService.getEvaluationDetails(
        taskId,
        evaluationId
      );
    },
    enabled: enabled && !!taskId && !!evaluationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for fetching evaluation status (for polling)
export const useRagEvaluationStatus = (
  taskId: string,
  evaluationId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ragQueryKeys.evaluationStatus(taskId, evaluationId),
    queryFn: async (): Promise<EvaluationStatusResponse> => {
      return await ragEvaluationService.getEvaluationStatus(
        taskId,
        evaluationId
      );
    },
    enabled: enabled && !!taskId && !!evaluationId,
    staleTime: 0, // Always fetch fresh for status
    gcTime: 1 * 60 * 1000,
    refetchInterval: (query) => {
      // Auto-refetch if evaluation is still pending or running
      const data = query.state.data;
      if (!data) return false;
      return data.status === "pending" || data.status === "running"
        ? 3000
        : false;
    },
  });
};

// Hook for prefetching data (for hover effects, etc.)
export const useRagPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchTask = useCallback(
    (taskId: string) => {
      queryClient.prefetchQuery({
        queryKey: ragQueryKeys.task(taskId),
        queryFn: () => ragTaskService.getTaskById(taskId),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchEvaluations = useCallback(
    (taskId: string) => {
      queryClient.prefetchQuery({
        queryKey: ragQueryKeys.evaluations(taskId),
        queryFn: () => ragEvaluationService.getEvaluations(taskId),
        staleTime: 2 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchEvaluation = useCallback(
    (taskId: string, evaluationId: string) => {
      queryClient.prefetchQuery({
        queryKey: ragQueryKeys.evaluation(taskId, evaluationId),
        queryFn: () =>
          ragEvaluationService.getEvaluationDetails(taskId, evaluationId),
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
export const useCreateRagEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      evaluationData,
    }: {
      taskId: string;
      evaluationData: CreateEvaluationDto;
    }) => {
      return await ragEvaluationService.createEvaluation(
        taskId,
        evaluationData
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate evaluations list to refresh it
      queryClient.invalidateQueries({
        queryKey: ragQueryKeys.evaluations(variables.taskId),
      });

      // Start polling the new evaluation status
      queryClient.invalidateQueries({
        queryKey: ragQueryKeys.evaluationStatus(variables.taskId, data.eval_id),
      });
    },
  });
};

// Hook for managing cache invalidation
export const useRagCacheManager = () => {
  const queryClient = useQueryClient();

  const invalidateAllRagData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ragQueryKeys.all });
  }, [queryClient]);

  const invalidateTaskData = useCallback(
    (taskId: string) => {
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.task(taskId) });
      queryClient.invalidateQueries({
        queryKey: ragQueryKeys.evaluations(taskId),
      });
    },
    [queryClient]
  );

  const invalidateEvaluationData = useCallback(
    (taskId: string, evaluationId: string) => {
      queryClient.invalidateQueries({
        queryKey: ragQueryKeys.evaluation(taskId, evaluationId),
      });
      queryClient.invalidateQueries({
        queryKey: ragQueryKeys.evaluationStatus(taskId, evaluationId),
      });
    },
    [queryClient]
  );

  const updateEvaluationCache = useCallback(
    (
      taskId: string,
      evaluationId: string,
      updateFn: (oldData: EvaluationDetails | undefined) => EvaluationDetails
    ) => {
      queryClient.setQueryData(
        ragQueryKeys.evaluation(taskId, evaluationId),
        updateFn
      );
    },
    [queryClient]
  );

  return {
    invalidateAllRagData,
    invalidateTaskData,
    invalidateEvaluationData,
    updateEvaluationCache,
  };
};
