import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { FormData } from '../types';

interface ConfigurationStepProps {
  formData: FormData;
  onFormChange: (field: string, value: unknown) => void;
  evaluationType: 'rag' | 'prompt';
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  formData,
  onFormChange,
  evaluationType
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <TextField
        fullWidth
        label="Evaluation Title"
        variant="outlined"
        value={formData.title}
        onChange={(e) => onFormChange('title', e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        value={formData.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        margin="normal"
        multiline
        rows={3}
      />
      {evaluationType === 'rag' && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Knowledge Base</InputLabel>
          <Select
            value={formData.dataset}
            label="Knowledge Base"
            onChange={(e) => onFormChange('dataset', e.target.value)}
          >
            <MenuItem value="kb-finance">Finance Documents</MenuItem>
            <MenuItem value="kb-tech">Technical Documentation</MenuItem>
            <MenuItem value="kb-legal">Legal Corpus</MenuItem>
            <MenuItem value="kb-custom">Custom Knowledge Base</MenuItem>
          </Select>
        </FormControl>
      )}
      {evaluationType === 'prompt' && (
        <TextField
          fullWidth
          label="Base Prompt Template"
          variant="outlined"
          multiline
          rows={4}
          placeholder="Enter your base prompt template here..."
          margin="normal"
        />
      )}
    </Box>
  );
};

export default ConfigurationStep;
