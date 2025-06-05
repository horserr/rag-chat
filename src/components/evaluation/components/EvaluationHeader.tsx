import React from "react";
import { Typography } from "@mui/material";

interface EvaluationHeaderProps {
  type: "rag" | "prompt";
  color: string;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({ type, color }) => {
  return (
    <>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color,
          mb: 2,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {type === "rag" ? "RAG" : "Prompt"}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          mb: 4,
          fontWeight: 400,
        }}
      >
        {type === "rag"
          ? "Evaluate retrieval augmented generation performance"
          : "Analyze and optimize prompt effectiveness"}
      </Typography>
    </>
  );
};

export default EvaluationHeader;
