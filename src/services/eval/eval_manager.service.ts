import {
  MetricId,
  type CreateTaskDto,
  type UpdateTaskDto,
  type CreateEvaluationDto,
  type EvaluationStatusResponse,
  type CreateSingleTurnEvaluationDto,
  type CreateCustomEvaluationDto,
  type CreateMultiTurnEvaluationDto,
  type SingleTurnSample,
  type CustomSample,
  type MultiTurnSample,
} from "../../models/evaluation";

/**
 * Evaluation Manager Service - High-level service for managing evaluations
 * This service combines task and evaluation operations without authentication
 */
export class EvaluationManagerService {
  private taskService: EvalTaskService;
  private promptEvalService: PromptEvalService;

  constructor() {
    this.taskService = new EvalTaskService();
    this.promptEvalService = new PromptEvalService();
  }

  // Task management methods
  async getTasks() {
    return await this.taskService.getTasks();
  }

  async createTask(taskData: CreateTaskDto) {
    return await this.taskService.createTask(taskData);
  }

  async updateTask(taskId: string, taskData: UpdateTaskDto) {
    return await this.taskService.updateTask(taskId, taskData);
  }

  async deleteTask(taskId: string) {
    return await this.taskService.deleteTask(taskId);
  }

  async getTaskById(taskId: string) {
    return await this.taskService.getTaskById(taskId);
  }

  // Evaluation management methods
  async getEvaluations(taskId: string) {
    return await this.evaluationService.getEvaluations(taskId);
  }

  async createEvaluation(taskId: string, evaluationData: CreateEvaluationDto) {
    return await this.evaluationService.createEvaluation(taskId, evaluationData);
  }

  async getEvaluationStatus(taskId: string, evaluationId: string) {
    return await this.evaluationService.getEvaluationStatus(taskId, evaluationId);
  }

  async deleteEvaluation(taskId: string, evaluationId: string) {
    return await this.evaluationService.deleteEvaluation(taskId, evaluationId);
  }

  async getEvaluationDetails(taskId: string, evaluationId: string) {
    return await this.evaluationService.getEvaluationDetails(taskId, evaluationId);
  }

  async pollEvaluationStatus(
    taskId: string,
    evaluationId: string,
    onProgress?: (status: EvaluationStatusResponse) => void,
    pollIntervalMs?: number
  ) {
    return await this.evaluationService.pollEvaluationStatus(
      taskId,
      evaluationId,
      onProgress,
      pollIntervalMs
    );
  }

  // Helper methods for creating specific evaluation types
  async createSingleTurnEvaluation(
    taskId: string,
    metricId: MetricId,
    samples: SingleTurnSample[]
  ) {
    const evaluationData: CreateSingleTurnEvaluationDto = {
      eval_type: "single_turn",
      metric_id: metricId,
      samples,
    };
    return await this.createEvaluation(taskId, evaluationData);
  }

  async createCustomEvaluation(
    taskId: string,
    evalMetric: string,
    customPrompt: string,
    samples: CustomSample[]
  ) {
    const evaluationData: CreateCustomEvaluationDto = {
      eval_type: "custom",
      eval_metric: evalMetric,
      custom_prompt: customPrompt,
      samples,
    };
    return await this.createEvaluation(taskId, evaluationData);
  }

  async createMultiTurnEvaluation(
    taskId: string,
    evalMetric: string,
    customPrompt: string,
    samples: MultiTurnSample[]
  ) {
    const evaluationData: CreateMultiTurnEvaluationDto = {
      eval_type: "multi_turn",
      eval_metric: evalMetric,
      custom_prompt: customPrompt,
      samples,
    };
    return await this.createEvaluation(taskId, evaluationData);
  }

  // Utility methods
  getMetricIdByName(metricName: string): MetricId | null {
    const metricMap: Record<string, MetricId> = {
      "ASPECT_CRITIC": MetricId.ASPECT_CRITIC,
      "ANSWER_RELEVANCY": MetricId.ANSWER_RELEVANCY,
      "CONTEXT_PRECISION": MetricId.CONTEXT_PRECISION,
      "FAITHFULNESS": MetricId.FAITHFULNESS,
      "CONTEXT_RELEVANCE": MetricId.CONTEXT_RELEVANCE,
      "FACTUAL_CORRECTNESS": MetricId.FACTUAL_CORRECTNESS,
      "AGENT_GOAL_ACCURACY_WITH_REF": MetricId.AGENT_GOAL_ACCURACY_WITH_REF,
      "AGENT_GOAL_ACCURACY_WITHOUT_REF": MetricId.AGENT_GOAL_ACCURACY_WITHOUT_REF,
      "TOOL_CALL_ACCURACY": MetricId.TOOL_CALL_ACCURACY,
    };
    return metricMap[metricName] ?? null;
  }

  getMetricNameById(metricId: MetricId): string {
    const metricNames: Record<MetricId, string> = {
      [MetricId.ASPECT_CRITIC]: "ASPECT_CRITIC",
      [MetricId.ANSWER_RELEVANCY]: "ANSWER_RELEVANCY",
      [MetricId.CONTEXT_PRECISION]: "CONTEXT_PRECISION",
      [MetricId.FAITHFULNESS]: "FAITHFULNESS",
      [MetricId.CONTEXT_RELEVANCE]: "CONTEXT_RELEVANCE",
      [MetricId.FACTUAL_CORRECTNESS]: "FACTUAL_CORRECTNESS",
      [MetricId.AGENT_GOAL_ACCURACY_WITH_REF]: "AGENT_GOAL_ACCURACY_WITH_REF",
      [MetricId.AGENT_GOAL_ACCURACY_WITHOUT_REF]: "AGENT_GOAL_ACCURACY_WITHOUT_REF",
      [MetricId.TOOL_CALL_ACCURACY]: "TOOL_CALL_ACCURACY",
    };
    return metricNames[metricId] || "UNKNOWN";
  }
}
