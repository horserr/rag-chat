import React from 'react';
import {
  Box,
  TextField,
  Button,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';

interface ResourceContentTabProps {
  resourceText: string;
  onResourceTextChange: (text: string) => void;
  onSaveResource: () => void;
  isSaving?: boolean;
}

const ResourceContentTab: React.FC<ResourceContentTabProps> = ({
  resourceText,
  onResourceTextChange,
  onSaveResource,
  isSaving = false,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        multiline
        rows={12}
        value={resourceText}
        onChange={(e) => onResourceTextChange(e.target.value)}
        placeholder="Enter resource content..."
        variant="outlined"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          }
        }}
      />
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onSaveResource}
        disabled={isSaving}
        sx={{ alignSelf: 'flex-end', borderRadius: 2 }}
      >
        Save Resource
      </Button>
    </Box>
  );
};

export { ResourceContentTab };
export default ResourceContentTab;
