import React, { useState } from "react";
import { Box, Container, Fade, Slide } from "@mui/material";
import { KnowledgeExplorer } from "../components/knowledge/explorer";
import { CollapsibleDetailsPanel } from "../components/knowledge/panels";
import type { SourceDto, FileDto } from "../models/knowledge";

export type ViewType = "list" | "cards";

interface KnowledgeExplorerLayoutProps {
  selectedSource: SourceDto | null;
  sources: SourceDto[];
  tabValue: number;
  files: FileDto[];
  resourceText: string;
  isLoadingSources: boolean;
  onSourceSelect: (source: SourceDto) => void;
  onEditSource: (source: SourceDto) => void;
  onDeleteSource: (sourceId: number) => void;
  onTabChange: (value: number) => void;
  onResourceTextChange: (text: string) => void;
  onSaveResource: () => void;
  isSavingResource: boolean;
  onFileMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    fileId: string
  ) => void;
  onCreateSource?: () => void;
  onUploadFile?: () => void;
  children?: React.ReactNode;
  hasExistingResource?: boolean;
}

const KnowledgeExplorerLayout: React.FC<KnowledgeExplorerLayoutProps> = ({
  selectedSource,
  sources,
  tabValue,
  files,
  resourceText,
  isLoadingSources,
  onSourceSelect,
  onEditSource,
  onDeleteSource,
  onTabChange,
  onResourceTextChange,
  onSaveResource,
  isSavingResource,
  onFileMenuOpen,
  onCreateSource,
  onUploadFile,
  children,
  hasExistingResource = false,
}) => {
  const [viewType, setViewType] = useState<ViewType>("list");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5", // Windows-like background
        position: "relative",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 2, position: "relative", zIndex: 1 }}>
        {/* Header and dialogs */}
        {children}

        <Slide direction="up" in timeout={600}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              minHeight: "calc(100vh - 120px)",
              backgroundColor: "#fff",
              border: "1px solid #d0d0d0",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {/* Left Explorer Panel */}
            <Fade in timeout={800}>
              <Box
                sx={{
                  flex: isPanelCollapsed ? "1" : "0 0 350px",
                  borderRight: "1px solid #d0d0d0",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                }}
              >
                {" "}
                <KnowledgeExplorer
                  sources={sources}
                  selectedSource={selectedSource}
                  onSourceSelect={onSourceSelect}
                  onEditSource={onEditSource}
                  onDeleteSource={onDeleteSource}
                  isLoading={isLoadingSources}
                  viewType={viewType}
                  onViewTypeChange={setViewType}
                  onCreateSource={onCreateSource}
                  onUploadFile={onUploadFile}
                />
              </Box>
            </Fade>

            {/* Right Collapsible Details Panel */}
            <Fade in timeout={1000}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0, // Allow shrinking
                }}
              >
                {" "}
                <CollapsibleDetailsPanel
                  selectedSource={selectedSource}
                  tabValue={tabValue}
                  onTabChange={onTabChange}
                  resourceText={resourceText}
                  onResourceTextChange={onResourceTextChange}
                  onSaveResource={onSaveResource}
                  isSavingResource={isSavingResource}
                  files={files}
                  onFileMenuOpen={onFileMenuOpen}
                  isCollapsed={isPanelCollapsed}
                  onToggleCollapsed={setIsPanelCollapsed}
                  hasExistingResource={hasExistingResource}
                />
              </Box>
            </Fade>
          </Box>
        </Slide>
      </Container>
    </Box>
  );
};

export default KnowledgeExplorerLayout;
