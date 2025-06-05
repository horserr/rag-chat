import React from 'react';
import {
  Box,
  Chip,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';
import type { PromptEvaluation } from '../../../models/prompt-evaluation';

interface MetricChipsProps {
  evaluation: PromptEvaluation;
  showPromptScore?: boolean;
}

/**
 * Displays evaluation metrics as chips
 */
export const MetricChips: React.FC<MetricChipsProps> = ({
  evaluation,
  showPromptScore = false,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {showPromptScore && (
        <Chip
          icon={<AnalyticsIcon />}
          label={`Prompt 评分: ${evaluation.promptScore}`}
          variant="outlined"
        />
      )}
      <Chip
        icon={<AnalyticsIcon />}
        label={`BLEU4: ${evaluation.bleu4Score.toFixed(4)}`}
        variant="outlined"
      />
      <Chip
        icon={<TrendIcon />}
        label={`语义相似度: ${evaluation.semanticSimilarity.toFixed(4)}`}
        variant="outlined"
      />
      <Chip
        icon={<AnalyticsIcon />}
        label={`词汇多样性: ${evaluation.lexicalDiversity.toFixed(4)}`}
        variant="outlined"
      />
    </Box>
  );
};
