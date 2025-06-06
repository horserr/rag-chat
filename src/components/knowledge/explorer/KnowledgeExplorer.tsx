import React from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ViewList as ListViewIcon,
  ViewModule as CardsViewIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import type { SourceDto } from "../../../models/knowledge";
import KnowledgeSourcesExplorer from "./KnowledgeSourcesExplorer";
import type { ViewType } from "../../../layouts/KnowledgeExplorerLayout";

interface KnowledgeExplorerProps {
  sources: SourceDto[];
  selectedSource: SourceDto | null;
  isLoading: boolean;
  onSourceSelect: (source: SourceDto) => void;
  onEditSource: (source: SourceDto) => void;
  onDeleteSource: (sourceId: number) => void;
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
  onCreateSource?: () => void;
  onUploadFile?: () => void;
}

const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  sources,
  selectedSource,
  isLoading,
  onSourceSelect,
  onEditSource,
  onDeleteSource,
  viewType,
  onViewTypeChange,
  onCreateSource,
  onUploadFile,
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateSource = () => {
    handleMenuClose();
    onCreateSource?.();
  };

  const handleUploadFile = () => {
    handleMenuClose();
    onUploadFile?.();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Explorer Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 40,
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #d0d0d0",
          px: 1,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={() => window.location.reload()}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          <Tooltip title="List View">
            <IconButton
              size="small"
              color={viewType === "list" ? "primary" : "default"}
              onClick={() => onViewTypeChange("list")}
            >
              <ListViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cards View">
            <IconButton
              size="small"
              color={viewType === "cards" ? "primary" : "default"}
              onClick={() => onViewTypeChange("cards")}
            >
              <CardsViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateSource}
            sx={{
              fontSize: "0.75rem",
              minWidth: "auto",
              px: 1,
            }}
          >
            New Source
          </Button>

          <Tooltip title="More actions">
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Explorer Content */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <KnowledgeSourcesExplorer
          sources={sources}
          selectedSource={selectedSource}
          isLoading={isLoading}
          onSourceSelect={onSourceSelect}
          onEditSource={onEditSource}
          onDeleteSource={onDeleteSource}
          viewType={viewType}
        />
      </Box>

      {/* More Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCreateSource}>
          <AddIcon sx={{ mr: 1, fontSize: 16 }} />
          New Source
        </MenuItem>
        <MenuItem onClick={handleUploadFile}>
          <UploadIcon sx={{ mr: 1, fontSize: 16 }} />
          Upload File
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default KnowledgeExplorer;
