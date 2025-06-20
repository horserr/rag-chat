import React from "react";
import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface EvaluationStatsCardProps {
  type: "rag" | "prompt";
  count: number;
  color: string;
}

const EvaluationStatsCard: React.FC<EvaluationStatsCardProps> = ({
  type,
  count,
  color
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the appropriate overview page
    if (type === "rag") {
      navigate("/evaluation/rag");
    } else {
      navigate("/evaluation/prompt");
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        mb: 4,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${color}20`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${color}30`,
          borderColor: `${color}40`,
        },
      }}      onClick={handleClick}
    >
      <Typography variant="h4" fontWeight="bold" color={color}>
        {count}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Active evaluation{count !== 1 ? "s" : ""}
      </Typography>
      <Typography
        variant="caption"
        sx={{ display: "block", mt: 1, color }}
      >
        Click to view all
      </Typography>
    </Card>
  );
};

export default EvaluationStatsCard;
