import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { animations } from "./types";
import type { EvaluationCardProps } from "./types";
import EvaluationMetrics from "./EvaluationMetrics";

const EvaluationCard: React.FC<{ evaluation: EvaluationCardProps }> = ({
  evaluation,
}) => {
  const [transform, setTransform] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const isRAG = evaluation.type === "rag";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle 3D effect on mouse move (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized position for glow effect
    const normalizedX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const normalizedY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setGlowPosition({ x: normalizedX, y: normalizedY });

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY; // Further reduced rotation for an even more subtle and natural 3D effect
    const rotateX = deltaY * 3; // Reduced from 5 to 3 degrees for subtle movement
    const rotateY = -deltaX * 3; // Reduced from 5 to 3 degrees for subtle movement

    // Add slight easing to make movement more natural
    setTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };
  const handleMouseEnter = () => {
    // Card entered state is handled by the transform effect
  };

  const handleMouseLeave = () => {
    // Reset transform and glow effects
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <Card
      sx={{
        height: 240,
        width: "100%",
        backgroundColor: isRAG ? "#EBCBCB" : "#DDE2D2",
        boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
        borderRadius: 3,
        transition: animations.cardTransform,
        transform: transform,
        position: "relative",
        overflow: "hidden", // Ensure nothing extends beyond card boundaries
        "&:hover": {
          boxShadow:
            "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12)",
        },
        "&::after": isMobile
          ? {}
          : {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
              opacity: transform ? 1 : 0,
              transition: animations.glowTransition,
              pointerEvents: "none",
            },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent sx={{ position: "relative", height: "100%", p: 3, pt: 2 }}>
        {" "}
        {/* Reduced top padding */}
        <Box
          sx={{
            position: "absolute",
            top: 12, // Reduced from 16
            right: 16,
            bgcolor: isRAG
              ? "rgba(165, 111, 111, 0.2)"
              : "rgba(144, 158, 125, 0.2)",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" fontWeight="600">
            {isRAG ? "RAG" : "PROMPT"}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          {" "}
          {/* Reduced from mt: 4 */}
          <Typography
            variant="h6"
            component="div"
            fontWeight="600"
            gutterBottom
          >
            {evaluation.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {evaluation.description && evaluation.description.length > 60
              ? `${evaluation.description.substring(0, 60)}...`
              : evaluation.description}
          </Typography>
          {evaluation.metrics && (
            <EvaluationMetrics metrics={evaluation.metrics} />
          )}{" "}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 2 }}
          >
            Created: {evaluation.date}
          </Typography>{" "}
          {/* View Results button - positioned at the bottom right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              bottom: 13,
              right: 13,
              zIndex: 2, // Ensure button is above any other elements
            }}
          >
            <Button
              variant="text"
              disableRipple // Disable all ripple effects
              disableTouchRipple // Disable touch ripple
              disableFocusRipple // Disable focus ripple
              sx={{
                color: isRAG ? "#A56F6F" : "#606E52",
                fontWeight: 500,
                fontSize: "0.875rem",
                padding: "4px 8px",
                "&:hover": {
                  bgcolor: isRAG
                    ? "rgba(165, 111, 111, 0.08)"
                    : "rgba(144, 158, 125, 0.08)",
                  transform: "translateY(-1px)",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
                "&.MuiButtonBase-root": {
                  minWidth: "auto",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "1px",
                  background: "currentColor",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                },
                "&:hover::after": {
                  opacity: 0.6,
                },
                transition: "all 0.2s ease",
                textTransform: "none",
              }}
            >
              View Results
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EvaluationCard;
