import React from 'react';
import {
  Alert,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { getStatusColor } from './utils';
import type { EvaluationListItem } from '../../../models/rag-evaluation';

interface RagEvaluationHistoryListProps {
  evaluationHistory: EvaluationListItem[];
  isLoading: boolean;
  currentEvaluationId?: string;
  onEvaluationClick: (evaluationId: string) => void;
}

/**
 * Displays a list of RAG evaluation history items
 */
export const RagEvaluationHistoryList: React.FC<RagEvaluationHistoryListProps> = ({
  evaluationHistory,
  isLoading,
  currentEvaluationId,
  onEvaluationClick,
}) => {
  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={60}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (evaluationHistory.length === 0) {
    return <Alert severity="info">暂无评估历史记录</Alert>;
  }

  return (
    <List dense>
      {evaluationHistory.map((evaluation) => (
        <ListItem
          key={evaluation.id}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            mb: 1,
            bgcolor:
              evaluation.id === currentEvaluationId
                ? "action.selected"
                : "background.paper",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => onEvaluationClick(evaluation.id)}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2">
                  评估 #{evaluation.id.slice(0, 8)}
                </Typography>
                <Chip
                  label={evaluation.status}
                  color={getStatusColor(evaluation.status)}
                  size="small"
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  结果: {evaluation.result !== undefined ? (evaluation.result * 100).toFixed(1) : 'N/A'}% |{' '}
                  {new Date(evaluation.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
