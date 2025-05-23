import React from "react";
import { Box, Typography } from "@mui/material";
import CardMetadata from "./CardMetadata";

interface CardContentProps {
  title: string;
  description?: string;
  metrics?: {
    name: string;
    value: number;
    status: "good" | "neutral" | "bad";
  }[];
  date: string;
}

// Reusable card content component used by both evaluation card types
const CardContent: React.FC<CardContentProps> = ({
  title,
  description,
  metrics,
  date,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Top section with title and description */}
      <Box>
        <Typography
          variant="h6"
          component="div"
          fontWeight="600"
          sx={{ lineHeight: 1.3, mb: 1 }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {description && description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </Typography>
        )}
      </Box>

      {/* Bottom section with metrics and date - always aligned to bottom */}
      <CardMetadata
        metrics={metrics}
        date={date}
      />
    </Box>
  );
};

export default CardContent;
