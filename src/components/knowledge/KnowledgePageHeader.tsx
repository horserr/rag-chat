import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Home as HomeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const KnowledgePageHeader: React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      mb: 2,
      pb: 2,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <StorageIcon fontSize="small" />
          Knowledge Base
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
        Knowledge Explorer
      </Typography>
    </Box>
  );
};

export { KnowledgePageHeader };
export default KnowledgePageHeader;
