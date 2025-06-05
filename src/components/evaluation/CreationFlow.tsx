import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useEvaluationManager } from "../../hooks/evaluation";
import type { PromptFormData, RagFormData } from "../../models/evaluation-form";
import CreationLayout from "../../layouts/CreationLayout";
import PromptPreviewPanel from "./components/PromptPreviewPanel";
import RagPreviewPanel from "./components/RagPreviewPanel";
import CustomStepIcon from "./CreationFlow/components/CustomStepIcon";
import { useFormValidation } from "./CreationFlow/hooks/useFormValidation";
import { getStepsConfig, getTypeColor } from "./CreationFlow/utils/stepConfig";
import PromptConfigurationStep from "./form-steps/prompt/PromptConfigurationStep";
import PromptReviewStep from "./form-steps/prompt/PromptReviewStep";
import RagConfigurationStep from "./form-steps/rag/RagConfigurationStep";
import RagDatasetStep from "./form-steps/rag/RagDatasetStep";
import RagReviewStep from "./form-steps/rag/RagReviewStep";

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
    console.log("Handling next step:", activeStep, formData);
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
          const taskId = await evaluationManager.createRagTask(
            formData as RagFormData
          );
          await evaluationManager.createRagEvaluation(
            taskId,
            formData as RagFormData
          );
          evaluationManager.navigateToRagOverview();
        } else {
          await evaluationManager.createPromptTask(formData as PromptFormData);
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

  // 自定义背景渐变色
  const backgroundGradient = `linear-gradient(135deg, ${typeColor}80, ${typeColor}40)`;

  return (
    <CreationLayout
      title={`Create ${evaluationType.toUpperCase()} Evaluation`}
      titleColor={typeColor}
      onClose={onClose}
      backgroundGradient={backgroundGradient}
    >
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Column - Main Content */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxWidth: "65%",
          }}
        >
          {/* Main Content Area */}
          <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}
            {renderStepContent()}
          </Box>
        </Box>

        {/* Right Column - Preview Panel */}
        <Box
          sx={{
            flex: 2,
            borderLeft: 1,
            borderColor: "divider",
            bgcolor: theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Stepper Navigation */}
          <Box
            sx={{
              pt: 3,
              px: 4,
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2.5,
                mb: 0.5
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
                variant="outlined"
                size="medium"
              >
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: typeColor,
                  "&:hover": { bgcolor: typeColor, filter: "brightness(0.9)" },
                  minWidth: "120px"
                }}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isSubmitting
                  ? "Creating..."
                  : isLastStep
                  ? "Create Evaluation"
                  : "Next"}
              </Button>
            </Box>
          </Box>

          {/* Preview Panel */}
          <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                overflow: "auto",
                p: 2
              }}
            >
              {renderPreviewPanel()}
            </Paper>
          </Box>
        </Box>
      </Box>
    </CreationLayout>
  );
};

export default CreationFlow;
