import type { AxiosInstance } from "axios";
import type {
  PromptTask,
  CreatePromptTaskDto,
  PromptTaskResponse,
  DeletePromptTaskResponse,
  PromptEvaluationListResponse,
  PromptEvaluationErrorResponse,
} from "../../../models/prompt-evaluation";
import { eval_prompt_http } from "../../api";

export class TaskService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = eval_prompt_http;
  }

  /**
   * Get all prompt evaluation tasks
   * @returns An array of task objects
   * @example Response:
   * [{
   *   "taskName": "更新后的任务名",
   *   "taskId": 5
   * }]
   */
  async getAllTasks(): Promise<PromptTask[]> {
    try {
      const response = await this.http.get("task");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  /**
   * Create a new prompt evaluation task
   * @param taskData The task data object with task name
   * @example Request body:
   * {
   *   "taskName": "测试任务"
   * }
   * @example Response: No response body
   */
  async createTask(taskData: CreatePromptTaskDto): Promise<void> {
    try {
      await this.http.post("task", taskData);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  /**
   * Update task name
   * @param taskId The ID of the task to update
   * @param taskName The new name for the task
   * @example API call format: PUT /task/{taskId}?task_name={taskName}
   * @example Response: No response body
   */
  async updateTaskName(taskId: number, taskName: string): Promise<void> {
    try {
      await this.http.put(`task/${taskId}`, null, {
        params: { task_name: taskName }
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  /**
   * Delete a task
   * @param taskId The ID of the task to delete
   * @returns The delete response message
   * @example Response:
   * {
   *   "message": "Task deleted successfully"
   * }
   */
  async deleteTask(taskId: number): Promise<DeletePromptTaskResponse> {
    try {
      const response = await this.http.delete(`task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Get task by ID
   * @param taskId The ID of the task to retrieve
   * @returns The task object
   * @example Response:
   * {
   *   "taskName": "测试任务",
   *   "taskId": 6
   * }
   */
  async getTaskById(taskId: number): Promise<PromptTaskResponse> {
    try {
      const response = await this.http.get(`task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  }

  /**
   * Get all evaluations for a specific task
   * @param taskId The ID of the task to get evaluations for
   * @returns A list of evaluations or an error response
   * @example Success Response (array of evaluation objects):
   * [
   *   {
   *     "prompt": "这是一个测试提示词",
   *     "promptScore": "2",
   *     "modificationReason": "Prompt 过于模糊且缺乏具体内容...",
   *     "bleu4Score": 0.0702665,
   *     "editDistance": 0.975,
   *     "lexicalDiversity": 0.8,
   *     "taskId": 6,
   *     "evalId": 3,
   *     "modifiedPrompt": "优化后的Prompt：生成5个软件功能测试用例...",
   *     "semanticSimilarity": 0.194418,
   *     "rougeLScore": 0.143416,
   *     "entityF1": 0.143691,
   *     "filledPrompt": "\"这是一个测试提示词\""
   *   }
   * ]
   * @example Error Response:
   * {
   *   "detail": "Evals not found"
   * }
   */
  async getTaskEvaluations(taskId: number): Promise<PromptEvaluationListResponse | PromptEvaluationErrorResponse> {
    try {
      const response = await this.http.get(`task/${taskId}/eval`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task evaluations:", error);
      throw error;
    }
  }
}