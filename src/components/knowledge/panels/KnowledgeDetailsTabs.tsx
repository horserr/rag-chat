import React from 'react';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Folder as FilesIcon,
  AccountTree as DiagramIcon,
} from '@mui/icons-material';
import type { SourceDto, FileDto } from '../../../models/knowledge';
import { TabPanel } from '../../common';
import ResourceContentTab from '../ResourceContentTab';
import FilesTab from '../FilesTab';
import KnowledgeGraphTab from '../KnowledgeGraphTab';

interface KnowledgeDetailsTabsProps {
  selectedSource: SourceDto;
  tabValue: number;
  onTabChange: (value: number) => void;
  resourceText: string;
  onResourceTextChange: (text: string) => void;
  onSaveResource: () => void;
  isSavingResource: boolean;
  files: FileDto[];
  onFileMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
}

const KnowledgeDetailsTabs: React.FC<KnowledgeDetailsTabsProps> = ({
  selectedSource,
  tabValue,
  onTabChange,
  resourceText,
  onResourceTextChange,
  onSaveResource,
  isSavingResource,
  files,
  onFileMenuOpen,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Source Info Header */}
      <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DescriptionIcon color="primary" fontSize="small" />
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {selectedSource.title || 'Untitled Source'}
            </Box>
            {selectedSource.posted_by && (
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                by {selectedSource.posted_by}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => onTabChange(newValue)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.75rem',
              textTransform: 'none',
            },
          }}
        >
          <Tab
            icon={<DescriptionIcon fontSize="small" />}
            label="Resource"
            iconPosition="start"
          />
          <Tab
            icon={<FilesIcon fontSize="small" />}
            label="Files"
            iconPosition="start"
          />
          <Tab
            icon={<DiagramIcon fontSize="small" />}
            label="Diagram"
            iconPosition="start"
          />
        </Tabs>
      </Box>      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ height: '100%', p: 0 }}>
            <ResourceContentTab
              resourceText={resourceText}
              onResourceTextChange={onResourceTextChange}
              onSaveResource={onSaveResource}
              isSaving={isSavingResource}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ height: '100%', p: 0 }}>
            <FilesTab
              files={files}
              onFileMenuOpen={onFileMenuOpen}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ height: '100%', p: 0 }}>
            <KnowledgeGraphTab diagram={selectedSource.diagram} />
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default KnowledgeDetailsTabs;
