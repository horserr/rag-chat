import React from "react";
import {
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
import { motion } from "framer-motion";
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

interface CreationFlowProps {
  evaluationType: "rag" | "prompt";
  activeStep: number;
  formData: FormData;
  onFormChange: (field: string, value: unknown) => void;
  onAddMetric: () => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
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

const CreationFlow: React.FC<CreationFlowProps> = ({
  evaluationType,
  activeStep,
  formData,
  onFormChange,
  onAddMetric,
  onNext,
  onBack,
  onClose,
}) => {
  const theme = useTheme();
  const isCompletionStep = activeStep === 4;
  const isLastStep = activeStep === 3;

  const getTypeColor = () => {
    return evaluationType === "rag" ? theme.palette.primary.main : theme.palette.secondary.main;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: isCompletionStep
            ? `linear-gradient(45deg, ${getTypeColor()}, ${getTypeColor()}dd)`
            : "white",
          color: isCompletionStep ? "white" : "inherit",
          borderRadius: "8px 8px 0 0",
          p: 2,
          mb: 2,
        }}
      >
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
      </Paper>

      {/* Content */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
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
        )}

        {/* Step content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeStep === 0 && (
            <ConfigurationStep
              formData={formData}
              onFormChange={onFormChange}
              evaluationType={evaluationType}
            />
          )}
          {activeStep === 1 && (
            <MetricsStep
              formData={formData}
              onFormChange={onFormChange}
              onAddMetric={onAddMetric}
              evaluationType={evaluationType}
            />
          )}
          {activeStep === 2 && (
            <TestDataStep
              formData={formData}
              onFormChange={onFormChange}
              evaluationType={evaluationType}
            />
          )}
          {activeStep === 3 && (
            <ReviewStep
              formData={formData}
              evaluationType={evaluationType}
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
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: getTypeColor(), mb: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: getTypeColor() }}>
                Your {evaluationType === "rag" ? "RAG" : "Prompt"} evaluation has been created
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }} textAlign="center">
                {formData.title} is now ready. You can view it in your evaluation dashboard.
              </Typography>
            </Box>
          )}
        </motion.div>
      </Box>

      {/* Footer buttons */}
      {!isCompletionStep ? (
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button onClick={onBack} disabled={activeStep === 0} variant="outlined">
            Back
          </Button>
          <Button
            onClick={onNext}
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 28,
              backgroundColor: getTypeColor(),
              "&:hover": {
                backgroundColor: `${getTypeColor()}dd`,
              },
            }}
          >
            {isLastStep ? "Create Evaluation" : "Continue"}
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 28,
              backgroundColor: getTypeColor(),
              "&:hover": {
                backgroundColor: `${getTypeColor()}dd`,
              },
            }}
          >
            Close
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default CreationFlow;
