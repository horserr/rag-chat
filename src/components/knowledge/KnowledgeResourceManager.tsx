import React from 'react';
import { useKnowledgeResource } from '../../hooks/knowledge/useKnowledgeResource';

interface KnowledgeResourceManagerProps {
  sourceId: number | null;
}

const KnowledgeResourceManager: React.FC<KnowledgeResourceManagerProps> = ({ sourceId }) => {
  const { resourceText } = useKnowledgeResource(sourceId);

  return (
    <div>
      {resourceText ? (
        <div className="resource-content">{resourceText}</div>
      ) : (
        <div className="no-resource">No resource content available</div>
      )}
    </div>
  );
};

export default KnowledgeResourceManager;
