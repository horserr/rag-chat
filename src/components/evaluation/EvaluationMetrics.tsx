import React from "react";
import { Box, Chip } from "@mui/material";

interface MetricProps {
  name: string;
  value: number;
  status: "good" | "neutral" | "bad";
}

interface EvaluationMetricsProps {
  metrics: MetricProps[];
}

const EvaluationMetrics: React.FC<EvaluationMetricsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
      {metrics.map((metric, index) => (
        <Chip
          key={index}
          label={`${metric.name}: ${metric.value.toFixed(2)}`}
          size="small"
          sx={{
            bgcolor:
              metric.status === "good"
                ? "rgba(76, 175, 80, 0.1)"
                : metric.status === "bad"
                ? "rgba(244, 67, 54, 0.1)"
                : "rgba(255, 152, 0, 0.1)",
            color:
              metric.status === "good"
                ? "rgb(46, 125, 50)"
                : metric.status === "bad"
                ? "rgb(198, 40, 40)"
                : "rgb(230, 81, 0)",
            borderRadius: "4px",
          }}
        />
      ))}
    </Box>
  );
};

export default EvaluationMetrics;
