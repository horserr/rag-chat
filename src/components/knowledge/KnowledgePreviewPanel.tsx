import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Storage as StorageIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import type { KnowledgeSource } from '../../models/knowledge';
import GenericPreviewPanel from '../common/GenericPreviewPanel';
import type { PreviewItem } from '../common/GenericPreviewPanel';

interface KnowledgePreviewPanelProps {
  source: Partial<KnowledgeSource>;
  isLoading?: boolean;
}

const KnowledgePreviewPanel: React.FC<KnowledgePreviewPanelProps> = ({
  source,
  isLoading = false
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });    } catch {
      return null;
    }
  };

  const previewItems: PreviewItem[] = [
    {
      icon: <DescriptionIcon fontSize="small" color="action" />,
      title: "Title",
      content: source.title ? (
        <Typography variant="body2">{source.title}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Not set
        </Typography>
      ),
      showSkeleton: isLoading
    },
    {
      icon: <PersonIcon fontSize="small" color="action" />,
      title: "Posted By",
      content: source.posted_by ? (
        <Typography variant="body2">{source.posted_by}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Not available
        </Typography>
      ),
      showSkeleton: isLoading
    },
    {
      icon: <CalendarIcon fontSize="small" color="action" />,
      title: "Posted Date",
      content: formatDate(source.posted_at) ? (
        <Typography variant="body2">{formatDate(source.posted_at)}</Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Not available
        </Typography>
      ),
      showSkeleton: isLoading
    },
    {
      icon: <StorageIcon fontSize="small" color="action" />,
      title: "Knowledge Graph",
      content: source.diagram ? (
        <Chip
          label="Available"
          size="small"
          color="success"
          variant="outlined"
        />
      ) : (
        <Chip
          label="Not Available"
          size="small"
          color="default"
          variant="outlined"
        />
      ),
      showSkeleton: isLoading
    }
  ];

  // Add file preview items if files exist
  if (source.files && source.files.length > 0) {
    previewItems.push({
      icon: <FileIcon fontSize="small" color="action" />,
      title: "Attached Files",
      content: (
        <Box>
          {source.files.map((file) => (
            <Chip
              key={file.id}
              label={file.attachment_name || file.content_type}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      ),
      showSkeleton: isLoading
    });
  }

  // Add resource text preview if exists
  if (source.resourceText) {
    previewItems.push({
      icon: <DescriptionIcon fontSize="small" color="action" />,
      title: "Content Preview",
      content: (
        <Typography
          variant="body2"
          sx={{
            p: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            maxHeight: 100,
            overflow: 'auto',
          }}
        >
          {source.resourceText.length > 300
            ? `${source.resourceText.substring(0, 300)}...`
            : source.resourceText}
        </Typography>
      ),
      showSkeleton: isLoading
    });
  }

  return (
    <GenericPreviewPanel
      titleIcon={<StorageIcon color="primary" />}
      title="Knowledge Source Preview"
      items={previewItems}
      paperProps={{
        sx: {
          height: 'fit-content',
          borderRadius: 2,
          bgcolor: 'background.default',
        }
      }}
    />
  );
};

export default KnowledgePreviewPanel;
