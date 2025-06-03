import type { AxiosInstance } from "axios";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskListResponse,
  TaskResponse,
  DeleteTaskResponse,
} from "../../../models/rag-evaluation";
import { eval_rag_http } from "../../api";

export class TaskService {
  private http: AxiosInstance;

  constructor() {
    this.http = eval_rag_http;
  }

  /**
   * Get all evaluation tasks
   * @returns List of tasks
   * @example Response:
   * {
   *   "tasks": [
   *     {
   *       "id": "task1_id",
   *       "name": "task1_name"
   *     },
   *     {
   *       "id": "task2_id",
   *       "name": "task2_name"
   *     }
   *   ]
   * }
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
   * @param taskData The task data with name and optional description
   * @returns The created task object
   * @example Request body:
   * {
   *   "name": "task_name",
   *   "description": "optional_description"
   * }
   * @example Response:
   * {
   *   "status": "success",
   *   "task": {
   *     "id": "new_task_id",
   *     "name": "task_name"
   *   }
   * }
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
   * @param taskId The ID of the task to update
   * @param taskData The updated task data
   * @returns The updated task object
   * @example Request body:
   * {
   *   "name": "updated_task_name",
   *   "description": "updated_description"
   * }
   * @example Response:
   * {
   *   "status": "success",
   *   "task": {
   *     "id": "task_id",
   *     "name": "updated_task_name"
   *   }
   * }
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
   * @param taskId The ID of the task to delete
   * @returns The delete operation response
   * @example Response:
   * {
   *   "status": "success",
   *   "message": "task deleted"
   * }
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
   * @param taskId The ID of the task to retrieve
   * @returns The task details object
   * @example Response:
   * {
   *   "status": "success",
   *   "task": {
   *     "id": "task_id",
   *     "name": "task_name",
   *     "date": "task_date"
   *   }
   * }
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
