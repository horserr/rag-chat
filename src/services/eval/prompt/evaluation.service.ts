import type { AxiosInstance } from "axios";
import type {
  CreatePromptEvaluationDto,
  PromptEvaluationResponse,
} from "../../../models/prompt-evaluation";
import { eval_prompt_http } from "../../api";

export class EvaluationService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = eval_prompt_http;
  }

  /**
   * Create a new prompt evaluation
   * Note: This will cause a long waiting time as mentioned in the HTTP file
   */
  async createEvaluation(taskId: number, evaluationData: CreatePromptEvaluationDto): Promise<PromptEvaluationResponse> {
    try {
      const response = await this.http.post(`task/${taskId}/eval`, evaluationData);
      return response.data;
    } catch (error) {
      console.error("Error creating evaluation:", error);
      throw error;
    }
  }

  /**
   * Get evaluation by ID
   * Note: The URL is different from others - uses /prompt/ instead of /task/
   */
  async getEvaluationById(taskId: number, evalId: number): Promise<PromptEvaluationResponse> {
    try {
      const response = await this.http.get(`prompt/${taskId}/eval/${evalId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      throw error;
    }
  }
}