import React from 'react';
import {
  Box,
  Paper,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Typography,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import type { SourceDto } from '../../models/knowledge';

interface KnowledgeSourcesListProps {
  sources: SourceDto[];
  selectedSource: SourceDto | null;
  isLoading: boolean;
  onSourceSelect: (source: SourceDto) => void;
  onEditSource: (source: SourceDto) => void;
  onDeleteSource: (sourceId: number) => void;
}

const KnowledgeSourcesList: React.FC<KnowledgeSourcesListProps> = ({
  sources,
  selectedSource,
  isLoading,
  onSourceSelect,
  onEditSource,
  onDeleteSource,
}) => {
  return (
    <Box sx={{ flex: '0 0 33.333%' }}>
      <Paper sx={{
        height: '100%',
        overflow: 'auto',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DocumentIcon color="primary" />
          <Typography variant="h6" fontWeight={500}>Knowledge Sources</Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : sources.length ? (
          <List disablePadding>
            {sources.map((source) => (
              <React.Fragment key={source.id}>
                <ListItemButton
                  selected={selectedSource?.id === source.id}
                  onClick={() => onSourceSelect(source)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      }
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={selectedSource?.id === source.id ? 600 : 400}>
                        {source.title}
                      </Typography>
                    }
                    secondary={`By ${source.posted_by} • ${new Date(source.created_at).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSource(source);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSource(source.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No knowledge sources available</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export { KnowledgeSourcesList };
export default KnowledgeSourcesList;
