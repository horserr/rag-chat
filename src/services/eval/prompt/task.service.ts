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