import { Box } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CentralFloatingButton from "../components/evaluation/components/CentralFloatingButton";
import EvaluationSection from "../components/evaluation/EvaluationSection";
import { useEvaluationStats } from "../hooks/evaluation";
import { useTaskInitialization } from "../hooks/evaluation/core/useTaskInitialization";

// Style configurations
const SECTION_STYLE = {
  position: "absolute" as const,
  top: 0,
  height: "100%",
  zIndex: 1,
};

const EvaluationPage: React.FC = () => {
  const [centralExpanded, setCentralExpanded] = useState(false);
  const { ragCount, promptCount } = useEvaluationStats();
  useTaskInitialization(); // Hook handles task initialization automatically
  const navigate = useNavigate();
  // Stable callback for create evaluation navigation
  const handleCreateRagEvaluation = useCallback(() => {
    navigate("/evaluation/rag/create");
  }, [navigate]);

  const handleCreatePromptEvaluation = useCallback(() => {
    navigate("/evaluation/prompt/create");
  }, [navigate]);

  // Stable callback for central toggle
  const handleToggleCentral = useCallback(() => {
    setCentralExpanded((prev) => !prev);
  }, []);
  // Note: initializeActiveTasks is now handled by useEvaluationManager hook
  // No need to call it here to avoid duplicate initialization

  const isRagHovered = centralExpanded;
  const isPromptHovered = centralExpanded;

  return (
    <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Left Section - RAG */}
      <motion.div
        initial={{ width: "50%" }}
        animate={{ width: "50%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          ...SECTION_STYLE,
          left: 0,
        }}
      >
        {" "}
        <EvaluationSection
          type="rag"
          count={ragCount}
          isHovered={isRagHovered}
          isCreating={false}
          onCreateClick={handleCreateRagEvaluation}
        />
      </motion.div>

      {/* Right Section - Prompt */}
      <motion.div
        initial={{ width: "50%" }}
        animate={{ width: "50%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          ...SECTION_STYLE,
          right: 0,
        }}
      >
        <EvaluationSection
          type="prompt"
          count={promptCount}
          isHovered={isPromptHovered}
          isCreating={false}
          onCreateClick={handleCreatePromptEvaluation}
        />
      </motion.div>

      {/* Central Floating Button */}
      <CentralFloatingButton
        isExpanded={centralExpanded}
        onToggle={handleToggleCentral}
        onCreateRAG={handleCreateRagEvaluation}
        onCreatePrompt={handleCreatePromptEvaluation}
      />
    </Box>
  );
};

export default EvaluationPage;
