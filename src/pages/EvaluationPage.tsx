import React, { useState } from "react";
import { Box } from "@mui/material";
import EvaluationCard from "../components/evaluation/EvaluationCard";
import EvaluationFormDialog from "../components/evaluation/EvaluationFormDialog";
import type {
  EvaluationCardProps,
  FormData,
} from "../components/evaluation/types";
import EvaluationNewCard from "../components/evaluation/EvaluationNewCard";

const EvaluationPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [evaluationType, setEvaluationType] = useState<"rag" | "prompt" | null>(
    null
  );

  // Form state for the evaluation creation
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dataset: "",
    metrics: [],
    customMetric: "",
    threshold: 0.75,
    enableRealTimeMonitoring: false,
  });

  const handleNewEvaluation = (type: "rag" | "prompt") => {
    setEvaluationType(type);
    setOpenDialog(true);
    setActiveStep(0);
    // Reset form data when opening new evaluation dialog
    setFormData({
      title: "",
      description: "",
      dataset: "",
      metrics: [],
      customMetric: "",
      threshold: 0.75,
      enableRealTimeMonitoring: false,
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleNext = () => {
    if (activeStep === 3) {
      // If this is the last step, complete the form
      setActiveStep(4); // Move to completion step
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddMetric = () => {
    if (
      formData.customMetric &&
      !formData.metrics.includes(formData.customMetric)
    ) {
      setFormData({
        ...formData,
        metrics: [...formData.metrics, formData.customMetric],
        customMetric: "",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", margin: "-8px" }}>
          {/* New Evaluation Card */}
          <Box
            sx={{
              width: { xs: "100%", sm: "50%", md: "33.33%", lg: "20%" },
              padding: "8px",
            }}
          >
            {/* New Evaluation Card component to create RAG or Prompt evaluations */}
            <EvaluationNewCard
              onCreateRag={() => handleNewEvaluation("rag")}
              onCreatePrompt={() => handleNewEvaluation("prompt")}
            />
          </Box>
          {/* Sample Evaluation Cards */}
          {sampleEvaluations.map((evaluation) => (
            <Box
              key={evaluation.id}
              sx={{
                width: { xs: "100%", sm: "50%", md: "33.33%", lg: "20%" },
                padding: "8px",
              }}
            >
              <EvaluationCard evaluation={evaluation} />
            </Box>
          ))}
        </Box>

        {/* Evaluation Form Dialog */}
        <EvaluationFormDialog
          open={openDialog}
          onClose={handleClose}
          evaluationType={evaluationType}
          activeStep={activeStep}
          formData={formData}
          onFormChange={handleFormChange}
          onAddMetric={handleAddMetric}
          onNext={handleNext}
          onBack={handleBack}
        />
      </Box>
    </Box>
  );
};

export default EvaluationPage;

// Sample evaluation data (mock data)
const sampleEvaluations: EvaluationCardProps[] = [
  {
    id: "1",
    title: "RAG Knowledge Base Test",
    date: "May 21, 2025",
    type: "rag",
    metrics: [
      { name: "Relevance", value: 0.89, status: "good" },
      { name: "Context Recall", value: 0.76, status: "neutral" },
    ],
    description:
      "Evaluating knowledge retrieval accuracy from the finance corpus",
  },
  {
    id: "2",
    title: "Prompt Effectiveness Eval",
    date: "May 20, 2025",
    type: "prompt",
    metrics: [
      { name: "Clarity", value: 0.92, status: "good" },
      { name: "Consistency", value: 0.85, status: "good" },
    ],
    description: "Testing variations of customer service prompts",
  },
  {
    id: "3",
    title: "Retrieval Accuracy Test",
    date: "May 19, 2025",
    type: "rag",
    metrics: [
      { name: "Precision", value: 0.65, status: "bad" },
      { name: "Answer Quality", value: 0.71, status: "neutral" },
    ],
    description: "Measuring retrieval accuracy on technical documentation",
  },
  {
    id: "4",
    title: "Prompt Variation Analysis",
    date: "May 18, 2025",
    type: "prompt",
    metrics: [
      { name: "Response Time", value: 0.94, status: "good" },
      { name: "Accuracy", value: 0.67, status: "bad" },
    ],
    description: "Comparing different prompt structures for code generation",
  },
  {
    id: "5",
    title: "QA Context Relevance",
    date: "May 17, 2025",
    type: "rag",
    metrics: [
      { name: "Context Quality", value: 0.83, status: "good" },
      { name: "Citation Accuracy", value: 0.79, status: "neutral" },
    ],
    description: "Testing Q&A with various context window sizes",
  },
];
