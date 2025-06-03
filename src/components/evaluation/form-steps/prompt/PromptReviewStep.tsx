
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Task as TaskIcon,
  Description as PromptIcon,
  CheckCircle as CheckIcon,
  Analytics as StatsIcon,
} from '@mui/icons-material';
import type { PromptFormData } from '../../types/evaluation-form';

interface PromptReviewStepProps {
  formData: PromptFormData;
}

const PromptReviewStep: React.FC<PromptReviewStepProps> = ({ formData }) => {
  const promptStats = {
    characters: formData.prompt?.length || 0,
    words: formData.prompt?.split(/\s+/).filter(word => word.length > 0).length || 0,
    lines: formData.prompt?.split('\n').length || 0,
  };

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        确认 Prompt 评估配置
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

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemIcon>
              <PromptIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Prompt 内容"
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: 200,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  {formData.prompt || '未设置'}
                </Typography>
              }
            />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemIcon>
              <StatsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="统计信息"
              secondary={
                <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    字符数: {promptStats.characters}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    词数: {promptStats.words}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    行数: {promptStats.lines}
                  </Typography>
                </Box>
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
              点击"创建评估"开始 Prompt 评估，评估可能需要较长时间完成
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PromptReviewStep;
