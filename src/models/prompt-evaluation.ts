// Prompt evaluation related types

// Task types
export interface PromptTask {
  taskName: string;
  taskId: number;
}

export interface CreatePromptTaskDto {
  taskName: string;
}

export interface UpdatePromptTaskDto {
  task_name: string;
}

// Evaluation types
export interface PromptEvaluation {
  prompt: string;
  promptScore: string;
  modificationReason: string;
  bleu4Score: number;
  editDistance: number;
  lexicalDiversity: number;
  taskId: number;
  evalId: number;
  modifiedPrompt: string;
  semanticSimilarity: number;
  rougeLScore: number;
  entityF1: number;
  filledPrompt: string;
  groundTruthResponse?: string;
  response?: string;
}

export interface CreatePromptEvaluationDto {
  prompt: string;
}

// Response types
export interface PromptTaskListResponse {
  tasks: PromptTask[];
}

export interface PromptTaskResponse {
  taskName: string;
  taskId: number;
}

export interface DeletePromptTaskResponse {
  message: string;
}

export interface PromptEvaluationListResponse {
  evaluations: PromptEvaluation[];
}

export type PromptEvaluationResponse = PromptEvaluation;

// Error response types
export interface PromptEvaluationErrorResponse {
  detail: string;
}
