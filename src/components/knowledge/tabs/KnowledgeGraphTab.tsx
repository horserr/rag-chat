import React, { useRef, useEffect } from 'react';
import {
  Box,
  Alert,
} from '@mui/material';
import mermaid from 'mermaid';

interface KnowledgeGraphTabProps {
  diagram: string | null;
}

const KnowledgeGraphTab: React.FC<KnowledgeGraphTabProps> = ({ diagram }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (diagram && mermaidRef.current) {
      const diagramCode = diagram.replace(/^```mermaid\s*/, '').replace(/\s*```$/, '');
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
  }, [diagram]);

  return (
    <>
      {diagram ? (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <div ref={mermaidRef} style={{ minHeight: 300 }} />
        </Box>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          No knowledge graph available for this source.
        </Alert>
      )}
    </>
  );
};

export default KnowledgeGraphTab;
