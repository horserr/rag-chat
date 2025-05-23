import React, { useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Animation keyframes for tag floating from behind the card
const tagFloatIn = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const tagFloatOut = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(20px); opacity: 0; }
`;

// Tag underline animation
const underlineAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

interface CardTagProps {
  type: "rag" | "prompt";
  isHovered: boolean;
  onClick?: () => void;
}

const CardTag: React.FC<CardTagProps> = ({ type, isHovered, onClick }) => {
  const [isTagHovered, setIsTagHovered] = useState(false);
  const theme = useTheme();

  // Colors based on the theme and improving theme integration
  const ragColor = theme.palette.primary.main;
  const promptColor = theme.palette.secondary.main;
  const tagColor = type === "rag" ? ragColor : promptColor;
  const tagBgColor = type === "rag"
    ? `rgba(${parseInt(tagColor.slice(1, 3), 16)}, ${parseInt(tagColor.slice(3, 5), 16)}, ${parseInt(tagColor.slice(5, 7), 16)}, 0.15)`
    : `rgba(${parseInt(tagColor.slice(1, 3), 16)}, ${parseInt(tagColor.slice(3, 5), 16)}, ${parseInt(tagColor.slice(5, 7), 16)}, 0.15)`;

  return (
    <Box
      sx={{
        position: "absolute",
        top: isHovered ? -5 : 12, // When hovered, it appears above the card, otherwise it's hidden behind
        right: 16,
        bgcolor: tagBgColor,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,        zIndex: 5,
        opacity: isHovered ? 1 : 0,        pointerEvents: isHovered ? "auto" : "none",
        cursor: "pointer",
        animation: isHovered
          ? `${tagFloatIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
          : `${tagFloatOut} 0.2s ease-in forwards`,
        boxShadow: isTagHovered ? "0 4px 8px rgba(0,0,0,0.12)" : "none",
        transform: isTagHovered ? "translateY(-2px)" : "none",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          bgcolor: tagBgColor,
        },
      }}
      onClick={onClick}
      onMouseEnter={() => setIsTagHovered(true)}
      onMouseLeave={() => setIsTagHovered(false)}
    >
      <Typography
        variant="caption"
        fontWeight="600"
        sx={{
          color: type === "rag" ? theme.palette.primary.main : theme.palette.secondary.main,
          position: "relative",
          transition: "all 0.3s ease",
          "&::after": isTagHovered ? {
            content: '""',
            position: "absolute",
            bottom: -2,
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "currentColor",
            animation: `${underlineAnimation} 0.3s forwards`,
          } : {},
        }}
      >
        {type === "rag" ? "RAG" : "PROMPT"}
      </Typography>
    </Box>
  );
};

export default CardTag;
