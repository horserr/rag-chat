import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  List,
  ListItem,
  Divider,
  Fade,
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
  paperProps?: React.ComponentProps<typeof Paper>;
  progressIndicator?: React.ReactNode;
}

const GenericPreviewPanel: React.FC<GenericPreviewPanelProps> = ({
  title,
  titleIcon,
  items,
  paperProps = {},
  progressIndicator,
}) => {  const PreviewItemComponent: React.FC<PreviewItem> = ({
    icon,
    title: itemTitle,
    content,
    showSkeleton = false,
  }) => (
    <ListItem sx={{ px: 0, py: 1.5 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        gap: 2,
        transition: 'all 0.2s ease-in-out',
      }}>
        <Box sx={{
          mt: 0.5,
          opacity: 0.7,
          transition: 'opacity 0.2s ease-in-out',
          '.MuiListItem-root:hover &': {
            opacity: 1,
          }
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            {itemTitle}
          </Typography>
          {showSkeleton ? (
            <Fade in timeout={300}>
              <Skeleton
                variant="text"
                width="80%"
                sx={{
                  borderRadius: 1,
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, rgba(67, 97, 238, 0.1), transparent)',
                  }
                }}
              />
            </Fade>
          ) : (
            <Fade in timeout={300}>
              <Box>{content}</Box>
            </Fade>
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
        borderRadius: 3,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4361ee, #3f37c9)',
          borderRadius: '3px 3px 0 0',
        },
        ...paperProps?.sx
      }}
      {...paperProps}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 700,
          color: 'text.primary',
          fontSize: '1.125rem',
          '& .MuiSvgIcon-root': {
            transition: 'transform 0.2s ease-in-out',
          },
          '&:hover .MuiSvgIcon-root': {
            transform: 'scale(1.1)',
          }
        }}
      >
        {titleIcon}
        {title}
      </Typography>

      <List sx={{ p: 0 }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <Divider
                sx={{
                  my: 1.5,
                  opacity: 0.6,
                  borderColor: 'rgba(67, 97, 238, 0.1)',
                }}
              />
            )}
            <PreviewItemComponent {...item} />
          </React.Fragment>
        ))}
      </List>

      {progressIndicator && (
        <Box sx={{
          mt: 3,
          pt: 3,
          borderTop: 1,
          borderColor: 'rgba(67, 97, 238, 0.1)',
        }}>
          {progressIndicator}
        </Box>
      )}
    </Paper>
  );
};

export default GenericPreviewPanel;
