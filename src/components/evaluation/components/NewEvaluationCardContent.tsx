import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { animations } from "../types";
import { keyframes } from "@mui/system";

// Animation keyframes
const underlineLeftToRight = keyframes`
  0% { width: 0%; left: 0; }
  100% { width: 100%; left: 0; }
`;

const underlineRightToLeft = keyframes`
  0% { width: 0%; right: 0; }
  100% { width: 100%; right: 0; }
`;

const diagonalLineEntrance = keyframes`
  0% { width: 0%; opacity: 0; transform: translate(-50%, -50%) rotate(-15deg); }
  100% { width: 100%; opacity: 0.8; transform: translate(-50%, -50%) rotate(-15deg); }
`;

const diagonalLineExit = keyframes`
  0% { width: 100%; opacity: 0.8; transform: translate(-50%, -50%) rotate(-15deg); }
  100% { width: 100%; opacity: 0; transform: translate(-50%, -50%) rotate(-15deg); }
`;

interface NewEvaluationCardContentProps {
  hoveredSection: "none" | "card" | "rag" | "prompt";
  onCreateRag: () => void;
  onCreatePrompt: () => void;
  setHoveredSection: (section: "none" | "card" | "rag" | "prompt") => void;
}

const NewEvaluationCardContent: React.FC<NewEvaluationCardContentProps> = ({
  hoveredSection,
  onCreateRag,
  onCreatePrompt,
  setHoveredSection,
}) => {
  const theme = useTheme();

  return (
    <Box
      className="card-content"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Default state - just the add icon */}
      <Box
        className="default-state"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "opacity 0.3s ease",
          opacity: hoveredSection === "none" ? 1 : 0,
          position: "absolute",
        }}
      >
        <AddIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
        <Typography
          variant="body2"
          sx={{ mt: 1, color: theme.palette.text.secondary }}
        >
          Create New Evaluation
        </Typography>
      </Box>

      {/* Hover state overlay */}
      <Box
        className="hover-state"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: hoveredSection !== "none" ? 1 : 0,
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Diagonal line - visible only when card is hovered but not RAG/Prompt */}
        {hoveredSection !== "none" && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "2px",
              bgcolor: theme.palette.primary.main,
              transform: "translate(-50%, -50%) rotate(-15deg)",
              transformOrigin: "center center",
              zIndex: 1,
              opacity: hoveredSection === "card" ? 0.8 : 0,
              transition: "opacity 0.4s ease",
              animation:
                hoveredSection === "card"
                  ? `${diagonalLineEntrance} ${animations.diagonalLineAnimation}`
                  : `${diagonalLineExit} 0.3s ease forwards`,
            }}
          ></Box>
        )}
        {/* RAG option */}
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            left: "35%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "4px",
            zIndex: 2,
            transition: animations.hoverTransition,
          }}
          onClick={onCreateRag}
          onMouseEnter={() => setHoveredSection("rag")}
          onMouseLeave={() => setHoveredSection("card")}
        >
          <Typography
            variant="h5"
            fontWeight={hoveredSection === "rag" ? "700" : "500"}
            sx={{
              transition: animations.hoverTransition,
              position: "relative",
              color: theme.palette.primary.main,
              "&::after":
                hoveredSection === "rag"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: theme.palette.primary.main,
                      animation: `${underlineLeftToRight} ${animations.underlineAnimation} forwards`,
                    }
                  : {},
            }}
          >
            RAG
          </Typography>
        </Box>
        {/* Prompt option */}
        <Box
          sx={{
            position: "absolute",
            bottom: "35%",
            right: "35%",
            transform: "translate(50%, 50%)",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "4px",
            zIndex: 2,
            transition: animations.hoverTransition,
          }}
          onClick={onCreatePrompt}
          onMouseEnter={() => setHoveredSection("prompt")}
          onMouseLeave={() => setHoveredSection("card")}
        >
          <Typography
            variant="h5"
            fontWeight={hoveredSection === "prompt" ? "700" : "500"}
            sx={{
              transition: animations.hoverTransition,
              position: "relative",
              color: theme.palette.secondary.main,
              "&::after":
                hoveredSection === "prompt"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      right: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: theme.palette.secondary.main,
                      animation: `${underlineRightToLeft} ${animations.underlineAnimation} forwards`,
                    }
                  : {},
            }}
          >
            Prompt
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NewEvaluationCardContent;
