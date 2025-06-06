import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import type { KnowledgeFileUpload } from '../../models/knowledge';

interface KnowledgeFileUploaderProps {
  onUpload: (knowledgeFile: KnowledgeFileUpload) => Promise<void>;
  isUploading: boolean;
}

const KnowledgeFileUploader: React.FC<KnowledgeFileUploaderProps> = ({
  onUpload,
  isUploading,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<KnowledgeFileUpload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setFile(selectedFile);
    setFileContent(null);
    setError(null);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result === 'string') {
          const parsedContent = JSON.parse(event.target.result) as KnowledgeFileUpload;

          // Validate minimum required fields
          if (!parsedContent.source) {
            throw new Error('Invalid file format: missing "source" field');
          }

          if (!parsedContent.resource || !parsedContent.resource.text) {
            throw new Error('Invalid file format: missing "resource" field or "resource.text"');
          }

          setFileContent(parsedContent);
        }
      } catch (err) {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setFileContent(null);
      }
    };

    reader.onerror = () => {
      setError('Error reading the file');
    };

    reader.readAsText(selectedFile);
  };

  const handleSubmit = async () => {
    if (!fileContent) return;

    try {
      await onUpload(fileContent);
      // Reset after successful upload
      setFile(null);
      setFileContent(null);
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          border: '2px dashed rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <input
          type="file"
          accept=".json"
          id="knowledge-file-input"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="knowledge-file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Select Knowledge File'}
          </Button>
        </label>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Upload a JSON file containing source, resource, and optional files.
        </Typography>

        {file && (
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle2">
              Selected file: {file.name}
            </Typography>
          </Box>
        )}
      </Paper>      {fileContent && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isUploading}
          sx={{ mt: 2 }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              Uploading...
            </>
          ) : (
            'Upload Knowledge'
          )}
        </Button>
      )}
    </Box>
  );
};

export default KnowledgeFileUploader;
