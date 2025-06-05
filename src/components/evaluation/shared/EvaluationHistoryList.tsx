import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import { getScoreColor } from './utils';
import type { PromptEvaluation } from '../../../models/prompt-evaluation';

interface EvaluationHistoryListProps {
  evaluationHistory: PromptEvaluation[];
  isLoading: boolean;
  currentEvaluationId?: number;
  onEvaluationClick: (evaluationId: number) => void;
  maxItems?: number;
}

/**
 * Displays a list of evaluation history items
 */
export const EvaluationHistoryList: React.FC<EvaluationHistoryListProps> = ({
  evaluationHistory,
  isLoading,
  currentEvaluationId,
  onEvaluationClick,
  maxItems = 5,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={60} />
        ))}
      </Box>
    );
  }

  if (evaluationHistory.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        暂无评估记录
      </Typography>
    );
  }

  return (
    <List>
      {evaluationHistory
        .slice(0, maxItems)
        .map((evalItem: PromptEvaluation) => (
          <ListItem
            key={evalItem.evalId}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              mb: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              bgcolor:
                currentEvaluationId === evalItem.evalId
                  ? "action.selected"
                  : "inherit",
            }}
            onClick={() => onEvaluationClick(evalItem.evalId)}
          >
            <ListItemText
              primary={`评估 #${evalItem.evalId}`}
              secondary={
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={evalItem.promptScore}
                    size="small"
                    color={
                      getScoreColor(evalItem.promptScore) as
                        | "success"
                        | "warning"
                        | "error"
                    }
                  />
                  <Chip
                    label={`BLEU4: ${evalItem.bleu4Score.toFixed(3)}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
    </List>
  );
};
