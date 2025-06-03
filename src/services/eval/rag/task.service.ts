import type { AxiosInstance } from "axios";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskListResponse,
  TaskResponse,
  DeleteTaskResponse,
} from "../../../models/evaluation";
import { eval_rag_http } from "../../api";

export class TaskService {
  private http: AxiosInstance;

  constructor() {
    this.http = eval_rag_http;
  }

  /**
   * Get all evaluation tasks
   */
  async getTasks(): Promise<TaskListResponse> {
    try {
      const response = await this.http.get("task");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  /**
   * Create a new evaluation task
   */
  async createTask(taskData: CreateTaskDto): Promise<TaskResponse> {
    try {
      const response = await this.http.post("task", taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  /**
   * Update an existing evaluation task
   */
  async updateTask(
    taskId: string,
    taskData: UpdateTaskDto
  ): Promise<TaskResponse> {
    try {
      const response = await this.http.put(`task/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  /**
   * Delete an evaluation task
   */
  async deleteTask(taskId: string): Promise<DeleteTaskResponse> {
    try {
      const response = await this.http.delete(`task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Get task details by ID
   */
  async getTaskById(taskId: string): Promise<TaskResponse> {
    try {
      const response = await this.http.get(`task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task details:", error);
      throw error;
    }
  }
}
