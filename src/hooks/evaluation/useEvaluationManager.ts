import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  RagFormData,
  PromptFormData
} from '../../components/evaluation/types/evaluation-form';
import type {
  EvaluationStatusResponse,
  CreateEvaluationDto,
  SingleTurnSample,
  CustomSample,
  MultiTurnSample
} from '../../models/rag-evaluation';
import { EvaluationService as RagEvaluationService } from '../../services/eval/rag/evaluation.service';
import { TaskService as RagTaskService } from '../../services/eval/rag/task.service';
import { EvaluationService as PromptEvaluationService } from '../../services/eval/prompt/evaluation.service';
import { TaskService as PromptTaskService } from '../../services/eval/prompt/task.service';

export const useEvaluationManager = () => {
  const navigate = useNavigate();

  // Services - wrap in useMemo to prevent unnecessary recreation on each render
  const ragTaskService = useMemo(() => new RagTaskService(), []);
  const ragEvaluationService = useMemo(() => new RagEvaluationService(), []);
  const promptTaskService = useMemo(() => new PromptTaskService(), []);
  const promptEvaluationService = useMemo(() => new PromptEvaluationService(), []);

  // State for active tasks (for cleanup on page leave)
  const [activeTasks, setActiveTasks] = useState<{
    rag: string[];
    prompt: number[];
  }>({ rag: [], prompt: [] });

  // RAG Evaluation Management
  const createRagTask = useCallback(async (formData: RagFormData) => {
    try {
      const response = await ragTaskService.createTask({
        name: formData.taskName,
        description: formData.description,
      });

      const taskId = response.task.id;
      setActiveTasks(prev => ({
        ...prev,
        rag: [...prev.rag, taskId]
      }));

      return taskId;
    } catch (error) {
      console.error('Failed to create RAG task:', error);
      throw error;
    }
  }, [ragTaskService]);

  const updateRagTask = useCallback(async (taskId: string, formData: RagFormData) => {
    try {
      await ragTaskService.updateTask(taskId, {
        name: formData.taskName,
        description: formData.description,
      });
    } catch (error) {
      console.error('Failed to update RAG task:', error);
      throw error;
    }
  }, [ragTaskService]);
  const createRagEvaluation = useCallback(async (taskId: string, formData: RagFormData) => {
    try {
      if (!formData.samples || formData.samples.length === 0) {
        throw new Error('No samples provided for evaluation');
      }

      let evaluationData: CreateEvaluationDto;

      switch (formData.evaluationType) {        case 'single_turn':
          if (formData.metricId === undefined) {
            throw new Error('Metric ID is required for single_turn evaluation');
          }
          evaluationData = {
            eval_type: 'single_turn',
            metric_id: formData.metricId,
            samples: formData.samples as SingleTurnSample[],
          };
          break;

        case 'custom':
          if (!formData.customMetric || !formData.customPrompt) {
            throw new Error('Custom metric and prompt are required for custom evaluation');
          }
          evaluationData = {
            eval_type: 'custom',
            eval_metric: formData.customMetric,
            custom_prompt: formData.customPrompt,
            samples: formData.samples as CustomSample[],
          };
          break;

        case 'multi_turn':
          if (!formData.customMetric || !formData.customPrompt) {
            throw new Error('Custom metric and prompt are required for multi_turn evaluation');
          }
          evaluationData = {
            eval_type: 'multi_turn',
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
    } catch (error) {
      console.error('Failed to create RAG evaluation:', error);
      throw error;
    }
  }, [ragEvaluationService]);

  // Prompt Evaluation Management
  const createPromptTask = useCallback(async (formData: PromptFormData) => {
    try {
      await promptTaskService.createTask({
        taskName: formData.taskName,
      });

      // Get the latest task ID since createTask doesn't return it
      const tasks = await promptTaskService.getAllTasks();
      const latestTask = tasks[tasks.length - 1];

      setActiveTasks(prev => ({
        ...prev,
        prompt: [...prev.prompt, latestTask.taskId]
      }));

      return latestTask.taskId;
    } catch (error) {
      console.error('Failed to create prompt task:', error);
      throw error;
    }
  }, [promptTaskService]);

  const createPromptEvaluation = useCallback(async (taskId: number, formData: PromptFormData) => {
    try {
      const response = await promptEvaluationService.createEvaluation(taskId, {
        prompt: formData.prompt,
      });
      return response;
    } catch (error) {
      console.error('Failed to create prompt evaluation:', error);
      throw error;
    }
  }, [promptEvaluationService]);

  // Polling for RAG evaluation status
  const pollRagEvaluationStatus = useCallback(async (
    taskId: string,
    evaluationId: string,
    onProgress?: (status: EvaluationStatusResponse) => void
  ) => {
    try {
      // Just use the provided getEvaluationStatus method
      // We'll implement polling ourselves

      // Manual polling implementation
      const pollInterval = 3000; // 3 seconds
      let status = await ragEvaluationService.getEvaluationStatus(taskId, evaluationId);

      if (onProgress) {
        onProgress(status);
      }

      // Continue polling while the evaluation is not completed
      while (status.status === 'pending' || status.status === 'running') {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        status = await ragEvaluationService.getEvaluationStatus(taskId, evaluationId);

        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'completed' || status.status === 'failed') {
          break;
        }
      }

      return status;
    } catch (error) {
      console.error('Failed to poll RAG evaluation status:', error);
      throw error;
    }
  }, [ragEvaluationService]);

  // Navigation helpers
  const navigateToRagOverview = useCallback((taskId?: string) => {
    const url = taskId ? `/evaluation/rag/${taskId}` : '/evaluation/rag';
    navigate(url);
  }, [navigate]);

  const navigateToPromptOverview = useCallback((taskId?: number) => {
    const url = taskId ? `/evaluation/prompt/${taskId}` : '/evaluation/prompt';
    navigate(url);
  }, [navigate]);

  const navigateToRagDetails = useCallback((taskId: string, evaluationId?: string) => {
    const url = evaluationId
      ? `/evaluation/rag/${taskId}/eval/${evaluationId}`
      : `/evaluation/rag/${taskId}/details`;
    navigate(url);
  }, [navigate]);

  const navigateToPromptDetails = useCallback((taskId: number, evaluationId?: number) => {
    const url = evaluationId
      ? `/evaluation/prompt/${taskId}/eval/${evaluationId}`
      : `/evaluation/prompt/${taskId}/details`;
    navigate(url);
  }, [navigate]);
  // Cleanup functions
  const cleanupActiveTasks = useCallback(async () => {
    try {
      // Delete RAG tasks
      if (activeTasks.rag.length > 0) {
        console.log('Cleaning up RAG tasks:', activeTasks.rag);
        await Promise.allSettled(
          activeTasks.rag.map(taskId => ragTaskService.deleteTask(taskId))
        );
      }

      // Delete Prompt tasks
      if (activeTasks.prompt.length > 0) {
        console.log('Cleaning up Prompt tasks:', activeTasks.prompt);
        await Promise.allSettled(
          activeTasks.prompt.map(taskId => promptTaskService.deleteTask(taskId))
        );
      }

      setActiveTasks({ rag: [], prompt: [] });
    } catch (error) {
      console.error('Failed to cleanup tasks:', error);
    }
  }, [activeTasks, ragTaskService, promptTaskService]);

  // Setup cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (activeTasks.rag.length > 0 || activeTasks.prompt.length > 0) {
        event.preventDefault();
        event.returnValue = '关闭页面将删除所有创建的评估任务，确定要离开吗？';
        return event.returnValue;
      }
    };

    const handleUnload = () => {
      cleanupActiveTasks();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [activeTasks, cleanupActiveTasks]);

  return {
    // RAG methods
    createRagTask,
    updateRagTask,
    createRagEvaluation,
    pollRagEvaluationStatus,
    navigateToRagOverview,
    navigateToRagDetails,

    // Prompt methods
    createPromptTask,
    createPromptEvaluation,
    navigateToPromptOverview,
    navigateToPromptDetails,

    // Cleanup
    cleanupActiveTasks,
    activeTasks,
  };
};
