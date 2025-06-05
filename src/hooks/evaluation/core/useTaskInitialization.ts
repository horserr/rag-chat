import { useCallback, useEffect } from "react";
import { useTaskCleanup } from "../utils/useTaskCleanup";
import { useRagTasks } from "../queries/useRagQueries";
import { usePromptTasks } from "../queries/usePromptQueries";
import type { TaskDto } from "../../../models/rag-evaluation";
import type { PromptTask } from "../../../models/prompt-evaluation";

/**
 * Task initialization hook
 * Handles the initialization of active tasks from cached data
 * Extracted from useEvaluationManager to separate concerns
 */
export const useTaskInitialization = () => {
  // Use React Query hooks for data fetching
  const { data: ragTasksData } = useRagTasks();
  const { data: promptTasksData } = usePromptTasks();

  // Use task cleanup utilities
  const taskCleanup = useTaskCleanup();

  // Initialize active tasks using React Query cached data instead of direct API calls
  const initializeActiveTasks = useCallback(() => {
    // Only initialize if we have data from React Query
    if (!ragTasksData || !promptTasksData) {
      console.log("Waiting for task data to be loaded...");
      return { rag: [], prompt: [] };
    }

    try {
      console.log("Initializing active tasks from cached data...");

      // Use React Query cached data instead of direct API calls
      const ragTasks = ragTasksData.tasks || [];
      const promptTasksResponse = promptTasksData.tasks || [];

      console.log("Found RAG tasks:", ragTasks);
      console.log("Found Prompt tasks:", promptTasksResponse);

      // Update activeTasks with all existing task IDs
      const newActiveTasks = {
        rag: ragTasks.map((task: TaskDto) => task.id),
        prompt: promptTasksResponse.map((task: PromptTask) => task.taskId),
      };

      console.log("Setting activeTasks to:", newActiveTasks);
      taskCleanup.setActiveTasks(newActiveTasks);

      return newActiveTasks;
    } catch (error) {
      console.error("Failed to initialize active tasks:", error);
      // Don't throw error, just log it and continue with empty tasks
      return { rag: [], prompt: [] };
    }
  }, [ragTasksData, promptTasksData, taskCleanup]);

  // Initialize tasks on mount
  useEffect(() => {
    initializeActiveTasks();
  }, [initializeActiveTasks]);

  return {
    initializeActiveTasks,
    activeTasks: taskCleanup.activeTasks,
  };
};
