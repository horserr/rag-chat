import { eval_prompt_http } from "./http_common";
import { Task, TaskCreate, Eval, EvalCreate, TaskResponse, TasksResponse, EvalResponse, EvalsResponse } from "../models/prompt_eval";

/**
 * Service for interacting with the Prompt Evaluation API
 */
export class PromptEvalService {
    /**
     * Get all tasks
     * @returns Promise with all tasks
     */
    async getAllTasks(): Promise<TasksResponse> {
        try {
            const response = await eval_prompt_http.get("/task");
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
            const response = await eval_prompt_http.post("/task", taskCreate);
            return response.data;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    }

    /**
     * Get a specific task by ID
     * @param taskId ID of the task to retrieve
     * @returns Promise with the task data
     */
    async getTask(taskId: number): Promise<TaskResponse> {
        try {
            const response = await eval_prompt_http.get(`/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task ${taskId}:`, error);
            throw error;
        }
    }

    /**
     * Update a task's name
     * @param taskId ID of the task to update
     * @param taskName New name for the task
     * @returns Promise with the updated task
     */
    async updateTaskName(taskId: number, taskName: string): Promise<TaskResponse> {
        try {
            const response = await eval_prompt_http.put(`/task/${taskId}`, null, {
                params: { task_name: taskName }
            });
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
    async deleteTask(taskId: number): Promise<any> {
        try {
            const response = await eval_prompt_http.delete(`/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            throw error;
        }
    }

    /**
     * Get all evaluations for a specific task
     * @param taskId ID of the task
     * @returns Promise with all evaluations for the task
     */
    async getTaskEvals(taskId: number): Promise<EvalsResponse> {
        try {
            const response = await eval_prompt_http.get(`/task/${taskId}/eval`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching evaluations for task ${taskId}:`, error);
            throw error;
        }
    }

    /**
     * Create a new evaluation for a task
     * @param taskId ID of the task
     * @param evalCreate Evaluation creation data
     * @returns Promise with the created evaluation
     */
    async createEval(taskId: number, evalCreate: EvalCreate): Promise<EvalResponse> {
        try {
            const response = await eval_prompt_http.post(`/task/${taskId}/eval`, evalCreate);
            return response.data;
        } catch (error) {
            console.error(`Error creating evaluation for task ${taskId}:`, error);
            throw error;
        }
    }

    /**
     * Get a specific evaluation
     * @param taskId ID of the task
     * @param evalId ID of the evaluation
     * @returns Promise with the evaluation data
     */
    async getEval(taskId: number, evalId: number): Promise<EvalResponse> {
        try {
            const response = await eval_prompt_http.get(`/prompt/${taskId}/eval/${evalId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching evaluation ${evalId} for task ${taskId}:`, error);
            throw error;
        }
    }
}
