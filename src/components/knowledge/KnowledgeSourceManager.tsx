import React from 'react';
import { CreateSourceDialog, EditSourceDialog } from '.';
import { useSourceDialogs } from '../../hooks/knowledge/useSourceDialogs';

interface KnowledgeSourceManagerProps {
  onSourcesChange: () => void; // Callback to trigger refetch of sources
}

const KnowledgeSourceManager: React.FC<KnowledgeSourceManagerProps> = ({ onSourcesChange }) => {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newSourceData,
    setNewSourceData,
    editSourceData,
    setEditSourceData,
    handleCreateSource,
    handleEditSource,
    isCreating,
    isEditing
  } = useSourceDialogs(onSourcesChange);

  return (
    <>
      <CreateSourceDialog
        open={isCreateDialogOpen}
        sourceData={newSourceData}
        onSourceDataChange={setNewSourceData}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateSource={handleCreateSource}
        isCreating={isCreating}
      />

      <EditSourceDialog
        open={isEditDialogOpen}
        sourceData={editSourceData}
        onSourceDataChange={setEditSourceData}
        onClose={() => setIsEditDialogOpen(false)}
        onEditSource={handleEditSource}
        isEditing={isEditing}
      />
    </>
  );
};

export default KnowledgeSourceManager;
