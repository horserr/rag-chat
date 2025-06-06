import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface MermaidDiagramProps {
  diagram: string;
  id?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  diagram,
  id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!diagram) {
      setIsLoading(false);
      return;
    }

    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extract the mermaid code from the markdown-like format
        const mermaidCode = diagram.replace(/```mermaid\n([\s\S]*?)```/m, "$1").trim();

        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: true,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Roboto, sans-serif',
        });

        // Clear previous rendering if any
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidCode);

        // Insert the rendered SVG
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering mermaid diagram:', err);
        setError('Failed to render knowledge graph. Please check the diagram syntax.');
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [diagram, id]);

  if (!diagram) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No knowledge graph available for this source.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', minHeight: 200 }}>
      {isLoading && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Typography variant="body2" color="error.dark">
            {error}
          </Typography>
        </Paper>
      )}

      <Box
        ref={containerRef}
        sx={{
          overflow: 'auto',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s',
          '& svg': {
            maxWidth: '100%',
            height: 'auto'
          }
        }}
      />
    </Box>
  );
};

export default MermaidDiagram;
