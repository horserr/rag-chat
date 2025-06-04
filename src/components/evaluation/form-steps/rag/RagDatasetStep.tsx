
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import type { RagFormData } from '../../types/evaluation-form';
import { DATASET_VALIDATION } from '../../types/evaluation-form';

interface RagDatasetStepProps {
  formData: RagFormData;
  onFormChange: (field: keyof RagFormData, value: unknown) => void;
}

const RagDatasetStep: React.FC<RagDatasetStepProps> = ({
  formData,
  onFormChange,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);

  const validateFile = useCallback(async (file: File) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Check file size
      if (file.size > DATASET_VALIDATION.maxSize) {
        throw new Error(`文件大小超过限制 (${DATASET_VALIDATION.maxSize / (1024 * 1024)}MB)`);
      }      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!DATASET_VALIDATION.allowedTypes.includes(fileExtension as '.json' | '.jsonl' | '.csv')) {
        throw new Error(`不支持的文件类型，支持: ${DATASET_VALIDATION.allowedTypes.join(', ')}`);
      }

      // Parse and validate content
      const content = await file.text();
      let samples: Record<string, unknown>[] = [];      if (fileExtension === '.json') {
        try {
          const data = JSON.parse(content);
          samples = Array.isArray(data) ? data : [data];        } catch {
          // Try to handle comma-separated JSON objects (invalid JSON but common mistake)
          try {
            const wrappedContent = `[${content}]`;
            const data = JSON.parse(wrappedContent);
            samples = Array.isArray(data) ? data : [data];
          } catch {
            // If still fails, try parsing as JSONL-like format (objects separated by commas)
            const objectStrings = content.split(/},\s*{/).map((str, index, arr) => {
              if (index === 0 && !str.startsWith('{')) str = '{' + str;
              if (index === arr.length - 1 && !str.endsWith('}')) str = str + '}';
              if (index > 0 && index < arr.length - 1) str = '{' + str + '}';
              return str;
            });
            samples = objectStrings
              .filter(str => str.trim())
              .map(str => JSON.parse(str));
          }
        }
      } else if (fileExtension === '.jsonl') {
        samples = content
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      } else if (fileExtension === '.csv') {
        // Basic CSV parsing - in production, use a proper CSV parser
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        samples = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {} as Record<string, unknown>);
          });
      }

      // Validate required fields based on evaluation type
      if (formData.evaluationType) {
        const requiredFields = DATASET_VALIDATION.requiredFields[formData.evaluationType];
        const missingFields = requiredFields.filter(field =>
          !samples[0] || !(field in samples[0])
        );

        if (missingFields.length > 0) {
          throw new Error(`缺少必需字段: ${missingFields.join(', ')}`);
        }
      }

      // Set preview data (first 5 samples)
      setPreviewData(samples.slice(0, 5));

      // Update form data
      onFormChange('datasetFile', file);
      onFormChange('samples', samples);

    } catch (error) {
      setValidationError(error instanceof Error ? error.message : '文件验证失败');
      setPreviewData(null);
    } finally {
      setIsValidating(false);
    }
  }, [formData.evaluationType, onFormChange]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateFile(file);
    }
  }, [validateFile]);

  const handleRemoveFile = useCallback(() => {
    onFormChange('datasetFile', undefined);
    onFormChange('samples', undefined);
    setPreviewData(null);
    setValidationError(null);
  }, [onFormChange]);

  const getRequiredFieldsHelp = () => {
    if (!formData.evaluationType) return null;

    const fields = DATASET_VALIDATION.requiredFields[formData.evaluationType];
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>{formData.evaluationType === 'single_turn' ? '单轮评估' :
                   formData.evaluationType === 'custom' ? '自定义评估' : '多轮评估'}</strong>
          需要以下字段：
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {fields.map(field => (
            <Chip key={field} label={field} size="small" />
          ))}
        </Box>
      </Alert>
    );
  };

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        数据集上传
      </Typography>

      {getRequiredFieldsHelp()}

      {!formData.datasetFile ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept=".json,.jsonl,.csv"
            onChange={handleFileUpload}
          />
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            点击上传数据集文件
          </Typography>
          <Typography variant="body2" color="text.secondary">
            支持 JSON, JSONL, CSV 格式，最大 {DATASET_VALIDATION.maxSize / (1024 * 1024)}MB
          </Typography>
          <Button
            variant="outlined"
            component="span"
            sx={{ mt: 2 }}
            startIcon={<UploadIcon />}
          >
            选择文件
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {formData.datasetFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(formData.datasetFile.size / 1024).toFixed(1)} KB
                {formData.samples && ` • ${formData.samples.length} 样本`}
              </Typography>
            </Box>
            <IconButton onClick={handleRemoveFile} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          {isValidating && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>验证文件中...</Typography>
              <LinearProgress />
            </Box>
          )}

          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          {previewData && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PreviewIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle2">数据预览 (前5条)</Typography>
              </Box>
              <List dense>
                {previewData.map((sample, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="pre" sx={{
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.875rem',
                          maxHeight: 100,
                          overflow: 'auto',
                        }}>
                          {JSON.stringify(sample, null, 2)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default RagDatasetStep;
