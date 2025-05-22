import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { animations } from "./types";
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
  // Get dynamic background based on hover state
  const getBackground = () => {
    if (hoveredSection === "rag") return "#EBCBCB";
    if (hoveredSection === "prompt") return "#DDE2D2";
    return hoveredSection === "none"
      ? "#CAC9C9"
      : "linear-gradient(95deg, rgba(235, 203, 203, 0.9) -13.14%, rgba(221, 226, 210, 0.9) 109.8%)";
  };

  return (
    <Card
      sx={{
        height: 240,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: getBackground(),
        transition: animations.hoverTransition,
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden", // Keep diagonal line within card boundaries
        borderRadius: 3,
        "&:hover": {
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        },
      }}
      className="new-evaluation-card"
      onMouseEnter={() => setHoveredSection("card")}
      onMouseLeave={() => setHoveredSection("none")}
    >
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
          <AddIcon sx={{ fontSize: 48, color: "rgba(0,0,0,0.5)" }} />
          <Typography variant="body2" sx={{ mt: 1, color: "rgba(0,0,0,0.6)" }}>
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
          {" "}
          {/* Diagonal line - visible only when card is hovered but not RAG/Prompt */}
          {hoveredSection !== "none" && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "2px",
                bgcolor: "#A56F6F",
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
                "&::after":
                  hoveredSection === "rag"
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: "-4px",
                        left: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#A56F6F",
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
                "&::after":
                  hoveredSection === "prompt"
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: "-4px",
                        right: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#606E52",
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
    </Card>
  );
};

export default NewEvaluationCard;
