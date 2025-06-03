import type { Theme } from "@mui/material";

export const getTypeColor = (type: "rag" | "prompt", theme: Theme): string => {
  return type === "rag"
    ? theme.palette.primary.main
    : theme.palette.secondary.main;
};

export const getTypeBackground = (color: string): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.03)`;
};

// Framer motion variants
export const containerVariants = {
  initial: { opacity: 1 },
  hovered: { opacity: 1 },
  creating: {
    width: "100%",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  hidden: {
    width: "0%",
    opacity: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export const contentVariants = {
  initial: { opacity: 0.7, scale: 0.98 },
  hovered: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  creating: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.95 },
};

export const buttonVariants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  hovered: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
  },
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

export const getMotionState = (isCreating: boolean, isHovered: boolean) => {
  if (isCreating) return "creating";
  if (isHovered) return "hovered";
  return "initial";
};
