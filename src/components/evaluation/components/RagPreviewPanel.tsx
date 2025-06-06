import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Task as TaskIcon,
  Category as TypeIcon,
  Analytics as MetricIcon,
  Dataset as DataIcon,
} from '@mui/icons-material';
import type { RagFormData } from '../../../models/evaluation-form';
import { RAG_METRICS } from '../../../models/evaluation-form';
import GenericPreviewPanel from '../../../components/common/GenericPreviewPanel';
import type { PreviewItem } from '../../../components/common/GenericPreviewPanel';

interface RagPreviewPanelProps {
  formData: RagFormData;
  currentStep: number;
}

const RagPreviewPanel: React.FC<RagPreviewPanelProps> = ({ formData, currentStep }) => {
  const getMetricName = () => {
    if (formData.evaluationType === 'single_turn' && formData.metricId !== undefined) {
      return RAG_METRICS[formData.metricId]?.name || 'Unknown Metric';
    }
    return formData.customMetric || null;
  };

  const getEvaluationTypeLabel = () => {
    switch (formData.evaluationType) {
      case 'single_turn': return 'Single-turn Evaluation';
      case 'custom': return 'Custom Evaluation';
      case 'multi_turn': return 'Multi-turn Evaluation';
      default: return null;
    }
  };

  // Create the items array for the preview panel
  const previewItems: PreviewItem[] = [
    {
      icon: <TaskIcon fontSize="small" color="action" />,
      title: "Task Name",
      content: formData.taskName ? (
        <Typography variant="body2">{formData.taskName}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Not set
        </Typography>
      ),
      showSkeleton: currentStep === 0 && !formData.taskName
    }
  ];

  if (formData.description) {
    previewItems.push({
      icon: <Box sx={{ width: 20 }} />,
      title: "Description",
      content: (
        <Typography variant="body2" color="text.secondary">
          {formData.description}
        </Typography>
      )
    });
  }

  previewItems.push({
    icon: <TypeIcon fontSize="small" color="action" />,
    title: "Evaluation Type",
    content: getEvaluationTypeLabel() ? (
      <Chip
        label={getEvaluationTypeLabel()}
        size="small"
        color="primary"
        variant="outlined"
      />
    ) : (
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        Not selected
      </Typography>
    ),
    showSkeleton: currentStep === 0 && !formData.evaluationType
  });

  previewItems.push({
    icon: <MetricIcon fontSize="small" color="action" />,
    title: "Evaluation Metric",
    content: getMetricName() ? (
      <Typography variant="body2">{getMetricName()}</Typography>
    ) : (
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        Not set
      </Typography>
    ),
    showSkeleton: currentStep === 0 && !getMetricName()
  });

  if (formData.customPrompt) {
    previewItems.push({
      icon: <Box sx={{ width: 20 }} />,
      title: "Custom Prompt",
      content: (
        <Typography
          variant="body2"
          sx={{
            p: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            maxHeight: 80,
            overflow: 'auto',
          }}
        >
          {formData.customPrompt}
        </Typography>
      )
    });
  }

  previewItems.push({
    icon: <DataIcon fontSize="small" color="action" />,
    title: "Dataset",
    content: formData.datasetFile ? (
      <Box>
        <Typography variant="body2">
          {formData.datasetFile.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(formData.datasetFile.size / 1024).toFixed(1)} KB
          {formData.samples && ` • ${formData.samples.length} samples`}
        </Typography>
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        Not uploaded
      </Typography>
    ),
    showSkeleton: currentStep === 1 && !formData.datasetFile
  });

  const progressIndicator = (
    <Box>
      <Typography variant="caption" color="text.secondary">
        Configuration Progress: {currentStep + 1}/3
      </Typography>
      <Box sx={{
        width: '100%',
        height: 4,
        bgcolor: 'action.hover',
        borderRadius: 2,
        mt: 0.5,
        overflow: 'hidden',
      }}>
        <Box sx={{
          width: `${((currentStep + 1) / 3) * 100}%`,
          height: '100%',
          bgcolor: 'primary.main',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </Box>
    </Box>
  );

  return (
    <GenericPreviewPanel
      title="Evaluation Configuration Preview"
      titleIcon={<TaskIcon color="primary" />}
      items={previewItems}
      progressIndicator={progressIndicator}
    />
  );
};

export default RagPreviewPanel;
