import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Chip,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Task as TaskIcon,
  Category as TypeIcon,
  Analytics as MetricIcon,
  Dataset as DataIcon,
} from '@mui/icons-material';
import type { RagFormData } from '../types/evaluation-form';
import { RAG_METRICS } from '../types/evaluation-form';

interface RagPreviewPanelProps {
  formData: RagFormData;
  currentStep: number;
}

const RagPreviewPanel: React.FC<RagPreviewPanelProps> = ({ formData, currentStep }) => {
  const getMetricName = () => {
    if (formData.evaluationType === 'single_turn' && formData.metricId !== undefined) {
      return RAG_METRICS[formData.metricId]?.name || '未知指标';
    }
    return formData.customMetric || null;
  };

  const getEvaluationTypeLabel = () => {
    switch (formData.evaluationType) {
      case 'single_turn': return '单轮对话评估';
      case 'custom': return '自定义评估';
      case 'multi_turn': return '多轮对话评估';
      default: return null;
    }
  };

  const PreviewItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    showSkeleton?: boolean;
  }> = ({ icon, title, content, showSkeleton = false }) => (
    <ListItem sx={{ px: 0, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 2 }}>
        <Box sx={{ mt: 0.5 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          {showSkeleton ? (
            <Skeleton variant="text" width="80%" />
          ) : (
            content
          )}
        </Box>
      </Box>
    </ListItem>
  );

  return (
    <Paper sx={{ p: 3, height: 'fit-content', borderRadius: 2, bgcolor: 'background.default' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TaskIcon color="primary" />
        评估配置预览
      </Typography>

      <List sx={{ p: 0 }}>
        <PreviewItem
          icon={<TaskIcon fontSize="small" color="action" />}
          title="任务名称"
          content={
            formData.taskName ? (
              <Typography variant="body2">{formData.taskName}</Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                未设置
              </Typography>
            )
          }
          showSkeleton={currentStep === 0 && !formData.taskName}
        />

        {formData.description && (
          <PreviewItem
            icon={<Box sx={{ width: 20 }} />}
            title="描述"
            content={
              <Typography variant="body2" color="text.secondary">
                {formData.description}
              </Typography>
            }
          />
        )}

        <Divider sx={{ my: 1 }} />

        <PreviewItem
          icon={<TypeIcon fontSize="small" color="action" />}
          title="评估类型"
          content={
            getEvaluationTypeLabel() ? (
              <Chip
                label={getEvaluationTypeLabel()}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                未选择
              </Typography>
            )
          }
          showSkeleton={currentStep === 0 && !formData.evaluationType}
        />

        <PreviewItem
          icon={<MetricIcon fontSize="small" color="action" />}
          title="评估指标"
          content={
            getMetricName() ? (
              <Typography variant="body2">{getMetricName()}</Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                未设置
              </Typography>
            )
          }
          showSkeleton={currentStep === 0 && !getMetricName()}
        />

        {formData.customPrompt && (
          <PreviewItem
            icon={<Box sx={{ width: 20 }} />}
            title="自定义提示词"
            content={
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
            }
          />
        )}

        <Divider sx={{ my: 1 }} />

        <PreviewItem
          icon={<DataIcon fontSize="small" color="action" />}
          title="数据集"
          content={
            formData.datasetFile ? (
              <Box>
                <Typography variant="body2">
                  {formData.datasetFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(formData.datasetFile.size / 1024).toFixed(1)} KB
                  {formData.samples && ` • ${formData.samples.length} 样本`}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                未上传
              </Typography>
            )
          }
          showSkeleton={currentStep === 1 && !formData.datasetFile}
        />
      </List>

      {/* Progress indicator */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          配置进度: {currentStep + 1}/3
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
    </Paper>
  );
};

export default RagPreviewPanel;
