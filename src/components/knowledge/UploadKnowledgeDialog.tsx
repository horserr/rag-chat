import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import type { KnowledgeFileUpload } from '../../models/knowledge';

interface UploadKnowledgeDialogProps {
  open: boolean;
  onClose: () => void;
  uploadFileContent: KnowledgeFileUpload | null;
  onConfirmUpload: () => void;
  isUploading?: boolean;
}

const UploadKnowledgeDialog: React.FC<UploadKnowledgeDialogProps> = ({
  open,
  onClose,
  uploadFileContent,
  onConfirmUpload,
  isUploading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        Upload Knowledge Data
      </DialogTitle>
      <DialogContent>
        {uploadFileContent && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">File Preview:</Typography>
            <pre style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px',
              border: '1px solid #e0e0e0'
            }}>
              {JSON.stringify(uploadFileContent, null, 2)}
            </pre>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="text">Cancel</Button>
        <Button
          onClick={onConfirmUpload}
          variant="contained"
          disabled={isUploading}
          sx={{ borderRadius: 2 }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadKnowledgeDialog;
