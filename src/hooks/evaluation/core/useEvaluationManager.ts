import { useCallback } from "react";
import type { RagFormData, PromptFormData } from "../../../models/evaluation-form";
import type { EvaluationStatusResponse } from "../../../models/rag-evaluation";
import { EvaluationService as RagEvaluationService } from "../../../services/eval/rag/evaluation.service";
import { useTaskCleanup } from "../utils/useTaskCleanup";
import { useRagOperations } from "../operations/useRagOperations";
import { usePromptOperations } from "../operations/usePromptOperations";
import { useEvaluationNavigation } from "../utils/useEvaluationNavigation";

// Constants
const POLLING_INTERVAL = 3000; // 3 seconds

// Create singleton service instances outside the component to ensure stability
// Note: ragTaskService and promptTaskService are no longer needed as we use React Query hooks
const ragEvaluationService = new RagEvaluationService();

/**
 * 重构后的评估管理器钩子
 * 使用组合模式将功能拆分到多个专门的钩子中
 * 任务初始化逻辑已提取到 useTaskInitialization 钩子中
 */
export const useEvaluationManager = () => {
  // Use specialized hooks
  const taskCleanup = useTaskCleanup();
  const ragOperations = useRagOperations();
  const promptOperations = usePromptOperations();
  const navigation = useEvaluationNavigation();

  // ===========================================
  // RAG EVALUATION OPERATIONS
  // ===========================================

  // RAG Task Management with cleanup tracking
  const createRagTask = useCallback(
    async (formData: RagFormData) => {
      try {
        const taskId = await ragOperations.createRagTask(formData);
        taskCleanup.addActiveTask("rag", taskId);
        return taskId;
      } catch (error) {
        console.error("Failed to create RAG task:", error);
        throw error;
      }
    },
    [ragOperations, taskCleanup]
  );

  const updateRagTask = useCallback(
    async (taskId: string, formData: RagFormData) => {
      return ragOperations.updateRagTask({ taskId, formData });
    },
    [ragOperations]
  );

  const createRagEvaluation = useCallback(
    async (taskId: string, formData: RagFormData) => {
      return ragOperations.createRagEvaluation({ taskId, formData });
    },
    [ragOperations]
  );

  const deleteRagTask = useCallback(
    async (taskId: string) => {
      try {
        await ragOperations.deleteRagTask(taskId);
        taskCleanup.removeActiveTask("rag", taskId);
      } catch (error) {
        console.error("Failed to delete RAG task:", error);
        throw error;
      }
    },
    [ragOperations, taskCleanup]
  );

  // ===========================================
  // PROMPT EVALUATION OPERATIONS
  // ===========================================

  // Prompt Task Management with cleanup tracking
  const createPromptTask = useCallback(
    async (formData: PromptFormData) => {
      try {
        const taskId = await promptOperations.createPromptTask(formData);
        taskCleanup.addActiveTask("prompt", taskId);
        return taskId;
      } catch (error) {
        console.error("Failed to create prompt task:", error);
        throw error;
      }
    },
    [promptOperations, taskCleanup]
  );

  const createPromptEvaluation = useCallback(
    async (taskId: number, formData: PromptFormData) => {
      return promptOperations.createPromptEvaluation({ taskId, formData });
    },
    [promptOperations]
  );

  const deletePromptTask = useCallback(
    async (taskId: number) => {
      try {
        await promptOperations.deletePromptTask(taskId);
        taskCleanup.removeActiveTask("prompt", taskId);
      } catch (error) {
        console.error("Failed to delete prompt task:", error);
        throw error;
      }
    },
    [promptOperations, taskCleanup]
  );
  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================


  // Polling for RAG evaluation status
  const pollRagEvaluationStatus = useCallback(
    async (
      taskId: string,
      evaluationId: string,
      onProgress?: (status: EvaluationStatusResponse) => void
    ) => {
      try {
        let status = await ragEvaluationService.getEvaluationStatus(
          taskId,
          evaluationId
        );

        if (onProgress) {
          onProgress(status);
        }

        // Continue polling while the evaluation is not completed
        while (status.status === "pending" || status.status === "running") {
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
          status = await ragEvaluationService.getEvaluationStatus(
            taskId,
            evaluationId
          );

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
    },    [] // Remove services from dependencies since they're now stable singletons
  );

  // ===========================================
  // PUBLIC API
  // ===========================================
  return {
    // RAG operations
    createRagTask,
    updateRagTask,
    createRagEvaluation,    deleteRagTask,
    pollRagEvaluationStatus,

    // RAG loading states
    isCreatingRagTask: ragOperations.isCreatingTask,
    isUpdatingRagTask: ragOperations.isUpdatingTask,
    isCreatingRagEvaluation: ragOperations.isCreatingEvaluation,
    isDeletingRagTask: ragOperations.isDeletingTask,

    // Prompt operations
    createPromptTask,
    createPromptEvaluation,
    deletePromptTask,    // Prompt loading states
    isCreatingPromptTask: promptOperations.isCreatingPromptTask,
    isCreatingPromptEvaluation: promptOperations.isCreatingPromptEvaluation,
    isDeletingPromptTask: promptOperations.isDeletingPromptTask,

    // Navigation helpers
    navigateToRagOverview: navigation.navigateToRagOverview,
    navigateToRagDetails: navigation.navigateToRagDetails,
    navigateToRagCreation: navigation.navigateToRagCreation,
    navigateToPromptOverview: navigation.navigateToPromptOverview,
    navigateToPromptDetails: navigation.navigateToPromptDetails,
    navigateToPromptCreation: navigation.navigateToPromptCreation,    navigateToHome: navigation.navigateToHome,
    navigateBack: navigation.navigateBack,

    // Utility functions
    cleanupActiveTasks: taskCleanup.cleanupActiveTasks,

    // Active tasks state
    activeTasks: taskCleanup.activeTasks,
    addActiveTask: taskCleanup.addActiveTask,
    removeActiveTask: taskCleanup.removeActiveTask,
    clearActiveTasks: taskCleanup.clearActiveTasks,

    // Direct access to specialized hooks (if needed)
    taskCleanup,
    ragOperations,
    promptOperations,
    navigation,
  };
};
