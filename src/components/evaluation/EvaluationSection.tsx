import React from "react";
import { Box, Typography, Button, Card, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";
import type { EvaluationCardProps } from "./types";

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
  const filteredEvaluations = evaluations.filter((evaluation) => evaluation.type === type);

  const getTypeColor = () => {
    return type === "rag" ? theme.palette.primary.main : theme.palette.secondary.main;
  };

  const getTypeBackground = () => {
    const color = getTypeColor();
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.03)`;
  };

  const containerVariants = {
    initial: { opacity: 1 },
    hovered: { opacity: 1 },
    creating: {
      width: "100%",
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    hidden: {
      width: "0%",
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
  };

  const contentVariants = {
    initial: { opacity: 0.7, scale: 0.98 },
    hovered: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    creating: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.95 },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    hovered: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 }
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: { duration: 0.2 }
    },
  };

  const getMotionState = () => {
    if (isCreating) return "creating";
    if (isHovered) return "hovered";
    return "initial";
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={getMotionState()}
      style={{
        height: "100vh",
        background: getTypeBackground(),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={contentVariants}
        animate={getMotionState()}
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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${getTypeColor()},
              ${getTypeColor()} 1px,
              transparent 1px,
              transparent 20px
            )`,
            zIndex: 0,
          }}
        />

        {/* Main content */}
        <Box
          sx={{
            textAlign: "center",
            zIndex: 1,
            maxWidth: 400,
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? (type === "rag" ? -5 : 5) : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {type === "rag" ? (
              <StorageIcon sx={{ fontSize: 80, color: getTypeColor(), mb: 2 }} />
            ) : (
              <DescriptionIcon sx={{ fontSize: 80, color: getTypeColor(), mb: 2 }} />
            )}
          </motion.div>

          {/* Title */}
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: getTypeColor(),
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {type === "rag" ? "RAG" : "Prompt"}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontWeight: 400,
            }}
          >
            {type === "rag"
              ? "Evaluate retrieval augmented generation performance"
              : "Analyze and optimize prompt effectiveness"
            }
          </Typography>

          {/* Stats */}
          <Card
            sx={{
              p: 2,
              mb: 4,
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${getTypeColor()}20`,
            }}
          >
            <Typography variant="h4" fontWeight="bold" color={getTypeColor()}>
              {filteredEvaluations.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active evaluation{filteredEvaluations.length !== 1 ? "s" : ""}
            </Typography>
          </Card>

          {/* Create button - appears on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate="hovered"
                exit="hidden"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={onCreateClick}
                  startIcon={type === "rag" ? <StorageIcon /> : <DescriptionIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${getTypeColor()}, ${getTypeColor()}dd)`,
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    textTransform: "none",
                    boxShadow: `0 8px 32px ${getTypeColor()}40`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${getTypeColor()}dd, ${getTypeColor()}bb)`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 40px ${getTypeColor()}50`,
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Create {type === "rag" ? "RAG" : "Prompt"} Evaluation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Creation flow content */}
        {isCreating && children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
            }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EvaluationSection;
