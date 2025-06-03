import type { AxiosInstance } from "axios";
import type {
  CreateEvaluationDto,
  CreateEvaluationResponse,
  CustomSample,
  DeleteEvaluationResponse,
  EvaluationDetails,
  EvaluationListResponse,
  EvaluationStatusResponse,
  MetricId,
  MultiTurnSample,
  SingleTurnSample,
} from "../../../models/evaluation";
import { eval_rag_http } from "../../api";

/**
 * Prompt Evaluation Service - manages prompt evaluations without authentication
 * This service is independent from the RAG chat system and supports:
 * - Single turn evaluations (requires metric_id)
 * - Custom evaluations (requires metric name only)
 * - Multi-turn evaluations (requires metric name only)
 */
export class PromptEvalService {
  private http: AxiosInstance;

  constructor() {
    this.http = eval_rag_http;
  }

  /**
   * Get all evaluations for a specific task
   */
  async getEvaluations(taskId: string): Promise<EvaluationListResponse> {
    try {
      const response = await this.http.get(`task/${taskId}/eval`);
      return response.data;
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      throw error;
    }
  }

  /**
   * Create a new evaluation for a task
   * Note:
   * - Single turn evaluations require metric_id
   * - Custom and multi-turn evaluations only require metric name
   */
  async createEvaluation(
    taskId: string,
    evaluationData: CreateEvaluationDto
  ): Promise<CreateEvaluationResponse> {
    try {
      // Validate evaluation data based on type
      this.validateEvaluationData(evaluationData);

      const response = await this.http.post(
        `task/${taskId}/eval`,
        evaluationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating evaluation:", error);
      throw error;
    }
  }

  /**
   * Get evaluation status by ID (for polling)
   */
  async getEvaluationStatus(
    taskId: string,
    evaluationId: string
  ): Promise<EvaluationStatusResponse> {
    try {
      const response = await this.http.get(
        `task/${taskId}/eval/${evaluationId}/status`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching evaluation status:", error);
      throw error;
    }
  }

  /**
   * Delete an evaluation
   */
  async deleteEvaluation(
    taskId: string,
    evaluationId: string
  ): Promise<DeleteEvaluationResponse> {
    try {
      const response = await this.http.delete(
        `task/${taskId}/eval/${evaluationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      throw error;
    }
  }

  /**
   * Get evaluation details by ID
   */
  async getEvaluationDetails(
    taskId: string,
    evaluationId: string
  ): Promise<EvaluationDetails> {
    try {
      const response = await this.http.get(
        `task/${taskId}/eval/${evaluationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching evaluation details:", error);
      throw error;
    }
  }

  /**
   * Poll evaluation status until completion or failure
   * @param taskId - Task ID
   * @param evaluationId - Evaluation ID
   * @param onProgress - Callback for progress updates
   * @param pollIntervalMs - Polling interval in milliseconds (default: 2000)
   * @returns Promise that resolves when evaluation is complete or fails
   */
  async pollEvaluationStatus(
    taskId: string,
    evaluationId: string,
    onProgress?: (status: EvaluationStatusResponse) => void,
    pollIntervalMs: number = 2000
  ): Promise<EvaluationStatusResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getEvaluationStatus(taskId, evaluationId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === "completed" || status.status === "failed") {
            resolve(status);
            return;
          }

          // Continue polling if still pending or running
          setTimeout(poll, pollIntervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Validate evaluation data based on type
   * @private
   */
  private validateEvaluationData(evaluationData: CreateEvaluationDto): void {
    switch (evaluationData.eval_type) {
      case "single_turn":
        if (!("metric_id" in evaluationData)) {
          throw new Error("Single turn evaluations require metric_id");
        }
        break;
      case "custom":
        if (!("eval_metric" in evaluationData)) {
          throw new Error(
            "Custom evaluations require eval_metric (metric name)"
          );
        }
        break;
      case "multi_turn":
        if (!("eval_metric" in evaluationData)) {
          throw new Error(
            "Multi-turn evaluations require eval_metric (metric name)"
          );
        }
        break;
      default:
        throw new Error(`Unknown evaluation type: ${evaluationData.eval_type}`);
    }
  }
  /**
   * Create a single turn evaluation
   * Convenience method for single turn evaluations
   */
  async createSingleTurnEvaluation(
    taskId: string,
    metricId: MetricId,
    samples: SingleTurnSample[]
  ): Promise<CreateEvaluationResponse> {
    return this.createEvaluation(taskId, {
      eval_type: "single_turn",
      metric_id: metricId,
      samples,
    });
  }

  /**
   * Create a custom evaluation
   * Convenience method for custom evaluations
   */
  async createCustomEvaluation(
    taskId: string,
    metricName: string,
    customPrompt: string,
    samples: CustomSample[]
  ): Promise<CreateEvaluationResponse> {
    return this.createEvaluation(taskId, {
      eval_type: "custom",
      eval_metric: metricName,
      custom_prompt: customPrompt,
      samples,
    });
  }

  /**
   * Create a multi-turn evaluation
   * Convenience method for multi-turn evaluations
   */
  async createMultiTurnEvaluation(
    taskId: string,
    metricName: string,
    customPrompt: string,
    samples: MultiTurnSample[]
  ): Promise<CreateEvaluationResponse> {
    return this.createEvaluation(taskId, {
      eval_type: "multi_turn",
      eval_metric: metricName,
      custom_prompt: customPrompt,
      samples,
    });
  }
}
