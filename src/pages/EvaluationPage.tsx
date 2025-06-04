import { Box } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import CentralFloatingButton from "../components/evaluation/components/CentralFloatingButton";
import CreationFlow from "../components/evaluation/CreationFlow";
import EvaluationSection from "../components/evaluation/EvaluationSection";
import { useEvaluationStats } from "../hooks/evaluation";
import { useEvaluationManager } from "../hooks/evaluation";

type ViewState = "default" | "rag-creating" | "prompt-creating";

// Animation configurations
const SLIDE_ANIMATION = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 },
};

// Style configurations
const SECTION_STYLE = {
  position: "absolute" as const,
  top: 0,
  height: "100%",
  zIndex: 1,
};

const EvaluationPage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>("default");
  const [centralExpanded, setCentralExpanded] = useState(false);
  const { ragCount, promptCount } = useEvaluationStats();
  const { initializeActiveTasks } = useEvaluationManager();

  // Initialize active tasks when component mounts
  useEffect(() => {
    console.log("EvaluationPage mounted, initializing active tasks...");
    initializeActiveTasks();
  }, [initializeActiveTasks]);

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

  return (
    <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      {" "}      {/* When creating RAG evaluation */}
      {viewState === "rag-creating" && (
        <motion.div
          initial={SLIDE_ANIMATION.initial}
          animate={SLIDE_ANIMATION.animate}
          transition={SLIDE_ANIMATION.transition}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <CreationFlow evaluationType="rag" onClose={handleCloseCreation} />
        </motion.div>
      )}
      {/* When creating Prompt evaluation */}
      {viewState === "prompt-creating" && (
        <motion.div
          initial={SLIDE_ANIMATION.initial}
          animate={SLIDE_ANIMATION.animate}
          transition={SLIDE_ANIMATION.transition}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <CreationFlow
            evaluationType="prompt"
            onClose={handleCloseCreation}
          />
        </motion.div>
      )}{" "}
      {/* Default state - Split view */}
      {viewState === "default" && (
        <>
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
            <EvaluationSection
              type="rag"
              count={ragCount}
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
              ...SECTION_STYLE,
              right: 0,
            }}
          >
            <EvaluationSection
              type="prompt"
              count={promptCount}
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
