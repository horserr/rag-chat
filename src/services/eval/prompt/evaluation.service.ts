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
   * @param taskId The ID of the task to create an evaluation for
   * @param evaluationData The evaluation data object with prompt
   * @note This will cause a long waiting time as mentioned in the HTTP file
   * @returns The evaluation response object
   * @example Request body:
   * {
   *   "prompt": "这是一个测试提示词"
   * }
   * @example Response:
   * {
   *   "prompt": "这是一个测试提示词",
   *   "promptScore": "2",
   *   "modificationReason": "Prompt 过于模糊且缺乏具体内容，未提供明确的任务目标、背景信息或约束条件，无法有效指导生成结果的方向。",
   *   "bleu4Score": 0.0702665,
   *   "editDistance": 0.975,
   *   "lexicalDiversity": 0.8,
   *   "taskId": 6,
   *   "evalId": 3,
   *   "modifiedPrompt": "优化后的Prompt：生成5个软件功能测试用例，涵盖登录模块的正常和异常场景，包含测试步骤、预期结果及优先级分类，以表格形式呈现适用于Web应用程序测试。\"",
   *   "semanticSimilarity": 0.194418,
   *   "rougeLScore": 0.143416,
   *   "entityF1": 0.143691,
   *   "filledPrompt": "\"这是一个测试提示词\""
   * }
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
   * @param taskId The ID of the task
   * @param evalId The ID of the evaluation to retrieve
   * @returns The evaluation object
   * @example API call format: GET /prompt/{taskId}/eval/{evalId}
   * @example Response:
   * {
   *   "prompt": "这是一个测试提示词",
   *   "promptScore": "2",
   *   "modificationReason": "Prompt 过于模糊且缺乏具体内容，未提供明确的任务目标、背景信息或约束条件，无法有效指导生成结果的方向。",
   *   "bleu4Score": 0.0702665,
   *   "editDistance": 0.975,
   *   "lexicalDiversity": 0.8,
   *   "taskId": 6,
   *   "evalId": 3,
   *   "modifiedPrompt": "优化后的Prompt：生成5个软件功能测试用例，涵盖登录模块的正常和异常场景，包含测试步骤、预期结果及优先级分类，以表格形式呈现适用于Web应用程序测试。\"",
   *   "semanticSimilarity": 0.194418,
   *   "rougeLScore": 0.143416,
   *   "entityF1": 0.143691,
   *   "filledPrompt": "\"这是一个测试提示词\""
   * }
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