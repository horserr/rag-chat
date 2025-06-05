import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

export interface MetricProps {
  name: string;
  value: number;
  status: "good" | "neutral" | "bad";
  description?: string;
}

interface EvaluationMetricsProps {
  metrics: MetricProps[];
  showDescription?: boolean;
}

const getStatusColors = (status: string) => {
  switch (status) {
    case "good":
      return {
        bgcolor: "rgba(76, 175, 80, 0.1)",
        color: "rgb(46, 125, 50)"
      };
    case "bad":
      return {
        bgcolor: "rgba(244, 67, 54, 0.1)",
        color: "rgb(198, 40, 40)"
      };
    case "neutral":
    default:
      return {
        bgcolor: "rgba(255, 152, 0, 0.1)",
        color: "rgb(230, 81, 0)"
      };
  }
};

const formatValue = (value: number) => {
  // Handle percentage values
  if (value <= 1.0) {
    return `${(value * 100).toFixed(0)}%`;
  }
  // Handle scores that are greater than 1
  return value.toFixed(2);
};

const EvaluationMetrics: React.FC<EvaluationMetricsProps> = ({
  metrics,
  showDescription = false
}) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
      {metrics.map((metric, index) => {
        const { bgcolor, color } = getStatusColors(metric.status);

        const chip = (
          <Chip
            key={index}
            label={`${metric.name}: ${formatValue(metric.value)}`}
            size="small"
            icon={metric.description && showDescription ? <InfoIcon fontSize="small" /> : undefined}
            sx={{
              bgcolor,
              color,
              borderRadius: "4px",
            }}
          />
        );

        return metric.description && showDescription ? (
          <Tooltip key={index} title={metric.description} arrow>
            {chip}
          </Tooltip>
        ) : chip;
      })}
    </Box>
  );
};

export default EvaluationMetrics;
