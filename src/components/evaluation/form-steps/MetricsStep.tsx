import React from 'react';
import { Box, Typography, Chip, TextField, Button, Paper } from '@mui/material';
import { animations } from '../types';
import type { FormData } from '../types';

interface MetricsStepProps {
  formData: FormData;
  onFormChange: (field: string, value: unknown) => void;
  onAddMetric: () => void;
  evaluationType: 'rag' | 'prompt';
}

const MetricsStep: React.FC<MetricsStepProps> = ({
  formData,
  onFormChange,
  onAddMetric,
  evaluationType
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select metrics to evaluate {evaluationType === 'rag' ? 'retrieval quality' : 'prompt effectiveness'}
      </Typography>

      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Standard Metrics</Typography>

        {evaluationType === 'rag' ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['Relevance', 'Context Precision', 'Answer Accuracy', 'Retrieval Speed', 'Citation Accuracy'].map((metric) => (
              <Chip
                key={metric}
                label={metric}
                onClick={() => {
                  if (!formData.metrics.includes(metric)) {
                    onFormChange('metrics', [...formData.metrics, metric]);
                  } else {
                    onFormChange('metrics', formData.metrics.filter(m => m !== metric));
                  }
                }}
                color={formData.metrics.includes(metric) ? "primary" : "default"}
                sx={{
                  transition: animations.hoverTransition,
                  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['Clarity', 'Consistency', 'Task Completion', 'Output Quality', 'Factual Accuracy'].map((metric) => (
              <Chip
                key={metric}
                label={metric}
                onClick={() => {
                  if (!formData.metrics.includes(metric)) {
                    onFormChange('metrics', [...formData.metrics, metric]);
                  } else {
                    onFormChange('metrics', formData.metrics.filter(m => m !== metric));
                  }
                }}
                color={formData.metrics.includes(metric) ? "primary" : "default"}
                sx={{
                  transition: animations.hoverTransition,
                  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }
                }}
              />
            ))}
          </Box>
        )}

        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Custom Metric</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            label="Add Custom Metric"
            value={formData.customMetric}
            onChange={(e) => onFormChange('customMetric', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={onAddMetric}
            disabled={!formData.customMetric}
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Selected Metrics</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {formData.metrics.length > 0 ? (
          formData.metrics.map((metric) => (
            <Chip
              key={metric}
              label={metric}
              onDelete={() => onFormChange(
                'metrics',
                formData.metrics.filter(m => m !== metric)
              )}
              color="primary"
              variant="outlined"
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">No metrics selected</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MetricsStep;
