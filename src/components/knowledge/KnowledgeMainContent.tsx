import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import type { SourceDto, FileDto } from '../../models/knowledge';
import { TabPanel } from '../common';
import ResourceContentTab from './ResourceContentTab';
import FilesTab from './FilesTab';
import KnowledgeGraphTab from './KnowledgeGraphTab';

interface KnowledgeMainContentProps {
  selectedSource: SourceDto | null;
  tabValue: number;
  onTabChange: (newValue: number) => void;
  resourceText: string;
  onResourceTextChange: (text: string) => void;
  onSaveResource: () => void;
  isSavingResource?: boolean;
  files: FileDto[];
  onFileMenuOpen: (event: React.MouseEvent<HTMLElement>, fileId: string) => void;
}

const KnowledgeMainContent: React.FC<KnowledgeMainContentProps> = ({
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
  if (!selectedSource) {
    return (
      <Box sx={{ flex: '0 0 41.666%' }}>
        <Paper sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            Select a knowledge source to view details
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: '0 0 41.666%' }}>
      <Paper sx={{
        height: 'calc(100vh - 200px)',
        borderRadius: 2,
        boxShadow: 2,
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => onTabChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tab label="Resource Content" sx={{ fontWeight: 500 }} />
          <Tab label="Files" sx={{ fontWeight: 500 }} />
          <Tab label="Knowledge Graph" sx={{ fontWeight: 500 }} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ResourceContentTab
            resourceText={resourceText}
            onResourceTextChange={onResourceTextChange}
            onSaveResource={onSaveResource}
            isSaving={isSavingResource}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <FilesTab
            files={files}
            onFileMenuOpen={onFileMenuOpen}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <KnowledgeGraphTab diagram={selectedSource.diagram} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default KnowledgeMainContent;
