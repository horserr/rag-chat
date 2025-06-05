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
import { useNavigate } from "react-router-dom";
import { useEvaluationManager } from "../../hooks/evaluation";
import type { RagFormData } from "../../models/evaluation-form";
import RagPreviewPanel from "../../components/evaluation/components/RagPreviewPanel";
import RagConfigurationStep from "../../components/evaluation/form-steps/rag/RagConfigurationStep";
import RagDatasetStep from "../../components/evaluation/form-steps/rag/RagDatasetStep";
import RagReviewStep from "../../components/evaluation/form-steps/rag/RagReviewStep";
import CustomStepIcon from "../../components/evaluation/CreationFlow/components/CustomStepIcon";
import { useFormValidation } from "../../components/evaluation/CreationFlow/hooks/useFormValidation";
import { getStepsConfig, getTypeColor } from "../../components/evaluation/CreationFlow/utils/stepConfig";

const RagCreationPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const evaluationManager = useEvaluationManager();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data for RAG evaluation
  const [formData, setFormData] = useState<RagFormData>({
    taskName: "",
    description: "",
    evaluationType: "single_turn" as const,
    isTaskCreated: false,
  });

  // Configuration
  const { steps } = getStepsConfig("rag");
  const typeColor = getTypeColor("rag", theme);
  const { validateStep } = useFormValidation("rag", formData);

  // Form handlers
  const updateFormData = useCallback((updates: Partial<RagFormData>) => {
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
        const taskId = await evaluationManager.createRagTask(formData);
        await evaluationManager.createRagEvaluation(taskId, formData);
        evaluationManager.navigateToRagOverview();
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
    formData,
    evaluationManager,
  ]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    navigate("/evaluation");
  }, [navigate]);

  const isLastStep = activeStep === steps.length - 1;

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <RagConfigurationStep
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <RagDatasetStep
            formData={formData}
            onFormChange={handleFormChange}
          />
        );
      case 2:
        return (
          <RagReviewStep formData={formData} onFormChange={handleFormChange} />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
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
          Create RAG Evaluation
        </Typography>
        <IconButton onClick={handleClose} color="default">
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
          <RagPreviewPanel formData={formData} currentStep={activeStep} />
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

// Named export
export { RagCreationPage };

// Default export
export default RagCreationPage;
