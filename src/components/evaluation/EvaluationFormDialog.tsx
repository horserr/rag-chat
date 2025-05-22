import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { FormData } from "./types";
import ConfigurationStep from "./form-steps/ConfigurationStep";
import MetricsStep from "./form-steps/MetricsStep";
import TestDataStep from "./form-steps/TestDataStep";
import ReviewStep from "./form-steps/ReviewStep";

interface EvaluationFormDialogProps {
  open: boolean;
  onClose: () => void;
  evaluationType: "rag" | "prompt" | null;
  activeStep: number;
  formData: FormData;
  onFormChange: (field: string, value: unknown) => void;
  onAddMetric: () => void;
  onNext: () => void;
  onBack: () => void;
}

const EvaluationFormDialog: React.FC<EvaluationFormDialogProps> = ({
  open,
  onClose,
  evaluationType,
  activeStep,
  formData,
  onFormChange,
  onAddMetric,
  onNext,
  onBack,
}) => {
  if (!evaluationType) return null;

  const steps =
    evaluationType === "rag"
      ? ["Configure RAG", "Select Metrics", "Set Test Data", "Review"]
      : ["Create Prompt", "Define Variables", "Set Baseline", "Review"];

  // Get step content based on active step
  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ConfigurationStep
            formData={formData}
            onFormChange={onFormChange}
            evaluationType={evaluationType}
          />
        );
      case 1:
        return (
          <MetricsStep
            formData={formData}
            onFormChange={onFormChange}
            onAddMetric={onAddMetric}
            evaluationType={evaluationType}
          />
        );
      case 2:
        return (
          <TestDataStep
            formData={formData}
            onFormChange={onFormChange}
            evaluationType={evaluationType}
          />
        );
      case 3:
        return (
          <ReviewStep formData={formData} evaluationType={evaluationType} />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {evaluationType === "rag"
              ? "New RAG Evaluation"
              : "New Prompt Evaluation"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 4, mb: 2 }}>
            {activeStep === steps.length ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <Typography variant="h6" gutterBottom>
                  All steps completed - you're done!
                </Typography>
                <Typography variant="body1" mb={4}>
                  Your {evaluationType === "rag" ? "RAG" : "Prompt"} evaluation
                  task has been created.
                </Typography>
                <Button onClick={onClose} color="primary" variant="contained">
                  Close
                </Button>
              </Box>
            ) : (
              <Box>
                {getStepContent()}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={onBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={activeStep === steps.length - 1 ? onNext : onNext}
                  >
                    {activeStep === steps.length - 1 ? "Create" : "Next"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationFormDialog;
