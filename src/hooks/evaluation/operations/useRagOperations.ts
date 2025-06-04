import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RagFormData } from "../../../models/evaluation-form";
import type {
  CreateEvaluationDto,
  SingleTurnSample,
  CustomSample,
  MultiTurnSample,
  EvaluationStatusResponse,
} from "../../../models/rag-evaluation";
import { EvaluationService as RagEvaluationService } from "../../../services/eval/rag/evaluation.service";
import { TaskService as RagTaskService } from "../../../services/eval/rag/task.service";
import { ragQueryKeys } from "../queries/useRagQueries";

// Services instances (singleton pattern)
const ragTaskService = new RagTaskService();
const ragEvaluationService = new RagEvaluationService();

// Constants
const POLLING_INTERVAL = 3000; // 3 seconds

/**
 * RAG 相关操作的钩子
 * 负责 RAG 任务和评估的创建、更新等操作
 */
export const useRagOperations = () => {
  const queryClient = useQueryClient();

  // RAG Task Creation
  const createRagTaskMutation = useMutation({
    mutationFn: async (formData: RagFormData) => {
      const response = await ragTaskService.createTask({
        name: formData.taskName,
        description: formData.description,
      });
      return response.task.id;
    },
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.tasks() });
    },
  });

  // RAG Task Update
  const updateRagTaskMutation = useMutation({
    mutationFn: async ({ taskId, formData }: { taskId: string; formData: RagFormData }) => {
      await ragTaskService.updateTask(taskId, {
        name: formData.taskName,
        description: formData.description,
      });
    },
    onSuccess: (_, { taskId }) => {
      // Invalidate specific task and tasks list
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.task(taskId) });
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.tasks() });
    },
  });

  // RAG Evaluation Creation
  const createRagEvaluationMutation = useMutation({
    mutationFn: async ({ taskId, formData }: { taskId: string; formData: RagFormData }) => {
      if (!formData.samples || formData.samples.length === 0) {
        throw new Error("No samples provided for evaluation");
      }

      let evaluationData: CreateEvaluationDto;

      switch (formData.evaluationType) {
        case "single_turn":
          if (formData.metricId === undefined) {
            throw new Error("Metric ID is required for single_turn evaluation");
          }
          evaluationData = {
            eval_type: "single_turn",
            metric_id: formData.metricId,
            samples: formData.samples as SingleTurnSample[],
          };
          break;

        case "custom":
          if (!formData.customMetric || !formData.customPrompt) {
            throw new Error("Custom metric and prompt are required for custom evaluation");
          }
          evaluationData = {
            eval_type: "custom",
            eval_metric: formData.customMetric,
            custom_prompt: formData.customPrompt,
            samples: formData.samples as CustomSample[],
          };
          break;

        case "multi_turn":
          if (!formData.customMetric || !formData.customPrompt) {
            throw new Error("Custom metric and prompt are required for multi_turn evaluation");
          }
          evaluationData = {
            eval_type: "multi_turn",
            eval_metric: formData.customMetric,
            custom_prompt: formData.customPrompt,
            samples: formData.samples as MultiTurnSample[],
          };
          break;

        default:
          throw new Error(`Unsupported evaluation type: ${formData.evaluationType}`);
      }

      const response = await ragEvaluationService.createEvaluation(taskId, evaluationData);
      return response;
    },
    onSuccess: (_, { taskId }) => {
      // Invalidate evaluations list for this task
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.evaluations(taskId) });
    },
  });

  // RAG Task Deletion
  const deleteRagTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await ragTaskService.deleteTask(taskId);
    },
    onSuccess: () => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ragQueryKeys.tasks() });
    },
  });

  // Polling for RAG evaluation status
  const pollRagEvaluationStatus = useCallback(
    async (
      taskId: string,
      evaluationId: string,
      onProgress?: (status: EvaluationStatusResponse) => void
    ) => {
      try {
        let status = await ragEvaluationService.getEvaluationStatus(taskId, evaluationId);

        if (onProgress) {
          onProgress(status);
        }

        // Continue polling while the evaluation is not completed
        while (status.status === "pending" || status.status === "running") {
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
          status = await ragEvaluationService.getEvaluationStatus(taskId, evaluationId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === "completed" || status.status === "failed") {
            break;
          }
        }

        return status;
      } catch (error) {
        console.error("Failed to poll RAG evaluation status:", error);
        throw error;
      }
    },
    []
  );

  return {
    // Mutations
    createRagTask: createRagTaskMutation.mutateAsync,
    updateRagTask: updateRagTaskMutation.mutateAsync,
    createRagEvaluation: createRagEvaluationMutation.mutateAsync,
    deleteRagTask: deleteRagTaskMutation.mutateAsync,

    // Mutation states
    isCreatingTask: createRagTaskMutation.isPending,
    isUpdatingTask: updateRagTaskMutation.isPending,
    isCreatingEvaluation: createRagEvaluationMutation.isPending,
    isDeletingTask: deleteRagTaskMutation.isPending,

    // Utilities
    pollRagEvaluationStatus,
  };
};
