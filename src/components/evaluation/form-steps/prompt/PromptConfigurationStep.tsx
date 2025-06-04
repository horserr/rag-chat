
import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import type { PromptFormData } from '../../types/evaluation-form';

interface PromptConfigurationStepProps {
  formData: PromptFormData;
  onFormChange: (field: keyof PromptFormData, value: unknown) => void;
}

const PromptConfigurationStep: React.FC<PromptConfigurationStepProps> = ({
  formData,
  onFormChange,
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Prompt 评估配置
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Prompt 评估将分析您的提示词质量，包括语义相似度、词汇多样性、编辑距离等多个维度的评分。
        </Typography>
      </Alert>

      <TextField
        fullWidth
        label="任务名称"
        value={formData.taskName}
        onChange={(e) => onFormChange('taskName', e.target.value)}
        margin="normal"
        required
        helperText="为您的 Prompt 评估任务起一个描述性的名称"
      />

      <TextField
        fullWidth
        label="要评估的 Prompt"
        value={formData.prompt}
        onChange={(e) => onFormChange('prompt', e.target.value)}
        margin="normal"
        multiline
        rows={8}
        required
        helperText="输入您想要评估的提示词内容"
        placeholder="请输入您的 prompt 内容..."
      />

      {formData.prompt && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            统计信息
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              字符数: {formData.prompt.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              词数: {formData.prompt.split(/\s+/).filter(word => word.length > 0).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              行数: {formData.prompt.split('\n').length}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PromptConfigurationStep;
