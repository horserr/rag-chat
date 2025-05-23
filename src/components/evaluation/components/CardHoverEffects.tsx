import React, { useState, ReactNode } from "react";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import { animations } from "../types";

interface CardHoverEffectsProps {
  children: ReactNode;
  backgroundColor: string;
  height?: number | string;
  width?: number | string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CardHoverEffects: React.FC<CardHoverEffectsProps> = ({
  children,
  backgroundColor,
  height = 240,
  width = "100%",
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [transform, setTransform] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
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
    const deltaY = (y - centerY) / centerY;
    const rotateX = deltaY * 3;
    const rotateY = -deltaX * 3;

    // Add slight easing to make movement more natural
    setTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };

  const handleMouseLeave = () => {
    // Reset transform and glow effects
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlowPosition({ x: 50, y: 50 });
  };  const handleMouseEnterCard = () => {
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  const handleMouseLeaveCard = () => {
    handleMouseLeave();
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <Card
      sx={{
        height: height,
        width: width,
        backgroundColor: backgroundColor,
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
              zIndex: 1,
            },
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeaveCard}
    >
      {children}
    </Card>
  );
};

export default CardHoverEffects;
