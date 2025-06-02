import type { AxiosInstance } from "axios";
import type {
  CreateEvaluationDto,
  CreateEvaluationResponse,
  DeleteEvaluationResponse,
  EvaluationDetails,
  EvaluationListResponse,
  EvaluationStatusResponse,
} from "../../../models/evaluation";
import { eval_rag_http } from "../../api";

export class EvaluationService {
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
   */
  async createEvaluation(
    taskId: string,
    evaluationData: CreateEvaluationDto
  ): Promise<CreateEvaluationResponse> {
    try {
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
}
