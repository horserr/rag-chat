import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Task as TaskIcon,
  Description as PromptIcon,
  Analytics as StatsIcon,
} from '@mui/icons-material';
import type { PromptFormData } from '../types/evaluation-form';

interface PromptPreviewPanelProps {
  formData: PromptFormData;
  currentStep: number;
}

const PromptPreviewPanel: React.FC<PromptPreviewPanelProps> = ({ formData, currentStep }) => {
  const promptStats = {
    characters: formData.prompt?.length || 0,
    words: formData.prompt?.split(/\s+/).filter(word => word.length > 0).length || 0,
    lines: formData.prompt?.split('\n').length || 0,
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
        Prompt 评估预览
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

        <Divider sx={{ my: 1 }} />

        <PreviewItem
          icon={<PromptIcon fontSize="small" color="action" />}
          title="Prompt 内容"
          content={
            formData.prompt ? (
              <Typography
                variant="body2"
                sx={{
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  maxHeight: 120,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                {formData.prompt}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                未输入
              </Typography>
            )
          }
          showSkeleton={currentStep === 0 && !formData.prompt}
        />

        {formData.prompt && (
          <>
            <Divider sx={{ my: 1 }} />
            <PreviewItem
              icon={<StatsIcon fontSize="small" color="action" />}
              title="统计信息"
              content={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
          </>
        )}
      </List>

      {/* Progress indicator */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          配置进度: {currentStep + 1}/2
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
            width: `${((currentStep + 1) / 2) * 100}%`,
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

export default PromptPreviewPanel;
