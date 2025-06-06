import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  FilePresent as FileIcon,
  Description as DocumentIcon,
  Save as SaveIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import mermaid from 'mermaid';
import { GenericPreviewPanel } from '../components/common';
import {
  useSourcesList,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
  useResource,
  useUpdateResource,
  useSourceFiles,
  useAddFileFromUrl,
  useDeleteFile,
} from '../hooks/knowledge';
import type {
  SourceDto,
  CreateSourceDto,
  UpdateSourceDto,
  KnowledgeFileUpload,
} from '../models/knowledge';

// TabPanel Component for handling tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`knowledge-tabpanel-${index}`}
      aria-labelledby={`knowledge-tab-${index}`}
      {...other}
      style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const KnowledgePage: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<SourceDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newSourceData, setNewSourceData] = useState<CreateSourceDto>({
    created_by: 1, // This should come from auth context
    posted_by: '',
    title: '',
    accessible_by: [],
  });
  const [editSourceData, setEditSourceData] = useState<UpdateSourceDto | null>(null);
  const [resourceText, setResourceText] = useState('');
  const [uploadFileContent, setUploadFileContent] = useState<KnowledgeFileUpload | null>(null);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const mermaidRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries and mutations
  const { data: sourcesData, isLoading: isLoadingSources, refetch: refetchSources } = useSourcesList();
  const { data: resourceData, refetch: refetchResource } = useResource(selectedSource?.id || null);
  const { data: filesData, refetch: refetchFiles } = useSourceFiles(selectedSource?.id || null);

  const createSourceMutation = useCreateSource();
  const updateSourceMutation = useUpdateSource();
  const deleteSourceMutation = useDeleteSource();
  const updateResourceMutation = useUpdateResource();
  const addFileFromUrlMutation = useAddFileFromUrl();
  const deleteFileMutation = useDeleteFile();

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        fontFamily: 'Arial, sans-serif',
      },
    });
  }, []);

  // Render mermaid diagram when source changes
  useEffect(() => {
    if (selectedSource?.diagram && mermaidRef.current) {
      const diagramCode = selectedSource.diagram.replace(/^```mermaid\s*/, '').replace(/\s*```$/, '');
      mermaidRef.current.innerHTML = '';

      mermaid.render('mermaid-diagram', diagramCode)
        .then((result: { svg: string }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        })
        .catch((error: Error) => {
          console.error('Mermaid rendering error:', error);
        });
    }
  }, [selectedSource?.diagram]);

  // Update resource text when resource data changes
  useEffect(() => {
    if (resourceData) {
      setResourceText(resourceData.text || '');
    }
  }, [resourceData]);

  const handleCreateSource = async () => {
    try {
      await createSourceMutation.mutateAsync(newSourceData);
      setIsCreateDialogOpen(false);
      setNewSourceData({
        created_by: 1,
        posted_by: '',
        title: '',
        accessible_by: [],
      });
      refetchSources();
    } catch (error) {
      console.error('Failed to create source:', error);
    }
  };

  const handleEditSource = async () => {
    if (!editSourceData) return;

    try {
      await updateSourceMutation.mutateAsync({
        sourceId: editSourceData.id,
        sourceData: editSourceData,
      });
      setIsEditDialogOpen(false);
      setEditSourceData(null);
      refetchSources();
    } catch (error) {
      console.error('Failed to update source:', error);
    }
  };

  const handleDeleteSource = async (sourceId: number) => {
    try {
      await deleteSourceMutation.mutateAsync(sourceId);
      if (selectedSource?.id === sourceId) {
        setSelectedSource(null);
        setTabValue(0);
      }
      refetchSources();
    } catch (error) {
      console.error('Failed to delete source:', error);
    }
  };

  const handleUpdateResource = async () => {
    if (!selectedSource) return;

    try {
      await updateResourceMutation.mutateAsync({
        sourceId: selectedSource.id,
        resourceData: { text: resourceText },
      });
      refetchResource();
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setUploadFileContent(content);
        setIsUploadDialogOpen(true);
      } catch (error) {
        console.error('Failed to parse file:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    if (!uploadFileContent) return;

    try {
      // Create or update source
      let sourceId: number;

      if ('id' in uploadFileContent.source) {
        // For update, we already have the ID
        await updateSourceMutation.mutateAsync({
          sourceId: uploadFileContent.source.id,
          sourceData: uploadFileContent.source,
        });
        sourceId = uploadFileContent.source.id;
      } else {
        // For create, we need to get the ID from the result
        const result = await createSourceMutation.mutateAsync(uploadFileContent.source);        // Extract ID safely based on the actual API response structure
        sourceId = typeof result === 'object' && result !== null
          ? (result as { id?: number }).id ||
            (result as { data?: { id?: number } }).data?.id ||
            (typeof result === 'number' ? result : 0)
          : 0;

        if (!sourceId) {
          throw new Error('Failed to get source ID from creation result');
        }
      }

      // Update resource content
      if (uploadFileContent.resource) {
        await updateResourceMutation.mutateAsync({
          sourceId: sourceId,
          resourceData: uploadFileContent.resource,
        });
      }

      // Add files
      if (uploadFileContent.files) {
        for (const file of uploadFileContent.files) {
          await addFileFromUrlMutation.mutateAsync({
            sourceId: sourceId,
            fileData: file,
          });
        }
      }

      setIsUploadDialogOpen(false);
      setUploadFileContent(null);
      refetchSources();
    } catch (error) {
      console.error('Failed to upload knowledge data:', error);
    }
  };

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: string) => {
    setFileMenuAnchor(event.currentTarget);
    setSelectedFileId(fileId);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
    setSelectedFileId('');
  };

  const handleDeleteFile = async () => {
    if (!selectedSource || !selectedFileId) return;

    try {
      await deleteFileMutation.mutateAsync({
        sourceId: selectedSource.id,
        fileId: selectedFileId,
      });
      refetchFiles();
      handleFileMenuClose();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const renderPreviewPanel = () => {
    if (!selectedSource) return null;

    const previewItems = [
      {
        icon: <DocumentIcon fontSize="small" color="primary" />,
        title: 'Title',
        content: <Typography variant="body2" fontWeight={500}>{selectedSource.title}</Typography>,
      },
      {
        icon: <FileIcon fontSize="small" color="info" />,
        title: 'Posted By',
        content: <Typography variant="body2">{selectedSource.posted_by || 'Not specified'}</Typography>,
      },
      {
        icon: <FileIcon fontSize="small" color="secondary" />,
        title: 'Created At',
        content: <Typography variant="body2">{new Date(selectedSource.created_at).toLocaleString()}</Typography>,
      },
      {
        icon: <FileIcon fontSize="small" color="success" />,
        title: 'Accessible By',
        content: (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {selectedSource.accessible_by.length > 0 ?
              selectedSource.accessible_by.map((userId) => (
                <Chip key={userId} label={`User ${userId}`} size="small" color="primary" variant="outlined" />
              )) :
              <Typography variant="caption" color="text.secondary">No user access specified</Typography>
            }
          </Box>
        ),
      },
    ];

    return (
      <GenericPreviewPanel
        title="Knowledge Source Details"
        titleIcon={<DocumentIcon color="primary" />}
        items={previewItems}
        paperProps={{
          sx: {
            boxShadow: 3,
            height: 'fit-content',
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Knowledge Base Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            color="info"
            sx={{ borderRadius: 2 }}
          >
            Upload Knowledge
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            New Source
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
        {/* Sources List */}
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
            {isLoadingSources ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : sourcesData?.data.length ? (
              <List disablePadding>
                {sourcesData.data.map((source) => (
                  <React.Fragment key={source.id}>
                    <ListItemButton
                      selected={selectedSource?.id === source.id}
                      onClick={() => setSelectedSource(source)}
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
                            setEditSourceData(source);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSource(source.id);
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

        {/* Main Content */}
        <Box sx={{ flex: '0 0 41.666%' }}>
          {selectedSource ? (
            <Paper sx={{
              height: 'calc(100vh - 200px)',
              borderRadius: 2,
              boxShadow: 2,
              overflow: 'hidden'
            }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
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
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    multiline
                    rows={12}
                    value={resourceText}
                    onChange={(e) => setResourceText(e.target.value)}
                    placeholder="Enter resource content..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateResource}
                    disabled={updateResourceMutation.isPending}
                    sx={{ alignSelf: 'flex-end', borderRadius: 2 }}
                  >
                    Save Resource
                  </Button>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {filesData?.length ? (
                  <List>
                    {filesData.map((file) => (
                      <ListItem key={file.id} divider>
                        <ListItemText
                          primary={file.attachment_name || file.id}
                          secondary={`${file.content_type} • ${new Date(file.created_at).toLocaleDateString()}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={(e) => handleFileMenuOpen(e, file.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography color="text.secondary">No files available for this source</Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {selectedSource.diagram ? (
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <div ref={mermaidRef} style={{ minHeight: 300 }} />
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>No knowledge graph available for this source.</Alert>
                )}
              </TabPanel>
            </Paper>
          ) : (
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
          )}
        </Box>

        {/* Preview Panel */}
        <Box sx={{ flex: '0 0 25%' }}>
          {renderPreviewPanel()}
        </Box>
      </Box>

      {/* Create Source Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Create New Knowledge Source
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="Title"
            value={newSourceData.title}
            onChange={(e) => setNewSourceData({ ...newSourceData, title: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Posted By"
            value={newSourceData.posted_by}
            onChange={(e) => setNewSourceData({ ...newSourceData, posted_by: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsCreateDialogOpen(false)} variant="text">Cancel</Button>
          <Button
            onClick={handleCreateSource}
            variant="contained"
            disabled={createSourceMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Source Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Edit Knowledge Source
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editSourceData && (
            <>
              <TextField
                label="Title"
                value={editSourceData.title}
                onChange={(e) => setEditSourceData({ ...editSourceData, title: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Posted By"
                value={editSourceData.posted_by}
                onChange={(e) => setEditSourceData({ ...editSourceData, posted_by: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="text">Cancel</Button>
          <Button
            onClick={handleEditSource}
            variant="contained"
            disabled={updateSourceMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Upload Knowledge Data
        </DialogTitle>
        <DialogContent>
          {uploadFileContent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">File Preview:</Typography>
              <pre style={{
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                border: '1px solid #e0e0e0'
              }}>
                {JSON.stringify(uploadFileContent, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsUploadDialogOpen(false)} variant="text">Cancel</Button>
          <Button
            onClick={handleConfirmUpload}
            variant="contained"
            disabled={createSourceMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Menu */}
      <Menu
        anchorEl={fileMenuAnchor}
        open={Boolean(fileMenuAnchor)}
        onClose={handleFileMenuClose}
        PaperProps={{ sx: { borderRadius: 1, boxShadow: 3 } }}
      >
        <MenuItem onClick={handleDeleteFile} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
    </Container>
  );
};

export default KnowledgePage;
