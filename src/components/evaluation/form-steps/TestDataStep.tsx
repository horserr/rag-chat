import React from 'react';
import { Box, Typography, TextField, FormControlLabel, Switch, Paper, Button } from '@mui/material';
import type { FormData } from '../types';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DatasetIcon from '@mui/icons-material/Dataset';

interface TestDataStepProps {
  formData: FormData;
  onFormChange: (field: string, value: unknown) => void;
  evaluationType: 'rag' | 'prompt';
}

const TestDataStep: React.FC<TestDataStepProps> = ({
  formData,
  onFormChange,
  evaluationType
}) => {
  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      {evaluationType === 'rag' ? (
        <>
          <Box sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3
          }}>
            <FileUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" gutterBottom>Upload Test Questions</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload a CSV or JSON file with test questions to evaluate against the knowledge base
            </Typography>
            <Button variant="outlined" startIcon={<FileUploadIcon />}>
              Upload File
            </Button>
          </Box>

          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Test Configuration</Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Success Threshold</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  type="number"
                  label="Threshold"
                  size="small"
                  value={formData.threshold}
                  onChange={(e) => onFormChange('threshold', parseFloat(e.target.value))}
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  sx={{ width: 100 }}
                />
                <Typography variant="body2" color="text.secondary">
                  (0 - 1.0)
                </Typography>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableRealTimeMonitoring}
                  onChange={(e) => onFormChange('enableRealTimeMonitoring', e.target.checked)}
                />
              }
              label="Enable real-time monitoring"
            />
          </Paper>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            label="Sample Input Variables"
            variant="outlined"
            multiline
            rows={3}
            placeholder="Enter sample variables in JSON format..."
            margin="normal"
          />

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>OR</Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
          </Box>

          <Box sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3
          }}>
            <DatasetIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" gutterBottom>Upload Test Dataset</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload a dataset with test cases in JSON format
            </Typography>
            <Button variant="outlined" startIcon={<FileUploadIcon />}>
              Upload Dataset
            </Button>
          </Box>

          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Evaluation Settings</Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Quality Threshold</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  type="number"
                  label="Threshold"
                  size="small"
                  value={formData.threshold}
                  onChange={(e) => onFormChange('threshold', parseFloat(e.target.value))}
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  sx={{ width: 100 }}
                />
                <Typography variant="body2" color="text.secondary">
                  (0 - 1.0)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default TestDataStep;
