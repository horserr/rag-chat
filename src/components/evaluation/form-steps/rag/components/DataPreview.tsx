import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Visibility as PreviewIcon } from "@mui/icons-material";

interface DataPreviewProps {
  previewData: Record<string, unknown>[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ previewData }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <PreviewIcon sx={{ mr: 1, fontSize: 20 }} />
        <Typography variant="subtitle2">数据预览 (前5条)</Typography>
      </Box>
      <List dense>
        {previewData.map((sample, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: "background.default",
              borderRadius: 1,
              mb: 1,
              border: 1,
              borderColor: "divider",
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.875rem",
                    maxHeight: 100,
                    overflow: "auto",
                  }}
                >
                  {JSON.stringify(sample, null, 2)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DataPreview;
