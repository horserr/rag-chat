import { AxiosInstance } from "axios";
import { eval_rag_http } from "./http_common";
import {
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskResponse,
  TaskDeleteResponse,
  EvalCreate,
  EvalCreateResponse,
  EvalListResponse,
  EvalStatusResponse,
  EvalDeleteResponse,
  EvalDetail,
  SingleTurnEvalCreate,
  CustomEvalCreate,
  MultiTurnEvalCreate
} from "../models/rag_eval";

/**
 * Service for interacting with the RAG Evaluation API
 */
export class RagEvalService {
  private http: AxiosInstance;

  /**
   * Constructor
   */
  constructor() {
    this.http = eval_rag_http;
  }

  // ==================== Task Management ====================

  /**
   * Get all tasks
   * @returns Promise with all tasks
   */
  async getAllTasks(): Promise<TaskListResponse> {
    try {
      const response = await this.http.get("/task");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  /**
   * Create a new task
   * @param taskCreate Task creation data
   * @returns Promise with the created task
   */
  async createTask(taskCreate: TaskCreate): Promise<TaskResponse> {
    try {
      const response = await this.http.post("/task", taskCreate);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  /**
   * Update a task
   * @param taskId ID of the task to update
   * @param taskUpdate Task update data
   * @returns Promise with the updated task
   */
  async updateTask(taskId: string, taskUpdate: TaskUpdate): Promise<TaskResponse> {
    try {
      const response = await this.http.put(`/task/${taskId}`, taskUpdate);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task
   * @param taskId ID of the task to delete
   * @returns Promise with the deletion result
   */
  async deleteTask(taskId: string): Promise<TaskDeleteResponse> {
    try {
      const response = await this.http.delete(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Get task details
   * @param taskId ID of the task
   * @returns Promise with the task details
   */
  async getTaskDetails(taskId: string): Promise<TaskResponse> {
    try {
      const response = await this.http.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  }

  // ==================== Evaluation Management ====================

  /**
   * Get all evaluations for a task
   * @param taskId ID of the task
   * @returns Promise with all evaluations for the task
   */
  async getTaskEvaluations(taskId: string): Promise<EvalListResponse> {
    try {
      const response = await this.http.get(`/task/${taskId}/eval`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching evaluations for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Create a single turn evaluation
   * @param taskId ID of the task
   * @param evalData Evaluation creation data
   * @returns Promise with the evaluation creation result
   */
  async createSingleTurnEvaluation(
    taskId: string,
    evalData: SingleTurnEvalCreate
  ): Promise<EvalCreateResponse> {
    return this.createEvaluation(taskId, evalData);
  }

  /**
   * Create a custom evaluation
   * @param taskId ID of the task
   * @param evalData Evaluation creation data
   * @returns Promise with the evaluation creation result
   */
  async createCustomEvaluation(
    taskId: string,
    evalData: CustomEvalCreate
  ): Promise<EvalCreateResponse> {
    return this.createEvaluation(taskId, evalData);
  }

  /**
   * Create a multi-turn evaluation
   * @param taskId ID of the task
   * @param evalData Evaluation creation data
   * @returns Promise with the evaluation creation result
   */
  async createMultiTurnEvaluation(
    taskId: string,
    evalData: MultiTurnEvalCreate
  ): Promise<EvalCreateResponse> {
    return this.createEvaluation(taskId, evalData);
  }

  /**
   * Generic method to create any type of evaluation
   * @param taskId ID of the task
   * @param evalData Evaluation creation data
   * @returns Promise with the evaluation creation result
   */
  private async createEvaluation(
    taskId: string,
    evalData: EvalCreate
  ): Promise<EvalCreateResponse> {
    try {
      const response = await this.http.post(`/task/${taskId}/eval`, evalData);
      return response.data;
    } catch (error) {
      console.error(`Error creating evaluation for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Check the status of an evaluation
   * @param taskId ID of the task
   * @param evalId ID of the evaluation
   * @returns Promise with the evaluation status
   */
  async checkEvaluationStatus(taskId: string, evalId: string): Promise<EvalStatusResponse> {
    try {
      const response = await this.http.get(`/task/${taskId}/eval/${evalId}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error checking status for evaluation ${evalId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an evaluation
   * @param taskId ID of the task
   * @param evalId ID of the evaluation
   * @returns Promise with the deletion result
   */
  async deleteEvaluation(taskId: string, evalId: string): Promise<EvalDeleteResponse> {
    try {
      const response = await this.http.delete(`/task/${taskId}/eval/${evalId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting evaluation ${evalId}:`, error);
      throw error;
    }
  }

  /**
   * Get evaluation details
   * @param taskId ID of the task
   * @param evalId ID of the evaluation
   * @returns Promise with the evaluation details
   */
  async getEvaluationDetails(taskId: string, evalId: string): Promise<EvalDetail> {
    try {
      const response = await this.http.get(`/task/${taskId}/eval/${evalId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching evaluation ${evalId}:`, error);
      throw error;
    }
  }
}
