import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { UpdateSourceDto } from '../../models/knowledge';

interface EditSourceDialogProps {
  open: boolean;
  onClose: () => void;
  sourceData: UpdateSourceDto | null;
  onSourceDataChange: (data: UpdateSourceDto) => void;
  onEditSource: () => void;
  isEditing?: boolean;
}

const EditSourceDialog: React.FC<EditSourceDialogProps> = ({
  open,
  onClose,
  sourceData,
  onSourceDataChange,
  onEditSource,
  isEditing = false,
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
        Edit Knowledge Source
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {sourceData && (
          <>
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
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="text">Cancel</Button>
        <Button
          onClick={onEditSource}
          variant="contained"
          disabled={isEditing}
          sx={{ borderRadius: 2 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSourceDialog;
