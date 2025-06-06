import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  List,
  ListItem,
  Divider,
} from '@mui/material';

export interface PreviewItem {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  showSkeleton?: boolean;
}

interface GenericPreviewPanelProps {
  title: string;
  titleIcon: React.ReactNode;
  items: PreviewItem[];
  paperProps?: any;
  progressIndicator?: React.ReactNode;
}

const GenericPreviewPanel: React.FC<GenericPreviewPanelProps> = ({
  title,
  titleIcon,
  items,
  paperProps = {},
  progressIndicator,
}) => {
  const PreviewItemComponent: React.FC<PreviewItem> = ({
    icon,
    title: itemTitle,
    content,
    showSkeleton = false,
  }) => (
    <ListItem sx={{ px: 0, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 2 }}>
        <Box sx={{ mt: 0.5 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {itemTitle}
          </Typography>
          {showSkeleton ? (
            <Skeleton variant="text" width="80%" />
          ) : (
            content
          )}
        </Box>
      </Box>
    </ListItem>
  );

  return (
    <Paper
      sx={{
        p: 3,
        height: 'fit-content',
        borderRadius: 2,
        bgcolor: 'background.default',
        ...paperProps?.sx
      }}
      {...paperProps}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {titleIcon}
        {title}
      </Typography>      <List sx={{ p: 0 }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider sx={{ my: 1 }} />}
            <PreviewItemComponent {...item} />
          </React.Fragment>
        ))}
      </List>

      {progressIndicator && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {progressIndicator}
        </Box>
      )}
    </Paper>
  );
};

export default GenericPreviewPanel;
