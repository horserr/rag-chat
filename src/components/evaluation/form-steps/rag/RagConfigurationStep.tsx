
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  FormHelperText,
} from '@mui/material';
import type { RagFormData } from '../../types/evaluation-form';
import { RAG_METRICS } from '../../types/evaluation-form';

interface RagConfigurationStepProps {
  formData: RagFormData;
  onFormChange: (field: keyof RagFormData, value: unknown) => void;
}

const RagConfigurationStep: React.FC<RagConfigurationStepProps> = ({
  formData,
  onFormChange,
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        基本配置
      </Typography>

      <TextField
        fullWidth
        label="任务名称"
        value={formData.taskName}
        onChange={(e) => onFormChange('taskName', e.target.value)}
        margin="normal"
        required
        helperText="为您的RAG评估任务起一个描述性的名称"
      />

      <TextField
        fullWidth
        label="任务描述"
        value={formData.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        margin="normal"
        multiline
        rows={3}
        helperText="描述此次评估的目的和背景"
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>评估类型</InputLabel>
        <Select
          value={formData.evaluationType || ''}
          label="评估类型"
          onChange={(e) => onFormChange('evaluationType', e.target.value)}
        >
          <MenuItem value="single_turn">单轮对话评估</MenuItem>
          <MenuItem value="custom">自定义评估</MenuItem>
          <MenuItem value="multi_turn">多轮对话评估</MenuItem>
        </Select>
        <FormHelperText>
          {formData.evaluationType === 'single_turn' && '适用于单次问答的评估'}
          {formData.evaluationType === 'custom' && '使用自定义指标和提示词进行评估'}
          {formData.evaluationType === 'multi_turn' && '适用于多轮对话的评估'}
        </FormHelperText>
      </FormControl>

      {formData.evaluationType === 'single_turn' && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>评估指标</InputLabel>
          <Select
            value={formData.metricId ?? ''}
            label="评估指标"
            onChange={(e) => onFormChange('metricId', Number(e.target.value))}
          >
            {Object.entries(RAG_METRICS).map(([id, metric]) => (
              <MenuItem key={id} value={Number(id)}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {metric.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {(formData.evaluationType === 'custom' || formData.evaluationType === 'multi_turn') && (
        <>
          <TextField
            fullWidth
            label="自定义指标名称"
            value={formData.customMetric || ''}
            onChange={(e) => onFormChange('customMetric', e.target.value)}
            margin="normal"
            required
            helperText="例如：clarity, relevance, accuracy"
          />

          <TextField
            fullWidth
            label="自定义评估提示词"
            value={formData.customPrompt || ''}
            onChange={(e) => onFormChange('customPrompt', e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
            helperText="描述如何评估这个指标，系统将使用此提示词进行评估"
          />
        </>
      )}

      {formData.evaluationType && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`评估类型: ${
              formData.evaluationType === 'single_turn' ? '单轮对话' :
              formData.evaluationType === 'custom' ? '自定义评估' : '多轮对话'
            }`}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default RagConfigurationStep;
