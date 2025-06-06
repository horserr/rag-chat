import React, { useRef, useState } from 'react';
import { FileMenu, UploadKnowledgeDialog } from '.';
import { useAddFileFromUrl, useDeleteFile, useUpdateResource, useCreateSource, useUpdateSource } from '../../hooks/knowledge';
import type { KnowledgeFileUpload } from '../../models/knowledge';

interface KnowledgeFileManagerProps {
  selectedSourceId: number | null;
  onFilesChange: () => void;
  onSourcesChange: () => void;
}

export interface KnowledgeFileManagerRef {
  triggerFileUpload: () => void;
}

const KnowledgeFileManager = React.forwardRef<KnowledgeFileManagerRef, KnowledgeFileManagerProps>(
  ({
    selectedSourceId,
    onFilesChange,
    onSourcesChange
  }, ref) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadFileContent, setUploadFileContent] = useState<KnowledgeFileUpload | null>(null);
    const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedFileId, setSelectedFileId] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mutations
    const createSourceMutation = useCreateSource();
    const updateSourceMutation = useUpdateSource();
    const updateResourceMutation = useUpdateResource();
    const addFileFromUrlMutation = useAddFileFromUrl();
    const deleteFileMutation = useDeleteFile();

    // Expose triggerFileUpload through ref
    React.useImperativeHandle(ref, () => ({
      triggerFileUpload: () => {
        fileInputRef.current?.click();
      }
    }));

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
          ); // Extract ID safely based on the actual API response structure
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
        onSourcesChange();
      } catch (error) {
        console.error("Failed to upload knowledge data:", error);
      }
    };

    const handleFileMenuClose = () => {
      setFileMenuAnchor(null);
      setSelectedFileId("");
    };

    const handleDeleteFile = async () => {
      if (!selectedSourceId || !selectedFileId) return;

      try {
        await deleteFileMutation.mutateAsync({
          sourceId: selectedSourceId,
          fileId: selectedFileId,
        });
        onFilesChange();
        handleFileMenuClose();
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    };

    return (
      <>
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
      </>
    );
  }
);

export { KnowledgeFileManager };
export default KnowledgeFileManager;
