import type { AxiosInstance } from "axios";
import type {
  CreateEvaluationDto,
  CreateEvaluationResponse,
  DeleteEvaluationResponse,
  EvaluationDetails,
  EvaluationListResponse,
  EvaluationStatusResponse,
} from "../../../models/rag-evaluation";
import { eval_rag_http } from "../../api";

export class EvaluationService {
  private http: AxiosInstance;

  constructor() {
    this.http = eval_rag_http;
  }

  /**
   * Get all evaluations for a specific task
   * @param taskId The ID of the task to get evaluations for
   * @returns List of evaluations for the task
   * @example Response:
   * {
   *   "evaluations": [
   *     {
   *       "id": "eval1_id",
   *       "name": "eval1_name",
   *       "eval_type": "single_turn|custom|multi_turn",
   *       "status": "completed",
   *       "metric": "clarity"
   *     },
   *     {
   *       "id": "eval2_id",
   *       "name": "eval2_name",
   *       "eval_type": "single_turn|custom|multi_turn",
   *       "status": "in_progress",
   *       "metric": "coherence"
   *     }
   *   ]
   * }
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
   * @param taskId The ID of the task to create an evaluation for
   * @param evaluationData The evaluation data with type, metric and samples
   * @returns The created evaluation response
   * @note The single_turn evaluation type requires a metric ID, while custom and multi_turn evaluations use eval_metric and custom_prompt.
   * @example Request body (single_turn):
   * {
   *   "eval_type": "single_turn",
   *   "metric_id": 5,
   *   "samples": [
   *     {
   *       "user_input": "什么是量子计算？",
   *       "response": "量子计算是利用量子力学原理进行计算的技术。",
   *       "retrieved_contexts": ["量子计算是一种新型计算技术...", "量子比特是量子计算的基本单位..."],
   *       "reference": "量子计算是一种利用量子力学原理进行信息处理的计算技术。"
   *     }
   *   ]
   * }
   * @example Request body (custom):
   * {
   *   "eval_type": "custom",
   *   "eval_metric": "clarity",
   *   "custom_prompt": "评估回答的清晰度",
   *   "samples": [...]
   * }
   * @example Request body (multi_turn):
   * {
   *   "eval_type": "multi_turn",
   *   "eval_metric": "coherence",
   *   "custom_prompt": "评估对话的连贯性",
   *   "samples": [...]
   * }
   * @example Response:
   * {
   *   "status": "pending",
   *   "eval_id": "eval_123",
   *   "polling_url": "/api/rag/task/1/eval/eval_123/status"
   * }
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
   * @param taskId The ID of the task
   * @param evaluationId The ID of the evaluation
   * @returns The evaluation status
   * @example Response (pending):
   * {
   *   "status": "pending",
   *   "progress": 0
   * }
   * @example Response (running):
   * {
   *   "status": "running",
   *   "progress": 60
   * }
   * @example Response (completed - single_turn):
   * {
   *   "status": "completed",
   *   "progress": 100,
   *   "result": {
   *     "value": 0.85,
   *     "eval_type": "single_turn",
   *     "metric": "accuracy"
   *   }
   * }
   * @example Response (completed - custom):
   * {
   *   "status": "completed",
   *   "progress": 100,
   *   "result": {
   *     "value": 0.92,
   *     "eval_type": "custom",
   *     "metric": "clarity",
   *     "custom_prompt": "评估回答的艺术性"
   *   }
   * }
   * @example Response (completed - multi_turn):
   * {
   *   "status": "completed",
   *   "progress": 100,
   *   "result": {
   *     "eval_type": "multi_turn",
   *     "metric": "coherence",
   *     "values": [
   *       {
   *         "conversation_id": 1,
   *         "value": 0.9
   *       },
   *       {
   *         "conversation_id": 2,
   *         "value": 0.85
   *       }
   *     ],
   *     "average": 0.875
   *   }
   * }
   * @example Response (failed):
   * {
   *   "status": "failed",
   *   "progress": 0,
   *   "error": {
   *     "code": "EVALUATION_ERROR",
   *     "message": "评估过程中出现错误",
   *     "details": "Python脚本执行失败：无法解析输入样本"
   *   }
   * }
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
   * @param taskId The ID of the task
   * @param evaluationId The ID of the evaluation to delete
   * @returns The delete operation response
   * @example Response:
   * {
   *   "status": "success",
   *   "message": "evaluation deleted",
   *   "deleted_eval_type": "single_turn|custom|multi_turn"
   * }
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
   * @param taskId The ID of the task
   * @param evaluationId The ID of the evaluation
   * @returns The evaluation details
   * @example Response (single_turn):
   * {
   *   "id": "eval_123",
   *   "eval_type": "single_turn",
   *   "status": "completed",
   *   "samples": {
   *     "user_input": "什么是量子计算？",
   *     "response": "量子计算是利用量子力学原理进行计算的技术。",
   *     "retrieved_contexts": ["上下文1", "上下文2"],
   *     "reference": "标准答案文本"
   *   },
   *   "parameters": {
   *     "metric_id": 5
   *   },
   *   "result": 0.85,
   *   "created_at": "2023-10-05T08:30:00Z"
   * }
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
   * @example Status responses will follow the same format as getEvaluationStatus
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
