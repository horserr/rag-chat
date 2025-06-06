import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Folder as FolderIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { SourceDto } from '../../../models/knowledge';
import type { ViewType } from '../KnowledgeExplorerLayout';

interface KnowledgeSourcesExplorerProps {
  sources: SourceDto[];
  selectedSource: SourceDto | null;
  isLoading: boolean;
  onSourceSelect: (source: SourceDto) => void;
  onEditSource: (source: SourceDto) => void;
  onDeleteSource: (sourceId: number) => void;
  viewType: ViewType;
}

const KnowledgeSourcesExplorer: React.FC<KnowledgeSourcesExplorerProps> = ({
  sources,
  selectedSource,
  isLoading,
  onSourceSelect,
  onEditSource,
  onDeleteSource,
  viewType,
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedSourceForMenu, setSelectedSourceForMenu] = React.useState<SourceDto | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, source: SourceDto) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSourceForMenu(source);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSourceForMenu(null);
  };

  const handleEdit = () => {
    if (selectedSourceForMenu) {
      onEditSource(selectedSourceForMenu);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedSourceForMenu) {
      onDeleteSource(selectedSourceForMenu.id);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (sources.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No knowledge sources available.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Create a new source to get started.
        </Typography>
      </Box>
    );
  }

  if (viewType === 'cards') {
    return (
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2
          }}
        >
          {sources.map((source) => (
            <Card
              key={source.id}
              sx={{
                cursor: 'pointer',
                border: selectedSource?.id === source.id ? '2px solid' : '1px solid',
                borderColor: selectedSource?.id === source.id ? 'primary.main' : 'divider',
                '&:hover': {
                  borderColor: 'primary.light',
                  boxShadow: 2,
                },
              }}
              onClick={() => onSourceSelect(source)}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FolderIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3" noWrap>
                    {source.title || 'Untitled Source'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {source.posted_by || 'Unknown author'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, source)}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  // List view
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <List dense sx={{ py: 0 }}>
        {sources.map((source) => (
          <ListItemButton
            key={source.id}
            selected={selectedSource?.id === source.id}
            onClick={() => onSourceSelect(source)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <FolderIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={source.title || 'Untitled Source'}
              secondary={source.posted_by}
              primaryTypographyProps={{
                variant: 'body2',
                noWrap: true,
              }}
              secondaryTypographyProps={{
                variant: 'caption',
                noWrap: true,
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => handleMenuOpen(e, source)}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemButton>
        ))}
      </List>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 16 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default KnowledgeSourcesExplorer;
