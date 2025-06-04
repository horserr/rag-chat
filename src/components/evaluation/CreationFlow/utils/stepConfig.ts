import type { Theme } from "@mui/material/styles";

export const getStepsConfig = (evaluationType: "rag" | "prompt") => {
  if (evaluationType === "rag") {
    return {
      steps: ["Configuration", "Dataset Upload", "Review"],
      totalSteps: 3,
    };
  } else {
    return {
      steps: ["Configuration", "Review"],
      totalSteps: 2,
    };
  }
};

export const getTypeColor = (evaluationType: "rag" | "prompt", theme: Theme) => {
  return evaluationType === "rag"
    ? theme.palette.primary.main
    : theme.palette.secondary.main;
};
