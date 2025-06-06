import React from 'react';
import { Box } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import GenericPreviewPanel from '../common/GenericPreviewPanel';
import type { PreviewItem } from '../common/GenericPreviewPanel';
import type { KnowledgeSource } from '../../models/knowledge';

interface KnowledgeSourcePreviewProps {
  source: KnowledgeSource;
  isLoading?: boolean;
}

const KnowledgeSourcePreview: React.FC<KnowledgeSourcePreviewProps> = ({
  source,
  isLoading = false
}) => {
  // Create preview items based on the source data
  const previewItems: PreviewItem[] = [
    {
      icon: <FolderIcon />,
      title: source.title,
      content: <Box>{source.resourceText || 'No content'}</Box>,
      showSkeleton: isLoading
    }
  ];

  // Use source and isLoading parameters
  // {
  //   icon: <SomeIcon />,
  //   title: "Some Title",
  //   content: <Typography>Some Content</Typography>,
  //   showSkeleton: isLoading
  // }

  return (
    <Box>
      <GenericPreviewPanel
        title="Knowledge Source"
        titleIcon={<FolderIcon color="primary" />}
        items={previewItems}
      />
    </Box>
  );
};

export default KnowledgeSourcePreview;
