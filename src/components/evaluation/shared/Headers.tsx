import { Refresh as RefreshIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

interface EvaluationPageHeaderProps {
  title: string;
  subtitle: string;
}

interface PanelHeaderProps {
  title: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: React.ReactNode;
}

export const EvaluationPageHeader: React.FC<EvaluationPageHeaderProps> = ({
  title,
  subtitle,
}) => (
  <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
    <Typography variant="h4" fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Box>
);

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  onRefresh,
  isRefreshing = false,
  actions,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {actions}
      {onRefresh && (
        <IconButton onClick={onRefresh} disabled={isRefreshing}>
          <RefreshIcon />
        </IconButton>
      )}
    </Box>
  </Box>
);
