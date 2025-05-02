/**
 * Models for the RAG Evaluation service
 */

import { Result } from "./result";

// ==================== Task Models ====================

/**
 * Basic task information
 */
export interface TaskBasic {
  id: string;
  name: string;
}

/**
 * Detailed task information
 */
export interface TaskDetail extends TaskBasic {
  date: string;
}

/**
 * Task creation request
 */
export interface TaskCreate {
  name: string;
  description?: string;
}

/**
 * Task update request
 */
export interface TaskUpdate {
  name?: string;
  description?: string;
}

/**
 * Task list response
 */
export interface TaskListResponse {
  tasks: TaskBasic[];
}

/**
 * Task response with status
 */
export interface TaskResponse {
  status: string;
  task: TaskBasic | TaskDetail;
}

/**
 * Task deletion response
 */
export interface TaskDeleteResponse {
  status: string;
  message: string;
}

// ==================== Evaluation Models ====================

/**
 * Evaluation types
 */
export type EvalType = 'single_turn' | 'custom' | 'multi_turn';

/**
 * Evaluation status
 */
export type EvalStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Metric enum (matches backend enum)
 */
export enum MetricEnum {
  ASPECT_CRITIC = 0,
  ANSWER_RELEVANCY = 1,
  CONTEXT_PRECISION = 2,
  FAITHFULNESS = 3,
  CONTEXT_RELEVANCE = 4,
  FACTUAL_CORRECTNESS = 5,
  AGENT_GOAL_ACCURACY_WITH_REF = 6,
  AGENT_GOAL_ACCURACY_WITHOUT_REF = 7,
  TOOL_CALL_ACCURACY = 8
}

/**
 * Basic evaluation information
 */
export interface EvalBasic {
  id: string;
  name: string;
  eval_type: EvalType;
  status: EvalStatus;
  metric: string;
}

/**
 * Sample for single turn evaluation
 */
export interface SingleTurnSample {
  user_input: string;
  response: string;
  retrieved_contexts: string[];
  reference: string;
}

/**
 * Sample for multi-turn evaluation
 */
export interface MultiTurnSample {
  user_input: Array<{
    type: 'human' | 'ai';
    content: string;
  }>;
}

/**
 * Single turn evaluation request
 */
export interface SingleTurnEvalCreate {
  eval_type: 'single_turn';
  metric_id: number;
  samples: SingleTurnSample[];
}

/**
 * Custom evaluation request
 */
export interface CustomEvalCreate {
  eval_type: 'custom';
  eval_metric: string;
  custom_prompt: string;
  samples: SingleTurnSample[];
}

/**
 * Multi-turn evaluation request
 */
export interface MultiTurnEvalCreate {
  eval_type: 'multi_turn';
  eval_metric: string;
  custom_prompt: string;
  samples: MultiTurnSample[];
}

/**
 * Union type for all evaluation creation requests
 */
export type EvalCreate = SingleTurnEvalCreate | CustomEvalCreate | MultiTurnEvalCreate;

/**
 * Evaluation creation response
 */
export interface EvalCreateResponse {
  status: string;
  eval_id: string;
  polling_url: string;
}

/**
 * Evaluation list response
 */
export interface EvalListResponse {
  evaluations: EvalBasic[];
}

/**
 * Pending/Running status response
 */
export interface EvalPendingStatusResponse {
  status: 'pending' | 'running';
  progress: number;
}

/**
 * Completed single turn evaluation status response
 */
export interface EvalCompletedSingleTurnStatusResponse {
  status: 'completed';
  progress: 100;
  result: {
    value: number;
    eval_type: 'single_turn';
    metric: string;
  };
}

/**
 * Completed custom evaluation status response
 */
export interface EvalCompletedCustomStatusResponse {
  status: 'completed';
  progress: 100;
  result: {
    value: number;
    eval_type: 'custom';
    metric: string;
    custom_prompt: string;
  };
}

/**
 * Completed multi-turn evaluation status response
 */
export interface EvalCompletedMultiTurnStatusResponse {
  status: 'completed';
  progress: 100;
  result: {
    eval_type: 'multi_turn';
    metric: string;
    values: Array<{
      conversation_id: number;
      value: number;
    }>;
    average: number;
  };
}

/**
 * Failed evaluation status response
 */
export interface EvalFailedStatusResponse {
  status: 'failed';
  progress: 0;
  error: {
    code: string;
    message: string;
    details: string;
  };
}

/**
 * Union type for all evaluation status responses
 */
export type EvalStatusResponse = 
  | EvalPendingStatusResponse 
  | EvalCompletedSingleTurnStatusResponse 
  | EvalCompletedCustomStatusResponse 
  | EvalCompletedMultiTurnStatusResponse 
  | EvalFailedStatusResponse;

/**
 * Evaluation deletion response
 */
export interface EvalDeleteResponse {
  status: string;
  message: string;
  deleted_eval_type: EvalType;
}

/**
 * Single turn evaluation detail response
 */
export interface SingleTurnEvalDetail {
  id: string;
  eval_type: 'single_turn';
  status: EvalStatus;
  samples: SingleTurnSample;
  parameters: {
    metric_id: number;
  };
  result: number;
  created_at: string;
}

/**
 * Custom evaluation detail response
 */
export interface CustomEvalDetail {
  id: string;
  eval_type: 'custom';
  status: EvalStatus;
  samples: SingleTurnSample;
  parameters: {
    eval_metric: string;
  };
  result: number;
  created_at: string;
}

/**
 * Multi-turn evaluation detail response
 */
export interface MultiTurnEvalDetail {
  id: string;
  eval_type: 'multi_turn';
  status: EvalStatus;
  parameters: {
    eval_metric: string;
  };
  result: Array<{
    user_input: Array<{
      type: 'human' | 'ai';
      content: string;
    }>;
    [metric: string]: any;
  }>;
  created_at: string;
}

/**
 * Union type for all evaluation detail responses
 */
export type EvalDetail = SingleTurnEvalDetail | CustomEvalDetail | MultiTurnEvalDetail;
