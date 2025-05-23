// filepath: i:\Web\rag-chat\src\components\evaluation\NewEvaluationCard.tsx
import React, { useState } from "react";
import { useTheme } from "@mui/material";
import CardHoverEffects from "./components/CardHoverEffects";
import NewEvaluationCardContent from "./components/NewEvaluationCardContent";

interface NewEvaluationCardProps {
  onCreateRag: () => void;
  onCreatePrompt: () => void;
}

const NewEvaluationCard: React.FC<NewEvaluationCardProps> = ({
  onCreateRag,
  onCreatePrompt,
}) => {
  const [hoveredSection, setHoveredSection] = useState<
    "none" | "card" | "rag" | "prompt"
  >("none");
  const theme = useTheme();

  // Get dynamic background based on hover state with themed colors
  const getBackground = () => {
    if (hoveredSection === "rag")
      return `rgba(${parseInt(theme.palette.primary.main.slice(1, 3), 16)}, ${parseInt(theme.palette.primary.main.slice(3, 5), 16)}, ${parseInt(theme.palette.primary.main.slice(5, 7), 16)}, 0.12)`;
    if (hoveredSection === "prompt")
      return `rgba(${parseInt(theme.palette.secondary.main.slice(1, 3), 16)}, ${parseInt(theme.palette.secondary.main.slice(3, 5), 16)}, ${parseInt(theme.palette.secondary.main.slice(5, 7), 16)}, 0.12)`;

    return hoveredSection === "none"
      ? theme.palette.grey[200]
      : `linear-gradient(95deg,
          rgba(${parseInt(theme.palette.primary.main.slice(1, 3), 16)}, ${parseInt(theme.palette.primary.main.slice(3, 5), 16)}, ${parseInt(theme.palette.primary.main.slice(5, 7), 16)}, 0.1) -13.14%,
          rgba(${parseInt(theme.palette.secondary.main.slice(1, 3), 16)}, ${parseInt(theme.palette.secondary.main.slice(3, 5), 16)}, ${parseInt(theme.palette.secondary.main.slice(5, 7), 16)}, 0.1) 109.8%)`;
  };

  return (
    <CardHoverEffects
      backgroundColor={getBackground()}
      onMouseEnter={() => setHoveredSection("card")}
      onMouseLeave={() => setHoveredSection("none")}
    >
      <NewEvaluationCardContent
        hoveredSection={hoveredSection}
        onCreateRag={onCreateRag}
        onCreatePrompt={onCreatePrompt}
        setHoveredSection={setHoveredSection}
      />
    </CardHoverEffects>
  );
};

export default NewEvaluationCard;
