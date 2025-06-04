import { Box } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CentralFloatingButton from "../components/evaluation/components/CentralFloatingButton";
import CreationFlow from "../components/evaluation/CreationFlow";
import EvaluationSection from "../components/evaluation/EvaluationSection";
import TaskList from "../components/evaluation/TaskList";
import {
  RagEvaluationOverviewPage,
  RagEvaluationDetailPage,
  PromptEvaluationOverviewPage,
  PromptEvaluationDetailPage,
} from "./evalPages";
import type { EvaluationCardProps } from "../components/evaluation/types";

type ViewState = "default" | "rag-creating" | "prompt-creating";

const EvaluationPage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>("default");
  const [centralExpanded, setCentralExpanded] = useState(false);
  const location = useLocation();

  // Determine which page to render based on the current path
  const renderPageByRoute = () => {
    const path = location.pathname;

    if (path.includes("/rag/") && path.includes("/details")) {
      return <RagEvaluationDetailPage />;
    } else if (path.includes("/rag/") && path.includes("/eval/")) {
      return <RagEvaluationDetailPage />;
    } else if (path.includes("/rag")) {
      return <RagEvaluationOverviewPage />;
    } else if (path.includes("/prompt/") && path.includes("/details")) {
      return <PromptEvaluationDetailPage />;
    } else if (path.includes("/prompt/") && path.includes("/eval/")) {
      return <PromptEvaluationDetailPage />;
    } else if (path.includes("/prompt")) {
      return <PromptEvaluationOverviewPage />;
    }

    // Default evaluation page (original implementation)
    return null;
  };

  const routedPage = renderPageByRoute();

  // If we have a routed page, render it directly
  if (routedPage) {
    return routedPage;
  }
  const handleCreateEvaluation = (type: "rag" | "prompt") => {
    setViewState(type === "rag" ? "rag-creating" : "prompt-creating");
    setCentralExpanded(false);
  };

  const handleToggleCentral = () => {
    setCentralExpanded(!centralExpanded);
  };

  const handleCloseCreation = () => {
    setViewState("default");
  };

  const isRagHovered = centralExpanded && viewState === "default";
  const isPromptHovered = centralExpanded && viewState === "default";

  // Render the default evaluation page (original implementation)
  return (
    <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* When creating RAG evaluation */}
      {viewState === "rag-creating" && (
        <>
          {/* Left side - Task summary for RAG creation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "50%",
              zIndex: 5,
            }}
          >
            <TaskList
              evaluations={sampleEvaluations}
              type="rag"
              isVisible={true}
            />
          </motion.div>

          {/* Right side - Creation Flow for RAG */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "50%",
              zIndex: 10,
              backgroundColor: "white",
            }}
          >
            {" "}
            <CreationFlow evaluationType="rag" onClose={handleCloseCreation} />
          </motion.div>
        </>
      )}

      {/* When creating Prompt evaluation */}
      {viewState === "prompt-creating" && (
        <>
          {/* Left side - Task summary for Prompt creation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "50%",
              zIndex: 5,
            }}
          >
            <TaskList
              evaluations={sampleEvaluations}
              type="prompt"
              isVisible={true}
            />
          </motion.div>

          {/* Right side - Creation Flow for Prompt */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "50%",
              zIndex: 10,
              backgroundColor: "white",
            }}
          >
            {" "}
            <CreationFlow
              evaluationType="prompt"
              onClose={handleCloseCreation}
            />
          </motion.div>
        </>
      )}

      {/* Default state - Split view */}
      {viewState === "default" && (
        <>
          {/* Left Section - RAG */}
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              zIndex: 1,
            }}
          >
            <EvaluationSection
              type="rag"
              evaluations={sampleEvaluations}
              isHovered={isRagHovered}
              isCreating={false}
              onCreateClick={() => handleCreateEvaluation("rag")}
            />
          </motion.div>

          {/* Right Section - Prompt */}
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              zIndex: 1,
            }}
          >
            <EvaluationSection
              type="prompt"
              evaluations={sampleEvaluations}
              isHovered={isPromptHovered}
              isCreating={false}
              onCreateClick={() => handleCreateEvaluation("prompt")}
            />
          </motion.div>
        </>
      )}

      {/* Central Floating Button */}
      {viewState === "default" && (
        <CentralFloatingButton
          isExpanded={centralExpanded}
          onToggle={handleToggleCentral}
          onCreateRAG={() => handleCreateEvaluation("rag")}
          onCreatePrompt={() => handleCreateEvaluation("prompt")}
        />
      )}
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
