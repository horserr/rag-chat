/**
 * Models for the Prompt Evaluation service
 */

import { Result } from "./result";

/**
 * Interface for creating a new task
 */
export interface TaskCreate {
    taskName: string;
}

/**
 * Interface representing a task
 */
export interface Task {
    id: number;
    taskName: string;
    createdAt: string;
}

/**
 * Interface for creating a new evaluation
 */
export interface EvalCreate {
    prompt: string;
}

/**
 * Interface representing an evaluation
 */
export interface Eval {
    id: number;
    prompt: string;
    taskId: number;
    createdAt: string;
}

/**
 * Response types for the Prompt Evaluation API
 */
export type TaskResponse = Result<Task>;
export type TasksResponse = Result<Task[]>;
export type EvalResponse = Result<Eval>;
export type EvalsResponse = Result<Eval[]>;
