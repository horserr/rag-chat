import React from 'react';
import {
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface FileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onDeleteFile: () => void;
}

const FileMenu: React.FC<FileMenuProps> = ({
  anchorEl,
  onClose,
  onDeleteFile,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 1, boxShadow: 3 } }}
    >
      <MenuItem onClick={onDeleteFile} sx={{ color: 'error.main' }}>
        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
        Delete
      </MenuItem>
    </Menu>
  );
};

export default FileMenu;
