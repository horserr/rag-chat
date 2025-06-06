import { Box, Fade } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  FileMenu,
  KnowledgeLoading,
  KnowledgePageHeader,
  KnowledgeExplorerLayout,
  CreateSourceDialog,
  EditSourceDialog,
  UploadKnowledgeDialog,
} from "../components/knowledge";
import {
  useAddFileFromUrl,
  useCreateSource,
  useDeleteFile,
  useDeleteSource,
  useResource,
  useSourceFiles,
  useSourcesList,
  useUpdateResource,
  useUpdateSource,
} from "../hooks/knowledge";
import type {
  CreateSourceDto,
  KnowledgeFileUpload,
  SourceDto,
  UpdateSourceDto,
} from "../models/knowledge";

const KnowledgePage: React.FC = () => {
  // Core state
  const [selectedSource, setSelectedSource] = useState<SourceDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newSourceData, setNewSourceData] = useState<CreateSourceDto>({
    created_by: 1, // This should come from auth context
    posted_by: "",
    title: "",
    accessible_by: [],
  });
  const [editSourceData, setEditSourceData] = useState<UpdateSourceDto | null>(
    null
  );
  const [resourceText, setResourceText] = useState("");
  const [uploadFileContent, setUploadFileContent] =
    useState<KnowledgeFileUpload | null>(null);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries and mutations
  const {
    data: sourcesData,
    isLoading: isLoadingSources,
    refetch: refetchSources,
  } = useSourcesList();
  const { data: resourceData, refetch: refetchResource } = useResource(
    selectedSource?.id || null
  );
  const { data: filesData, refetch: refetchFiles } = useSourceFiles(
    selectedSource?.id || null
  );

  const createSourceMutation = useCreateSource();
  const updateSourceMutation = useUpdateSource();
  const deleteSourceMutation = useDeleteSource();
  const updateResourceMutation = useUpdateResource();
  const addFileFromUrlMutation = useAddFileFromUrl();
  const deleteFileMutation = useDeleteFile(); // Update resource text when resource data changes
  useEffect(() => {
    if (resourceData) {
      setResourceText(resourceData.text || "");
    } else {
      // Clear resource text when no resource data is available
      setResourceText("");
    }
  }, [resourceData]);
  // Calculate if resource already exists
  const hasExistingResource = Boolean(
    resourceData && resourceData.text && resourceData.text.trim().length > 0
  );

  // REFACTORED: Source handling methods
  const handleCreateSource = async () => {
    try {
      await createSourceMutation.mutateAsync(newSourceData);
      setIsCreateDialogOpen(false);
      setNewSourceData({
        created_by: 1,
        posted_by: "",
        title: "",
        accessible_by: [],
      });
      refetchSources();
    } catch (error) {
      console.error("Failed to create source:", error);
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
      console.error("Failed to update source:", error);
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
      console.error("Failed to delete source:", error);
    }
  };

  // REFACTORED: Resource handling methods
  const handleUpdateResource = async () => {
    if (!selectedSource) return;

    try {
      await updateResourceMutation.mutateAsync({
        sourceId: selectedSource.id,
        resourceData: { text: resourceText },
      });
      refetchResource();
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  };

  // REFACTORED: File handling methods
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
        console.error("Failed to parse file:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    if (!uploadFileContent) return;

    try {
      // Create or update source
      let sourceId: number;

      if ("id" in uploadFileContent.source) {
        // For update, we already have the ID
        await updateSourceMutation.mutateAsync({
          sourceId: uploadFileContent.source.id,
          sourceData: uploadFileContent.source,
        });
        sourceId = uploadFileContent.source.id;
      } else {
        // For create, we need to get the ID from the result
        const result = await createSourceMutation.mutateAsync(
          uploadFileContent.source
        );
        sourceId =
          typeof result === "object" && result !== null
            ? (result as { id?: number }).id ||
              (result as { data?: { id?: number } }).data?.id ||
              (typeof result === "number" ? result : 0)
            : 0;

        if (!sourceId) {
          throw new Error("Failed to get source ID from creation result");
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
      console.error("Failed to upload knowledge data:", error);
    }
  };

  const handleFileMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    fileId: string
  ) => {
    setFileMenuAnchor(event.currentTarget);
    setSelectedFileId(fileId);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
    setSelectedFileId("");
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
      console.error("Failed to delete file:", error);
    }
  };
  // Other handlers
  const handleSourceSelect = (source: SourceDto) => {
    setSelectedSource(source);
    setTabValue(0);
    // Reset resource text when switching sources
    setResourceText("");
  };

  const handleEditSourceClick = (source: SourceDto) => {
    setEditSourceData(source);
    setIsEditDialogOpen(true);
  };

  const handleTabChange = (value: number) => {
    setTabValue(value);
  };

  if (isLoadingSources) {
    return <KnowledgeLoading />;
  }
  return (
    <KnowledgeExplorerLayout
      selectedSource={selectedSource}
      sources={sourcesData?.data || []}
      tabValue={tabValue}
      files={filesData || []}
      resourceText={resourceText}
      isLoadingSources={isLoadingSources}
      onSourceSelect={handleSourceSelect}
      onEditSource={handleEditSourceClick}
      onDeleteSource={handleDeleteSource}
      onTabChange={handleTabChange}
      onResourceTextChange={setResourceText}
      onSaveResource={handleUpdateResource}
      isSavingResource={updateResourceMutation.isPending}
      onFileMenuOpen={handleFileMenuOpen}
      onCreateSource={() => setIsCreateDialogOpen(true)}
      onUploadFile={() => fileInputRef.current?.click()}
      hasExistingResource={hasExistingResource}
    >
      {/* Header */}
      <Fade in timeout={600}>
        <Box>
          <KnowledgePageHeader />
        </Box>
      </Fade>

      {/* Dialogs */}
      <CreateSourceDialog
        open={isCreateDialogOpen}
        sourceData={newSourceData}
        onSourceDataChange={setNewSourceData}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateSource={handleCreateSource}
        isCreating={createSourceMutation.isPending}
      />

      <EditSourceDialog
        open={isEditDialogOpen}
        sourceData={editSourceData}
        onSourceDataChange={setEditSourceData}
        onClose={() => setIsEditDialogOpen(false)}
        onEditSource={handleEditSource}
        isEditing={updateSourceMutation.isPending}
      />

      <UploadKnowledgeDialog
        open={isUploadDialogOpen}
        uploadFileContent={uploadFileContent}
        onClose={() => setIsUploadDialogOpen(false)}
        onConfirmUpload={handleConfirmUpload}
        isUploading={createSourceMutation.isPending}
      />

      <FileMenu
        anchorEl={fileMenuAnchor}
        onClose={handleFileMenuClose}
        onDeleteFile={handleDeleteFile}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
    </KnowledgeExplorerLayout>
  );
};

export default KnowledgePage;
