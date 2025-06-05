import React, { useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useEvaluationManager } from "../../hooks/evaluation";
import type { PromptFormData, RagFormData } from "../../models/evaluation-form";
import PromptPreviewPanel from "./components/PromptPreviewPanel";
import RagPreviewPanel from "./components/RagPreviewPanel";
import PromptConfigurationStep from "./form-steps/prompt/PromptConfigurationStep.tsx";
import PromptReviewStep from "./form-steps/prompt/PromptReviewStep.tsx";
import RagConfigurationStep from "./form-steps/rag/RagConfigurationStep.tsx";
import RagDatasetStep from "./form-steps/rag/RagDatasetStep.tsx";
import RagReviewStep from "./form-steps/rag/RagReviewStep.tsx";
import CustomStepIcon from "./CreationFlow/components/CustomStepIcon";
import { useFormValidation } from "./CreationFlow/hooks/useFormValidation";
import { getStepsConfig, getTypeColor } from "./CreationFlow/utils/stepConfig";

interface CreationFlowProps {
  evaluationType: "rag" | "prompt";
  onClose: () => void;
}

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

  // Configuration
  const { steps } = getStepsConfig(evaluationType);
  const typeColor = getTypeColor(evaluationType, theme);
  const { validateStep } = useFormValidation(evaluationType, formData);

  // Form handlers
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleFormChange = useCallback(
    (field: string, value: unknown) => {
      updateFormData({ [field]: value });
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [updateFormData, errors]
  );

  // Navigation handlers
  const handleNext = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateStep(activeStep);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

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
        onClose();
      } catch (error) {
        console.error("Failed to submit evaluation:", error);
        setErrors({
          general: "Failed to create evaluation. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, [
    activeStep,
    steps.length,
    validateStep,
    evaluationType,
    formData,
    evaluationManager,
    onClose,
  ]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    setErrors({});
  }, []);

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
              errors={errors}
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
            <RagReviewStep formData={ragData} onFormChange={handleFormChange} />
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
              errors={errors}
            />
          );
        case 1:
          return (
            <PromptReviewStep
              formData={promptData}
              onFormChange={handleFormChange}
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
      const ragData = formData as RagFormData;
      return <RagPreviewPanel formData={ragData} currentStep={activeStep} />;
    } else {
      const promptData = formData as PromptFormData;
      return (
        <PromptPreviewPanel formData={promptData} currentStep={activeStep} />
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color={typeColor}>
          Create {evaluationType.toUpperCase()} Evaluation
        </Typography>{" "}
        <IconButton onClick={onClose} color="default">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main Content */}
        <Box sx={{ flex: 2, p: 3, overflow: "auto" }}>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}
          {renderStepContent()}
        </Box>

        {/* Preview Panel */}
        <Box
          sx={{
            flex: 1,
            borderLeft: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            overflow: "auto",
          }}
        >
          {renderPreviewPanel()}
        </Box>
      </Box>

      {/* Footer */}
      <Paper
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          borderTop: 1,
          borderColor: "divider",
          borderRadius: 0,
        }}
        elevation={0}
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
          sx={{ bgcolor: typeColor, "&:hover": { bgcolor: typeColor } }}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting
            ? "Creating..."
            : isLastStep
            ? "Create Evaluation"
            : "Next"}
        </Button>
      </Paper>
    </motion.div>
  );
};

export default CreationFlow;
