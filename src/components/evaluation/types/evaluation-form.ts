import type {
  EvaluationType,
  MetricId,
  SingleTurnSample,
  CustomSample,
  MultiTurnSample
} from "../../../models/rag-evaluation";

// RAG Evaluation Form Data
export interface RagFormData {
  // Step 1: Basic Information
  taskName: string;
  description: string;
  evaluationType: EvaluationType;
  metricId?: MetricId; // For single_turn
  customMetric?: string; // For custom/multi_turn
  customPrompt?: string; // For custom/multi_turn

  // Step 2: Dataset
  datasetFile?: File;
  samples?: SingleTurnSample[] | CustomSample[] | MultiTurnSample[];

  // Status
  taskId?: string;
  isTaskCreated: boolean;
}

// Prompt Evaluation Form Data
export interface PromptFormData {
  taskName: string;
  prompt: string;
  taskId?: string; // Changed from number to string for consistency
  isTaskCreated: boolean;
}

// Preview Panel Data for RAG
export interface RagPreviewData {
  taskName?: string;
  description?: string;
  evaluationType?: EvaluationType;
  metric?: string;
  customPrompt?: string;
  samplesCount?: number;
  samplesPreview?: Array<{
    userInput: string;
    response: string;
    contexts?: string[];
  }>;
}

// Preview Panel Data for Prompt
export interface PromptPreviewData {
  taskName?: string;
  prompt?: string;
  promptLength?: number;
}

// Form Step Status
export interface StepStatus {
  completed: boolean;
  hasErrors: boolean;
  data: Record<string, unknown>;
}

// Evaluation Creation State
export interface EvaluationCreationState {
  type: 'rag' | 'prompt';
  currentStep: number;
  totalSteps: number;
  steps: StepStatus[];
  isSubmitting: boolean;
  isCompleted: boolean;
  taskId?: string | number;
  evaluationId?: string | number;
  error?: string;
}

// Constants for metrics
export const RAG_METRICS = {
  [0]: { name: 'Aspect Critic', description: '评估回答的多维度质量' },
  [1]: { name: 'Answer Relevancy', description: '评估回答与问题的相关性' },
  [2]: { name: 'Context Precision', description: '评估检索上下文的精确度' },
  [3]: { name: 'Faithfulness', description: '评估回答对上下文的忠实度' },
  [4]: { name: 'Context Relevance', description: '评估上下文的相关性' },
  [5]: { name: 'Factual Correctness', description: '评估事实的正确性' },
  [6]: { name: 'Agent Goal Accuracy (With Ref)', description: '带参考的目标准确性' },
  [7]: { name: 'Agent Goal Accuracy (Without Ref)', description: '无参考的目标准确性' },
  [8]: { name: 'Tool Call Accuracy', description: '工具调用准确性' },
} as const;

// File validation rules
export const DATASET_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.json', '.jsonl', '.csv'],
  requiredFields: {
    single_turn: ['user_input', 'response', 'retrieved_contexts', 'reference'],
    custom: ['user_input', 'response'],
    multi_turn: ['user_input'],
  },
} as const;
