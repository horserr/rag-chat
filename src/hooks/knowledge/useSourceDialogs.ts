import { useState } from 'react';
import type { CreateSourceDto, SourceDto, UpdateSourceDto } from '../../models/knowledge';
import { useCreateSource, useDeleteSource, useUpdateSource } from '.';

const useSourceDialogs = (onSourcesChange: () => void) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSourceData, setNewSourceData] = useState<CreateSourceDto>({
    created_by: 1, // This should come from auth context
    posted_by: "",
    title: "",
    accessible_by: [],
  });
  const [editSourceData, setEditSourceData] = useState<UpdateSourceDto | null>(null);

  // Mutations
  const createSourceMutation = useCreateSource();
  const updateSourceMutation = useUpdateSource();
  const deleteSourceMutation = useDeleteSource();

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
      onSourcesChange();
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
      onSourcesChange();
    } catch (error) {
      console.error("Failed to update source:", error);
    }
  };

  const handleDeleteSource = async (sourceId: number) => {
    try {
      await deleteSourceMutation.mutateAsync(sourceId);
      onSourcesChange();
      return true;
    } catch (error) {
      console.error("Failed to delete source:", error);
      return false;
    }
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (source: SourceDto) => {
    setEditSourceData(source);
    setIsEditDialogOpen(true);
  };

  return {
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
    handleDeleteSource,
    openCreateDialog,
    openEditDialog,
    isCreating: createSourceMutation.isPending,
    isEditing: updateSourceMutation.isPending
  };
};

export { useSourceDialogs };
export default useSourceDialogs;
