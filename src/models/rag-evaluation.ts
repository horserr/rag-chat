// Task related types
export interface TaskDto {
  id: string;
  name: string;
  description?: string;
  date?: string;
}

export interface CreateTaskDto {
  name: string;
  description?: string;
}

export interface UpdateTaskDto {
  name: string;
  description?: string;
}

// Evaluation types
export type EvaluationType = "single_turn" | "custom" | "multi_turn";
export type EvaluationStatus = "pending" | "running" | "completed" | "failed";

// Metric IDs based on the API specification
export const MetricId = {
  ASPECT_CRITIC: 0,
  ANSWER_RELEVANCY: 1,
  CONTEXT_PRECISION: 2,
  FAITHFULNESS: 3,
  CONTEXT_RELEVANCE: 4,
  FACTUAL_CORRECTNESS: 5,
  AGENT_GOAL_ACCURACY_WITH_REF: 6,
  AGENT_GOAL_ACCURACY_WITHOUT_REF: 7,
  TOOL_CALL_ACCURACY: 8,
} as const;

export type MetricId = typeof MetricId[keyof typeof MetricId];

// Sample types for different evaluation types
export interface SingleTurnSample {
  user_input: string;
  response: string;
  retrieved_contexts: string[];
  reference: string;
}

export interface CustomSample {
  user_input: string;
  response: string;
  retrieved_contexts?: string[];
  reference?: string;
}

export interface MultiTurnConversationItem {
  type: "human" | "ai";
  content: string;
}

export interface MultiTurnSample {
  user_input: MultiTurnConversationItem[];
}

// Evaluation creation DTOs
export interface CreateSingleTurnEvaluationDto {
  eval_type: "single_turn";
  metric_id: MetricId;
  samples: SingleTurnSample[];
}

export interface CreateCustomEvaluationDto {
  eval_type: "custom";
  eval_metric: string;
  custom_prompt: string;
  samples: CustomSample[];
}

export interface CreateMultiTurnEvaluationDto {
  eval_type: "multi_turn";
  eval_metric: string;
  custom_prompt: string;
  samples: MultiTurnSample[];
}

export type CreateEvaluationDto =
  | CreateSingleTurnEvaluationDto
  | CreateCustomEvaluationDto
  | CreateMultiTurnEvaluationDto;

// Evaluation response types
export interface EvaluationListItem {
  id: string;
  name: string;
  eval_type: EvaluationType;
  status: EvaluationStatus;
  metric: string;
}

export interface CreateEvaluationResponse {
  status: "pending";
  eval_id: string;
  polling_url: string;
}

// Status query response types
export interface EvaluationStatusPending {
  status: "pending";
  progress: number;
}

export interface EvaluationStatusRunning {
  status: "running";
  progress: number;
}

export interface SingleTurnResult {
  value: number;
  eval_type: "single_turn";
  metric: string;
}

export interface CustomResult {
  value: number;
  eval_type: "custom";
  metric: string;
  custom_prompt: string;
}

export interface MultiTurnResultValue {
  conversation_id: number;
  value: number;
}

export interface MultiTurnResult {
  eval_type: "multi_turn";
  metric: string;
  values: MultiTurnResultValue[];
  average: number;
}

export interface EvaluationStatusCompleted {
  status: "completed";
  progress: 100;
  result: SingleTurnResult | CustomResult | MultiTurnResult;
}

export interface EvaluationError {
  code: string;
  message: string;
  details: string;
}

export interface EvaluationStatusFailed {
  status: "failed";
  progress: number;
  error: EvaluationError;
}

export type EvaluationStatusResponse =
  | EvaluationStatusPending
  | EvaluationStatusRunning
  | EvaluationStatusCompleted
  | EvaluationStatusFailed;

// Evaluation details response types
export interface SingleTurnEvaluationDetails {
  id: string;
  eval_type: "single_turn";
  status: EvaluationStatus;
  samples: SingleTurnSample;
  parameters: {
    metric_id: MetricId;
  };
  result: number;
  created_at: string;
}

export interface CustomEvaluationDetails {
  id: string;
  eval_type: "custom";
  status: EvaluationStatus;
  samples: CustomSample;
  parameters: {
    eval_metric: string;
  };
  result: number;
  created_at: string;
}

export interface MultiTurnEvaluationDetails {
  id: string;
  eval_type: "multi_turn";
  status: EvaluationStatus;
  parameters: {
    eval_metric: string;
  };
  result: Array<{
    user_input: MultiTurnConversationItem[];
    coherence: number;
  }>;
  created_at: string;
}

export type EvaluationDetails =
  | SingleTurnEvaluationDetails
  | CustomEvaluationDetails
  | MultiTurnEvaluationDetails;

// Common response types
export interface DeleteEvaluationResponse {
  status: "success";
  message: "evaluation deleted";
  deleted_eval_type: EvaluationType;
}

export interface TaskResponse {
  status: "success";
  task: TaskDto;
}

export interface TaskListResponse {
  tasks: TaskDto[];
}

export interface EvaluationListResponse {
  evaluations: EvaluationListItem[];
}

export interface DeleteTaskResponse {
  status: "success";
  message: "task deleted";
}
