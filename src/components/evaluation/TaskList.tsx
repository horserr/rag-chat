import React from "react";
import { Box, Typography, Card, CardContent, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import EvaluationMetrics from "./EvaluationMetrics";
import type { EvaluationCardProps } from "./types";

interface TaskListProps {
  evaluations: EvaluationCardProps[];
  type: "rag" | "prompt";
  isVisible: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ evaluations, type, isVisible }) => {
  const theme = useTheme();
  const filteredEvaluations = evaluations.filter((evaluation) => evaluation.type === type);

  // Show a message when there are no evaluations
  if (filteredEvaluations.length === 0) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No {type.toUpperCase()} evaluations available
        </Typography>
      </Box>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, x: type === "rag" ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getTypeColor = () => {
    return type === "rag" ? theme.palette.primary.main : theme.palette.secondary.main;
  };

  const getTypeBackground = () => {
    const color = getTypeColor();
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.05)`;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ height: "100%", padding: "20px" }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: getTypeColor(),
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {type === "rag" ? "RAG" : "Prompt"} Evaluations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredEvaluations.length} active evaluation{filteredEvaluations.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {filteredEvaluations.map((evaluation, index) => (
          <motion.div key={evaluation.id} variants={itemVariants} custom={index}>
            <Card
              sx={{
                mb: 2,
                background: getTypeBackground(),
                border: `1px solid ${getTypeColor()}20`,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                  borderColor: `${getTypeColor()}40`,
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.3, flexGrow: 1 }}>
                    {evaluation.title}
                  </Typography>
                  <Chip
                    label={type.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getTypeColor(),
                      color: "white",
                      fontWeight: "bold",
                      ml: 1,
                    }}
                  />
                </Box>

                {evaluation.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.4 }}
                  >
                    {evaluation.description.length > 100
                      ? `${evaluation.description.substring(0, 100)}...`
                      : evaluation.description}
                  </Typography>
                )}

                {evaluation.metrics && <EvaluationMetrics metrics={evaluation.metrics} />}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  Created: {evaluation.date}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredEvaluations.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No {type} evaluations yet
            </Typography>
            <Typography variant="body2">
              Create your first {type} evaluation to get started
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default TaskList;
