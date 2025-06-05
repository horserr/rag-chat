import React from "react";
import { motion } from "framer-motion";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";

interface TypeIconProps {
  type: "rag" | "prompt";
  color: string;
  isHovered: boolean;
}

const TypeIcon: React.FC<TypeIconProps> = ({ type, color, isHovered }) => {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.2 : 1,
        rotate: isHovered ? (type === "rag" ? -5 : 5) : 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {type === "rag" ? (
        <StorageIcon
          sx={{ fontSize: 80, color, mb: 2 }}
        />
      ) : (
        <DescriptionIcon
          sx={{ fontSize: 80, color, mb: 2 }}
        />
      )}
    </motion.div>
  );
};

export default TypeIcon;
