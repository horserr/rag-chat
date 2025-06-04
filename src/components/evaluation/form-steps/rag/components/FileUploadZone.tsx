import React from "react";
import {
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { DATASET_VALIDATION } from "../../../../../models/evaluation-form";

interface FileUploadZoneProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload }) => {
  return (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "action.hover",
        },
      }}
      component="label"
    >
      <input
        type="file"
        hidden
        accept=".json,.jsonl,.csv"
        onChange={onFileUpload}
      />
      <UploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        点击上传数据集文件
      </Typography>
      <Typography variant="body2" color="text.secondary">
        支持 JSON, JSONL, CSV 格式，最大{" "}
        {DATASET_VALIDATION.maxSize / (1024 * 1024)}MB
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
  );
};

export default FileUploadZone;
