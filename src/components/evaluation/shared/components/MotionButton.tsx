import { Button } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

/**
 * A button wrapped in motion effects for animated interactions
 */
const MotionButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium" | "large";
  sx?: SxProps<Theme>;
  title?: string;
  "aria-label"?: string;
}> = ({
  children,
  onClick,
  disabled = false,
  variant = "text",
  color = "primary",
  size = "medium",
  sx,
  title,
  "aria-label": ariaLabel,
}) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{ display: "inline-block" }}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        onClick={onClick}
        sx={sx}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default MotionButton;
