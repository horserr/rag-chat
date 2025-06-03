import { MetricId } from "../../models/rag-evaluation";

/**
 * Utility functions for evaluation operations
 */
export class EvaluationUtils {
  /**
   * Get human-readable metric names
   */
  static getMetricDisplayName(metricId: MetricId): string {
    const displayNames: Record<MetricId, string> = {
      [MetricId.ASPECT_CRITIC]: "Aspect Critic",
      [MetricId.ANSWER_RELEVANCY]: "Answer Relevancy",
      [MetricId.CONTEXT_PRECISION]: "Context Precision",
      [MetricId.FAITHFULNESS]: "Faithfulness",
      [MetricId.CONTEXT_RELEVANCE]: "Context Relevance",
      [MetricId.FACTUAL_CORRECTNESS]: "Factual Correctness",
      [MetricId.AGENT_GOAL_ACCURACY_WITH_REF]: "Agent Goal Accuracy (With Reference)",
      [MetricId.AGENT_GOAL_ACCURACY_WITHOUT_REF]: "Agent Goal Accuracy (Without Reference)",
      [MetricId.TOOL_CALL_ACCURACY]: "Tool Call Accuracy",
    };
    return displayNames[metricId] || "Unknown Metric";
  }

  /**
   * Get metric description
   */
  static getMetricDescription(metricId: MetricId): string {
    const descriptions: Record<MetricId, string> = {
      [MetricId.ASPECT_CRITIC]: "Evaluates specific aspects of the response quality",
      [MetricId.ANSWER_RELEVANCY]: "Measures how relevant the answer is to the question",
      [MetricId.CONTEXT_PRECISION]: "Evaluates precision of retrieved context",
      [MetricId.FAITHFULNESS]: "Measures faithfulness to the source material",
      [MetricId.CONTEXT_RELEVANCE]: "Evaluates relevance of retrieved context",
      [MetricId.FACTUAL_CORRECTNESS]: "Measures factual accuracy of the response",
      [MetricId.AGENT_GOAL_ACCURACY_WITH_REF]: "Evaluates goal achievement with reference",
      [MetricId.AGENT_GOAL_ACCURACY_WITHOUT_REF]: "Evaluates goal achievement without reference",
      [MetricId.TOOL_CALL_ACCURACY]: "Measures accuracy of tool usage",
    };
    return descriptions[metricId] || "No description available";
  }

  /**
   * Get all available metrics for RAG evaluation
   */
  static getRAGMetrics(): Array<{ id: MetricId; name: string; description: string }> {
    return [
      MetricId.ANSWER_RELEVANCY,
      MetricId.CONTEXT_PRECISION,
      MetricId.FAITHFULNESS,
      MetricId.CONTEXT_RELEVANCE,
      MetricId.FACTUAL_CORRECTNESS,
    ].map(id => ({
      id,
      name: this.getMetricDisplayName(id),
      description: this.getMetricDescription(id),
    }));
  }

  /**
   * Get all available metrics for general evaluation
   */
  static getAllMetrics(): Array<{ id: MetricId; name: string; description: string }> {
    return Object.values(MetricId).map(id => ({
      id,
      name: this.getMetricDisplayName(id),
      description: this.getMetricDescription(id),
    }));
  }

  /**
   * Validate evaluation score
   */
  static isValidScore(score: number): boolean {
    return typeof score === 'number' && score >= 0 && score <= 1;
  }

  /**
   * Get score status based on threshold
   */
  static getScoreStatus(score: number, threshold: number = 0.7): "good" | "neutral" | "bad" {
    if (!this.isValidScore(score)) return "bad";

    if (score >= threshold + 0.1) return "good";
    if (score >= threshold - 0.1) return "neutral";
    return "bad";
  }

  /**
   * Format score for display
   */
  static formatScore(score: number): string {
    if (!this.isValidScore(score)) return "N/A";
    return (score * 100).toFixed(1) + "%";
  }

  /**
   * Calculate average score from multiple results
   */
  static calculateAverageScore(scores: number[]): number {
    if (scores.length === 0) return 0;
    const validScores = scores.filter(this.isValidScore);
    if (validScores.length === 0) return 0;

    return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
  }
}
