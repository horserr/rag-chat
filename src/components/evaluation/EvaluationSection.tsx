import { Box, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  BackgroundPattern,
  CreateEvaluationButton,
  CreationFlowOverlay,
  EvaluationHeader,
  EvaluationStatsCard,
  TypeIcon,
} from "./components";
import type { EvaluationCardProps } from "./types";
import {
  containerVariants,
  contentVariants,
  getMotionState,
  getTypeBackground,
  getTypeColor,
} from "./utils";

interface EvaluationSectionProps {
  type: "rag" | "prompt";
  evaluations: EvaluationCardProps[];
  isHovered: boolean;
  isCreating: boolean;
  onCreateClick: () => void;
  children?: React.ReactNode;
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  type,
  evaluations,
  isHovered,
  isCreating,
  onCreateClick,
  children,
}) => {
  const theme = useTheme();
  const filteredEvaluations = evaluations.filter(
    (evaluation) => evaluation.type === type
  );

  const color = getTypeColor(type, theme);
  const background = getTypeBackground(color);
  const motionState = getMotionState(isCreating, isHovered);

  return (
    <motion.div
      variants={containerVariants}
      animate={motionState}
      style={{
        height: "100vh",
        background: background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={contentVariants}
        animate={motionState}
        style={{
          height: "100%",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <BackgroundPattern color={color} />

        {/* Main content */}
        <Box
          sx={{
            textAlign: "center",
            zIndex: 1,
            maxWidth: 400,
          }}
        >
          {/* Icon */}
          <TypeIcon type={type} color={color} isHovered={isHovered} />

          {/* Title and Description */}
          <EvaluationHeader type={type} color={color} />

          {/* Stats Card */}
          <EvaluationStatsCard
            type={type}
            count={filteredEvaluations.length}
            color={color}
          />

          {/* Create button - appears on hover */}
          <AnimatePresence>
            {isHovered && (
              <CreateEvaluationButton
                type={type}
                color={color}
                onClick={onCreateClick}
              />
            )}
          </AnimatePresence>
        </Box>

        {/* Creation flow content */}
        {isCreating && children && (
          <CreationFlowOverlay>{children}</CreationFlowOverlay>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EvaluationSection;
