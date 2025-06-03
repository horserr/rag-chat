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
  Paper,
  useTheme,
} from "@mui/material";
import type { StepIconProps } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CreateIcon from "@mui/icons-material/Create";
import BarChartIcon from "@mui/icons-material/BarChart";
import DatasetIcon from "@mui/icons-material/Dataset";
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

// Custom step icon
const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed, icon } = props;
  const theme = useTheme();

  const icons: { [index: string]: React.ReactElement } = {
    1: <CreateIcon fontSize="small" />,
    2: <BarChartIcon fontSize="small" />,
    3: <DatasetIcon fontSize="small" />,
    4: <CheckCircleOutlineIcon fontSize="small" />,
  };

  return (
    <Box
      sx={{
        backgroundColor: completed
          ? theme.palette.primary.main
          : active
          ? theme.palette.primary.light
          : theme.palette.grey[200],
        color: completed || active ? "#fff" : theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 36,
        height: 36,
        transition: "all 0.3s",
      }}
    >
      {icons[String(icon)]}
    </Box>
  );
};

// Steps for the form
const steps = [
  "Configuration",
  "Metrics Selection",
  "Test Data",
  "Review",
];

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
  const theme = useTheme();
  const isCompletionStep = activeStep === 4;
  const isLastStep = activeStep === 3;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: isCompletionStep
            ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
            : "white",
          color: isCompletionStep ? "white" : "inherit",
          borderRadius: "8px 8px 0 0",
          p: 2,
        }}
      >
        <DialogTitle sx={{ p: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              {isCompletionStep
                ? "Evaluation Created Successfully!"
                : `Create ${
                    evaluationType === "rag" ? "RAG" : "Prompt"
                  } Evaluation`}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: isCompletionStep ? 'white' : 'inherit' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      </Paper>

      <DialogContent sx={{ p: 4, minHeight: "400px" }}>
        {!isCompletionStep && (
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepConnector-line": {
                borderColor: theme.palette.divider,
                borderTopWidth: 3,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}        {activeStep === 0 && (
          <ConfigurationStep
            formData={formData}
            onFormChange={onFormChange}
            evaluationType={evaluationType as "rag" | "prompt"}
          />
        )}
        {activeStep === 1 && (
          <MetricsStep
            formData={formData}
            onFormChange={onFormChange}
            onAddMetric={onAddMetric}
            evaluationType={evaluationType as "rag" | "prompt"}
          />
        )}
        {activeStep === 2 && (
          <TestDataStep
            formData={formData}
            onFormChange={onFormChange}
            evaluationType={evaluationType as "rag" | "prompt"}
          />
        )}
        {activeStep === 3 && (
          <ReviewStep
            formData={formData}
            evaluationType={evaluationType as "rag" | "prompt"}
          />
        )}
        {activeStep === 4 && (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 2,
              py: 4,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "white", mb: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Your {evaluationType === "rag" ? "RAG" : "Prompt"} evaluation has been created
            </Typography>
            <Typography variant="body1" sx={{ color: "white", opacity: 0.9 }} textAlign="center">
              {formData.title} is now ready. You can view it in your evaluation dashboard.
            </Typography>
          </Box>
        )}

        {!isCompletionStep ? (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={onBack} disabled={activeStep === 0} variant="outlined">
              Back
            </Button>
            <Button
              onClick={onNext}
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                borderRadius: 28,
                boxShadow: theme.shadows[2],
              }}
            >
              {isLastStep ? "Create Evaluation" : "Continue"}
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              onClick={onClose}
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.4)",
                },
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationFormDialog;
