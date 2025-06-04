import React from 'react';
import {
  Paper,
  Typography,
} from '@mui/material';

interface ContentSectionProps {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Display a content section with title and formatted text
 */
export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  content,
  variant = 'primary',
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Typography
          variant={variant === 'primary' ? 'body1' : 'body2'}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {content}
        </Typography>
      </Paper>
    </>
  );
};

interface PromptDisplayProps {
  prompt: string;
}

/**
 * Display prompt content
 */
export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => (
  <ContentSection title="Prompt 内容:" content={prompt} />
);

interface ResponseDisplayProps {
  title: string;
  response: string;
}

/**
 * Display response content (ground truth or model response)
 */
export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  title,
  response
}) => (
  <ContentSection title={title} content={response} variant="secondary" />
);
