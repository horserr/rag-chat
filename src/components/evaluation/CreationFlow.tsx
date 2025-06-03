import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import DatasetIcon from "@mui/icons-material/Dataset";
import type { StepIconProps } from "@mui/material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState, useCallback } from "react";
import RagConfigurationStep from "./form-steps/rag/RagConfigurationStep.tsx";
import RagDatasetStep from "./form-steps/rag/RagDatasetStep.tsx";
import RagReviewStep from "./form-steps/rag/RagReviewStep.tsx";
import PromptConfigurationStep from "./form-steps/prompt/PromptConfigurationStep.tsx";
import PromptReviewStep from "./form-steps/prompt/PromptReviewStep.tsx";
import RagPreviewPanel from "./components/RagPreviewPanel";
import PromptPreviewPanel from "./components/PromptPreviewPanel";
import type {
  RagFormData,
  PromptFormData
} from "./types/evaluation-form";
import { useEvaluationManager } from "../../hooks/evaluation/useEvaluationManager";

interface CreationFlowProps {
  evaluationType: "rag" | "prompt";
  onClose: () => void;
}

// Custom step icon
const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed, icon } = props;
  const theme = useTheme();

  const icons: { [index: string]: React.ReactElement } = {
    1: <CreateIcon fontSize="small" />,
    2: <DatasetIcon fontSize="small" />,
    3: <CheckCircleOutlineIcon fontSize="small" />,
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

const CreationFlow: React.FC<CreationFlowProps> = ({
  evaluationType,
  onClose,
}) => {
  const theme = useTheme();
  const evaluationManager = useEvaluationManager();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data based on evaluation type
  const [formData, setFormData] = useState<RagFormData | PromptFormData>(() => {
    if (evaluationType === "rag") {
      return {
        taskName: "",
        description: "",
        evaluationType: "single_turn" as const,
        isTaskCreated: false,
      } as RagFormData;
    } else {
      return {
        taskName: "",
        prompt: "",
        isTaskCreated: false,
      } as PromptFormData;
    }
  });

  // Steps configuration
  const ragSteps = ["Configuration", "Dataset Upload", "Review"];
  const promptSteps = ["Configuration", "Review"];
  const steps = evaluationType === "rag" ? ragSteps : promptSteps;

  const getTypeColor = () => {
    return evaluationType === "rag"
      ? theme.palette.primary.main
      : theme.palette.secondary.main;
  };

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (evaluationType === "rag") {
      const ragData = formData as RagFormData;

      switch (activeStep) {
        case 0: // Configuration
          if (!ragData.taskName?.trim()) {
            newErrors.taskName = "Task name is required";
          }
          if (!ragData.evaluationType) {
            newErrors.evaluationType = "Evaluation type is required";
          }
          if (ragData.evaluationType === 'single_turn' && ragData.metricId === undefined) {
            newErrors.metricId = "Metric selection is required";
          }
          break;
        case 1: // Dataset
          if (!ragData.datasetFile) {
            newErrors.datasetFile = "Dataset file is required";
          }
          break;
      }
    } else {
      const promptData = formData as PromptFormData;

      switch (activeStep) {
        case 0: // Configuration
          if (!promptData.taskName?.trim()) {
            newErrors.taskName = "Task name is required";
          }
          if (!promptData.prompt?.trim()) {
            newErrors.prompt = "Prompt is required";
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activeStep, formData, evaluationType]);

  const handleNext = useCallback(async () => {
    const isValid = validateStep();
    if (!isValid) return;

    if (activeStep === steps.length - 1) {
      // Final step - submit evaluation
      setIsSubmitting(true);
      try {
        if (evaluationType === "rag") {
          const ragData = formData as RagFormData;
          const taskId = await evaluationManager.createRagTask(ragData);
          await evaluationManager.createRagEvaluation(taskId, ragData);
          evaluationManager.navigateToRagOverview();
        } else {
          const promptData = formData as PromptFormData;
          const taskId = await evaluationManager.createPromptTask(promptData);
          await evaluationManager.createPromptEvaluation(taskId, promptData);
          evaluationManager.navigateToPromptOverview();
        }
        onClose(); // Close the dialog after successful creation
      } catch (error) {
        console.error("Failed to submit evaluation:", error);
        setErrors({ general: "Failed to create evaluation. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, steps.length, validateStep, evaluationType, formData, evaluationManager, onClose]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(0, prev - 1));
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleFormChange = useCallback((field: string, value: unknown) => {
    updateFormData({ [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [updateFormData, errors]);

  const isLastStep = activeStep === steps.length - 1;

  // Render step content
  const renderStepContent = () => {
    if (evaluationType === "rag") {
      const ragData = formData as RagFormData;

      switch (activeStep) {
        case 0:
          return (
            <RagConfigurationStep
              formData={ragData}
              onFormChange={handleFormChange}
            />
          );
        case 1:
          return (
            <RagDatasetStep
              formData={ragData}
              onFormChange={handleFormChange}
            />
          );
        case 2:
          return (
            <RagReviewStep
              formData={ragData}
            />
          );
        default:
          return null;
      }
    } else {
      const promptData = formData as PromptFormData;

      switch (activeStep) {
        case 0:
          return (
            <PromptConfigurationStep
              formData={promptData}
              onFormChange={handleFormChange}
            />
          );
        case 1:
          return (
            <PromptReviewStep
              formData={promptData}
            />
          );
        default:
          return null;
      }
    }
  };

  // Render preview panel
  const renderPreviewPanel = () => {
    if (evaluationType === "rag") {
      return (
        <RagPreviewPanel
          formData={formData as RagFormData}
          currentStep={activeStep}
        />
      );
    } else {
      return (
        <PromptPreviewPanel
          formData={formData as PromptFormData}
          currentStep={activeStep}
        />
      );
    }
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
          background: "white",
          borderRadius: "8px 8px 0 0",
          p: 2,
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Create {evaluationType === "rag" ? "RAG" : "Prompt"} Evaluation
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel - Preview */}
        <Box
          sx={{
            width: "40%",
            borderRight: 1,
            borderColor: "divider",
            p: 2,
            overflow: "auto",
          }}
        >
          {renderPreviewPanel()}
        </Box>

        {/* Right Panel - Form Steps */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Stepper */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                "& .MuiStepConnector-line": {
                  borderColor: theme.palette.divider,
                  borderTopWidth: 2,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}

            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Creating...
                </Box>
              ) : isLastStep ? (
                "Create Evaluation"
              ) : (
                "Continue"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CreationFlow;
