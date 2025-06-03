import React from "react";
import { motion } from "framer-motion";

interface CreationFlowOverlayProps {
  children: React.ReactNode;
}

const CreationFlowOverlay: React.FC<CreationFlowOverlayProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: "20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
      }}
    >
      {children}
    </motion.div>
  );
};

export default CreationFlowOverlay;
