import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";
import { buttonVariants } from "../utils";

interface CreateEvaluationButtonProps {
  type: "rag" | "prompt";
  color: string;
  onClick: () => void;
}

const CreateEvaluationButton: React.FC<CreateEvaluationButtonProps> = ({
  type,
  color,
  onClick
}) => {
  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      animate="hovered"
      exit="hidden"
    >
      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        startIcon={
          type === "rag" ? <StorageIcon /> : <DescriptionIcon />
        }
        sx={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          color: "white",
          px: 4,
          py: 1.5,
          borderRadius: 3,
          fontWeight: "bold",
          fontSize: "1.1rem",
          textTransform: "none",
          boxShadow: `0 8px 32px ${color}40`,
          "&:hover": {
            background: `linear-gradient(135deg, ${color}dd, ${color}bb)`,
            transform: "translateY(-2px)",
            boxShadow: `0 12px 40px ${color}50`,
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        Create {type === "rag" ? "RAG" : "Prompt"} Evaluation
      </Button>
    </motion.div>
  );
};

export default CreateEvaluationButton;
