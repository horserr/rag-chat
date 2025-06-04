import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface FileInfoDisplayProps {
  file: File;
  samplesCount?: number;
  isValidating: boolean;
  validationError: string | null;
  onRemoveFile: () => void;
}

const FileInfoDisplay: React.FC<FileInfoDisplayProps> = ({
  file,
  samplesCount,
  isValidating,
  validationError,
  onRemoveFile,
}) => {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {file.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(file.size / 1024).toFixed(1)} KB
            {samplesCount && ` • ${samplesCount} 样本`}
          </Typography>
        </Box>
        <IconButton onClick={onRemoveFile} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      {isValidating && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            验证文件中...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}
    </Paper>
  );
};

export default FileInfoDisplay;
