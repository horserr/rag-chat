import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { EVALUATION_CONSTANTS } from "./constants";

interface NewEvaluationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  promptValue: string;
  onPromptChange: (value: string) => void;
  placeholder: string;
  helpText: string;
  isSubmitting?: boolean;
  disabled?: boolean;
}

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const NewEvaluationDialog: React.FC<NewEvaluationDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  promptValue,
  onPromptChange,
  placeholder,
  helpText,
  isSubmitting = false,
  disabled = false,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={EVALUATION_CONSTANTS.LAYOUT.DIALOG_MAX_WIDTH}
    fullWidth
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Prompt 内容"
        multiline
        rows={6}
        fullWidth
        variant="outlined"
        value={promptValue}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={placeholder}
        sx={{ mt: 2 }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {helpText}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>取消</Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={20} /> : '开始评估'}
      </Button>
    </DialogActions>
  </Dialog>
);

export const DetailDialog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  title,
  children,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={EVALUATION_CONSTANTS.LAYOUT.DIALOG_MAX_WIDTH}
    fullWidth
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>关闭</Button>
    </DialogActions>
  </Dialog>
);
