import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { FileDto } from '../../models/knowledge';

interface FilesTabProps {
  files: FileDto[];
  onFileMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
}

const FilesTab: React.FC<FilesTabProps> = ({
  files,
  onFileMenuOpen,
}) => {
  return (
    <>
      {files.length ? (
        <List>
          {files.map((file) => (
            <ListItem key={file.id} divider>
              <ListItemText
                primary={file.attachment_name || file.id}
                secondary={`${file.content_type} • ${new Date(file.created_at).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={(e) => onFileMenuOpen(e, file.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="text.secondary">No files available for this source</Typography>
        </Box>
      )}
    </>
  );
};

export { FilesTab };
export default FilesTab;
