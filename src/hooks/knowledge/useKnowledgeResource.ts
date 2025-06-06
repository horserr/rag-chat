import { useState, useEffect } from 'react';
import { useResource, useUpdateResource } from '.';

const useKnowledgeResource = (sourceId: number | null) => {
  const [resourceText, setResourceText] = useState("");

  // Resource query and mutation
  const { data: resourceData, refetch: refetchResource } = useResource(sourceId);
  const updateResourceMutation = useUpdateResource();

  // Update resource text when resource data changes
  useEffect(() => {
    if (resourceData) {
      setResourceText(resourceData.text || "");
    }
  }, [resourceData]);

  const handleUpdateResource = async () => {
    if (!sourceId) return;

    try {
      await updateResourceMutation.mutateAsync({
        sourceId: sourceId,
        resourceData: { text: resourceText },
      });
      refetchResource();
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  };

  return {
    resourceText,
    setResourceText,
    handleUpdateResource,
    isUpdating: updateResourceMutation.isPending,
    refetchResource
  };
};

export { useKnowledgeResource };
export default useKnowledgeResource;
