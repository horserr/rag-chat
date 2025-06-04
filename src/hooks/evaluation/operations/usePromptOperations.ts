import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PromptFormData } from "../../../models/evaluation-form";
import type { CreatePromptEvaluationDto } from "../../../models/prompt-evaluation";
import { EvaluationService as PromptEvaluationService } from "../../../services/eval/prompt/evaluation.service";
import { TaskService as PromptTaskService } from "../../../services/eval/prompt/task.service";
import { promptQueryKeys } from "../queries/usePromptQueries";

// Services instances (singleton pattern)
const promptTaskService = new PromptTaskService();
const promptEvaluationService = new PromptEvaluationService();

/**
 * Prompt 相关操作的钩子
 * 负责 Prompt 任务和评估的创建、更新等操作
 */
export const usePromptOperations = () => {
  const queryClient = useQueryClient();

  // Prompt Task Creation
  const createPromptTaskMutation = useMutation({
    mutationFn: async (formData: PromptFormData) => {
      await promptTaskService.createTask({
        taskName: formData.taskName,
      });

      // Get the latest task ID since createTask doesn't return it
      const tasks = await promptTaskService.getAllTasks();
      const latestTask = tasks[tasks.length - 1];

      return latestTask.taskId;
    },
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: promptQueryKeys.tasks() });
    },
  });

  // Prompt Task Deletion
  const deletePromptTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await promptTaskService.deleteTask(taskId);
    },
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: promptQueryKeys.tasks() });
    },
  });

  // Prompt Evaluation Creation
  const createPromptEvaluationMutation = useMutation({
    mutationFn: async ({ taskId, formData }: { taskId: number; formData: PromptFormData }) => {
      const evaluationData: CreatePromptEvaluationDto = {
        prompt: formData.prompt,
      };

      return await promptEvaluationService.createEvaluation(taskId, evaluationData);
    },
    onSuccess: (_, variables) => {
      // Invalidate evaluations list for the specific task
      queryClient.invalidateQueries({
        queryKey: promptQueryKeys.evaluations(variables.taskId)
      });
    },
  });

  return {
    // Task operations
    createPromptTask: createPromptTaskMutation.mutateAsync,
    deletePromptTask: deletePromptTaskMutation.mutateAsync,
    isCreatingPromptTask: createPromptTaskMutation.isPending,
    isDeletingPromptTask: deletePromptTaskMutation.isPending,

    // Evaluation operations
    createPromptEvaluation: createPromptEvaluationMutation.mutateAsync,
    isCreatingPromptEvaluation: createPromptEvaluationMutation.isPending,

    // Mutation objects (for direct access if needed)
    createPromptTaskMutation,
    deletePromptTaskMutation,
    createPromptEvaluationMutation,
  };
};
