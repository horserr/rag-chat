import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { EVALUATION_CONSTANTS } from "./constants";

interface AnimatedPanelProps {
  children: React.ReactNode;
  isExpanded: boolean;
  borderRight?: boolean;
}

interface PlaceholderPanelProps {
  title: string;
  subtitle: string;
}

export const AnimatedPanel: React.FC<AnimatedPanelProps> = ({
  children,
  isExpanded,
  borderRight = false,
}) => (
  <motion.div
    initial={false}
    animate={{
      width: isExpanded
        ? EVALUATION_CONSTANTS.LAYOUT.PANEL_WIDTH_HALF
        : EVALUATION_CONSTANTS.LAYOUT.PANEL_WIDTH_FULL
    }}
    transition={{ duration: EVALUATION_CONSTANTS.ANIMATION.DURATION }}
    style={{
      borderRight: borderRight && isExpanded ? "1px solid #e0e0e0" : "none"
    }}
  >
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      {children}
    </Box>
  </motion.div>
);

export const DetailPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: EVALUATION_CONSTANTS.ANIMATION.DURATION }}
    style={{ width: EVALUATION_CONSTANTS.LAYOUT.PANEL_WIDTH_HALF }}
  >
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      {children}
    </Box>
  </motion.div>
);

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ title, subtitle }) => (
  <Box
    sx={{
      width: EVALUATION_CONSTANTS.LAYOUT.PANEL_WIDTH_HALF,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "grey.50",
    }}
  >
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Box>
);
