// Add this to rag-evaluation.ts

// Define evaluation status type
export type EvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface EvaluationSampleResult {
  user_input: string;
  response: string;
  retrieved_contexts?: string[];
  reference?: string;
  score?: number;
  explanation?: string;
}

// Unified evaluation details for single-turn, custom, and multi-turn
export interface EvaluationDetailBase {
  id: string;
  task_id: string;
  status: EvaluationStatus;
  created_at: string;
  name?: string;
}

export interface SingleTurnEvaluationDetail extends EvaluationDetailBase {
  eval_type: "single_turn";
  metric: string;
  result: number;
  samples: EvaluationSampleResult;
}

export interface CustomEvaluationDetail extends EvaluationDetailBase {
  eval_type: "custom";
  metric: string;
  result: number;
  samples: EvaluationSampleResult;
}

export interface MultiTurnEvaluationDetail extends EvaluationDetailBase {
  eval_type: "multi_turn";
  metric: string;
  result: number;
  samples: EvaluationSampleResult;
}

export type EvaluationDetail =
  | SingleTurnEvaluationDetail
  | CustomEvaluationDetail
  | MultiTurnEvaluationDetail;
