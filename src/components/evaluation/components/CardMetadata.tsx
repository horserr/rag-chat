import React from "react";
import { Box, Typography } from "@mui/material";
import EvaluationMetrics from "../EvaluationMetrics";

interface CardMetadataProps {
  metrics?: {
    name: string;
    value: number;
    status: "good" | "neutral" | "bad";
  }[];
  date: string;
}

const CardMetadata: React.FC<CardMetadataProps> = ({ metrics, date }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: "auto" // This ensures it stays at the bottom of the parent container
      }}
    >
      <Box>
        {metrics && <EvaluationMetrics metrics={metrics} />}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1 }}
      >
        Created: {date}
      </Typography>
    </Box>
  );
};

export default CardMetadata;
