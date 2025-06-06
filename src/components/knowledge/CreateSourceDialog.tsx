import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { CreateSourceDto } from '../../models/knowledge';

interface CreateSourceDialogProps {
  open: boolean;
  onClose: () => void;
  sourceData: CreateSourceDto;
  onSourceDataChange: (data: CreateSourceDto) => void;
  onCreateSource: () => void;
  isCreating?: boolean;
}

const CreateSourceDialog: React.FC<CreateSourceDialogProps> = ({
  open,
  onClose,
  sourceData,
  onSourceDataChange,
  onCreateSource,
  isCreating = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        Create New Knowledge Source
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          label="Title"
          value={sourceData.title}
          onChange={(e) => onSourceDataChange({ ...sourceData, title: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Posted By"
          value={sourceData.posted_by}
          onChange={(e) => onSourceDataChange({ ...sourceData, posted_by: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="text">Cancel</Button>
        <Button
          onClick={onCreateSource}
          variant="contained"
          disabled={isCreating}
          sx={{ borderRadius: 2 }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSourceDialog;
