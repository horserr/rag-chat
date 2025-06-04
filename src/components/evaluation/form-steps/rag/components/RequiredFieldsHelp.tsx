import React from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import { DATASET_VALIDATION } from "../../../../../models/evaluation-form";
import type { EvaluationType } from "../../../../../models/rag-evaluation";

interface RequiredFieldsHelpProps {
  evaluationType: EvaluationType;
}

const RequiredFieldsHelp: React.FC<RequiredFieldsHelpProps> = ({
  evaluationType,
}) => {
  const fields = DATASET_VALIDATION.requiredFields[evaluationType];

  const getEvaluationTypeLabel = (type: EvaluationType) => {
    switch (type) {
      case "single_turn":
        return "单轮评估";
      case "custom":
        return "自定义评估";
      case "multi_turn":
        return "多轮评估";
      default:
        return "评估";
    }
  };

  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>{getEvaluationTypeLabel(evaluationType)}</strong>
        需要以下字段：
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {fields.map((field) => (
          <Chip key={field} label={field} size="small" />
        ))}
      </Box>
    </Alert>
  );
};

export default RequiredFieldsHelp;
