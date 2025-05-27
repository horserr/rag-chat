import React, { useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import type { EvaluationCardProps } from "./types";
import CardHoverEffects from "./components/CardHoverEffects";
import CardTag from "./components/CardTag";
import CardMetadata from "./components/CardMetadata";

const EvaluationCard: React.FC<{ evaluation: EvaluationCardProps }> = ({
  evaluation,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const isRAG = evaluation.type === "rag";
  const theme = useTheme();
  // Improved background colors with better theme integration
  const getBackground = () => {
    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;

    // Convert hex to rgba with proper transparency
    const colorToRgba = (color: string, alpha: number) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return isRAG
      ? colorToRgba(primaryColor, 0.08)
      : colorToRgba(secondaryColor, 0.08);
  };

  return (
    <CardHoverEffects
      backgroundColor={getBackground()}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <CardContent
        sx={{
          position: "relative",
          height: "100%",
          p: 3,
          pt: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tag that appears on hover */}
        <CardTag
          type={evaluation.type}
          isHovered={isCardHovered}
          onClick={() => console.log(`${evaluation.type} tag clicked`)}
        />

        {/* Card Content with flexible layout */}
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}>
          {/* Top section with title and description */}
          <Box>
            <Typography
              variant="h6"
              component="div"
              fontWeight="600"
              sx={{ lineHeight: 1.3, mb: 1 }}
            >
              {evaluation.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {evaluation.description && evaluation.description.length > 60
                ? `${evaluation.description.substring(0, 60)}...`
                : evaluation.description}
            </Typography>
          </Box>

          {/* Bottom section with metrics and date - always aligned to bottom */}
          <CardMetadata
            metrics={evaluation.metrics}
            date={evaluation.date}
          />
        </Box>
      </CardContent>
    </CardHoverEffects>
  );
};

export default EvaluationCard;
