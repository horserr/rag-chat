import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import type { FormData } from '../types';

interface ReviewStepProps {
  formData: FormData;
  evaluationType: 'rag' | 'prompt';
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  evaluationType
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{formData.title || 'Untitled Evaluation'}</Typography>
          <Chip
            label={evaluationType === 'rag' ? 'RAG' : 'PROMPT'}
            size="small"
            sx={{
              bgcolor: evaluationType === 'rag' ? 'rgba(165, 111, 111, 0.2)' : 'rgba(144, 158, 125, 0.2)',
              color: evaluationType === 'rag' ? '#A56F6F' : '#606E52',
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formData.description || 'No description provided'}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Selected Metrics</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {formData.metrics.length > 0 ? (
              formData.metrics.map((metric) => (
                <Chip key={metric} label={metric} size="small" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No metrics selected</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Configuration</Typography>
          <Typography variant="body2">
            • Success Threshold: {formData.threshold}
          </Typography>
          {evaluationType === 'rag' && (
            <Typography variant="body2">
              • Dataset: {formData.dataset ? formData.dataset.replace('kb-', '').charAt(0).toUpperCase() + formData.dataset.replace('kb-', '').slice(1) : 'Not selected'}
            </Typography>
          )}
          <Typography variant="body2">
            • Real-time Monitoring: {formData.enableRealTimeMonitoring ? 'Enabled' : 'Disabled'}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ bgcolor: '#f8f8f8', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center' }}>
        <AssessmentIcon color="primary" sx={{ mr: 2 }} />
        <Typography variant="body2">
          Once created, this evaluation will be automatically scheduled and results will be available in the dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReviewStep;
