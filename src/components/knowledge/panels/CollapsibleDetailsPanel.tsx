import React from 'react';
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Collapse,
} from '@mui/material';
import {
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { SourceDto, FileDto } from '../../../models/knowledge';
import KnowledgeDetailsTabs from './KnowledgeDetailsTabs';

interface CollapsibleDetailsPanelProps {
  selectedSource: SourceDto | null;
  tabValue: number;
  onTabChange: (value: number) => void;
  resourceText: string;
  onResourceTextChange: (text: string) => void;
  onSaveResource: () => void;
  isSavingResource: boolean;
  files: FileDto[];
  onFileMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: (collapsed: boolean) => void;
}

const CollapsibleDetailsPanel: React.FC<CollapsibleDetailsPanelProps> = ({
  selectedSource,
  tabValue,
  onTabChange,
  resourceText,
  onResourceTextChange,
  onSaveResource,
  isSavingResource,
  files,
  onFileMenuOpen,
  isCollapsed,
  onToggleCollapsed,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Details Panel Header */}
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 40,
          backgroundColor: '#f8f8f8',
          borderBottom: '1px solid #d0d0d0',
          px: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {selectedSource ? 'Details' : 'Select a source to view details'}
          </Typography>
        </Box>

        <Tooltip title={isCollapsed ? 'Expand Details Panel' : 'Collapse Details Panel'}>
          <IconButton
            size="small"
            onClick={() => onToggleCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ExpandIcon fontSize="small" /> : <CollapseIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Details Content */}
      <Collapse in={!isCollapsed} orientation="horizontal">
        <Box sx={{ height: 'calc(100% - 40px)', minWidth: 400 }}>
          {selectedSource ? (
            <KnowledgeDetailsTabs
              selectedSource={selectedSource}
              tabValue={tabValue}
              onTabChange={onTabChange}
              resourceText={resourceText}
              onResourceTextChange={onResourceTextChange}
              onSaveResource={onSaveResource}
              isSavingResource={isSavingResource}
              files={files}
              onFileMenuOpen={onFileMenuOpen}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
              }}
            >
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Select a knowledge source from the explorer to view its details and manage resources.
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleDetailsPanel;
