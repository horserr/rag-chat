
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Task as TaskIcon,
  Category as TypeIcon,
  Analytics as MetricIcon,
  Dataset as DataIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import type { RagFormData } from '../../types/evaluation-form';
import { RAG_METRICS } from '../../types/evaluation-form';

interface RagReviewStepProps {
  formData: RagFormData;
}

const RagReviewStep: React.FC<RagReviewStepProps> = ({ formData }) => {
  const getMetricName = () => {
    if (formData.evaluationType === 'single_turn' && formData.metricId !== undefined) {
      return RAG_METRICS[formData.metricId]?.name || '未知指标';
    }
    return formData.customMetric || '未设置';
  };

  const getEvaluationTypeLabel = () => {
    switch (formData.evaluationType) {
      case 'single_turn': return '单轮对话评估';
      case 'custom': return '自定义评估';
      case 'multi_turn': return '多轮对话评估';
      default: return '未选择';
    }
  };

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        确认评估配置
      </Typography>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <TaskIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="任务名称"
              secondary={formData.taskName || '未设置'}
            />
          </ListItem>

          {formData.description && (
            <ListItem>
              <ListItemIcon>
                <Box sx={{ width: 24 }} />
              </ListItemIcon>
              <ListItemText
                primary="任务描述"
                secondary={formData.description}
              />
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemIcon>
              <TypeIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="评估类型"
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={getEvaluationTypeLabel()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <MetricIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="评估指标"
              secondary={getMetricName()}
            />
          </ListItem>

          {formData.customPrompt && (
            <ListItem>
              <ListItemIcon>
                <Box sx={{ width: 24 }} />
              </ListItemIcon>
              <ListItemText
                primary="自定义提示词"
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      p: 1,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                    }}
                  >
                    {formData.customPrompt}
                  </Typography>
                }
              />
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemIcon>
              <DataIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="数据集"
              secondary={
                formData.datasetFile ? (
                  <Box>
                    <Typography variant="body2">
                      文件: {formData.datasetFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      大小: {(formData.datasetFile.size / 1024).toFixed(1)} KB
                      {formData.samples && ` • ${formData.samples.length} 样本`}
                    </Typography>
                  </Box>
                ) : (
                  '未上传'
                )
              }
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckIcon sx={{ color: 'success.dark', mr: 2 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
              准备就绪
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.dark' }}>
              点击"创建评估"开始评估任务，这可能需要几分钟时间
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RagReviewStep;
