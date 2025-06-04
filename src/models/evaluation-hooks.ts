/**
 * 共享类型定义
 */

import type { EvaluationStatusResponse } from "./rag-evaluation";

// 活跃任务状态
export interface ActiveTasks {
  rag: string[];
  prompt: number[];
}

// 任务清理结果
export interface CleanupResult {
  success: boolean;
  errors: string[];
}

// 轮询状态
export interface PollingState {
  isPolling: boolean;
  interval: number;
  onProgress?: (status: EvaluationStatusResponse) => void;
}

// 评估创建结果
export interface EvaluationCreationResult {
  taskId: string | number;
  evaluationId?: string | number;
  success: boolean;
  error?: string;
}
