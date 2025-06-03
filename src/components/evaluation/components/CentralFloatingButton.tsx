import React from "react";
import { Box, Fab, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
// import StorageIcon from "@mui/icons-material/Storage";
// import DescriptionIcon from "@mui/icons-material/Description";

interface CentralFloatingButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  onCreateRAG: () => void;
  onCreatePrompt: () => void;
}

const CentralFloatingButton: React.FC<CentralFloatingButtonProps> = ({
  isExpanded,
  onToggle,
  // onCreateRAG,
  // onCreatePrompt,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="main-button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Fab
              color="primary"
              onClick={onToggle}
              sx={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: theme.shadows[6],
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AddIcon sx={{ fontSize: 32, color: "white" }} />
              </motion.div>
            </Fab>
          </motion.div>
        ) : // <>
        //   {/* Buttons container */}
        //   <motion.div
        //     key="expanded-buttons"
        //     initial={{ scale: 0, opacity: 0 }}
        //     animate={{ scale: 1, opacity: 1 }}
        //     exit={{ scale: 0, opacity: 0 }}
        //     transition={{ duration: 0.1, ease: "easeOut" }}
        //     style={{
        //       position: "relative",
        //       display: "flex",
        //       alignItems: "center",
        //       gap: "0.4rem", // Increased gap to make room for center button
        //       justifyContent: "center",
        //     }}
        //   >
        //     {/* RAG Evaluation Button */}
        //     <motion.div
        //       initial={{ x: 50, opacity: 0 }}
        //       animate={{ x: 0, opacity: 1 }}
        //       transition={{ duration: 0.2, delay: 0.05 }}
        //     >
        //       <Button
        //         variant="contained"
        //         size="large"
        //         onClick={onCreateRAG}
        //         startIcon={<StorageIcon />}
        //         sx={{
        //           background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        //           color: "white",
        //           px: 3,
        //           py: 1.5,
        //           borderRadius: 3,
        //           fontWeight: "bold",
        //           fontSize: "0.9rem",
        //           textTransform: "none",
        //           boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
        //           minWidth: "180px",
        //           "&:hover": {
        //             background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        //             transform: "translateY(-2px)",
        //             boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
        //           },
        //           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        //         }}
        //       >
        //         <Box sx={{ textAlign: "left" }}>
        //           <Typography
        //             variant="body1"
        //             sx={{ fontWeight: "bold", color: "white" }}
        //           >
        //             Create RAG
        //           </Typography>
        //         </Box>
        //       </Button>
        //     </motion.div>

        //     {/* Close button - positioned independently at center */}
        //     <motion.div
        //       initial={{ scale: 0, opacity: 0 }}
        //       animate={{ scale: 1, opacity: 1 }}
        //       transition={{ duration: 0.2, delay: 0.1 }}
        //       style={{
        //         transform: "translate(-50%, -60%)",
        //         zIndex: 10,
        //       }}
        //     >
        //       <Fab
        //         size="small"
        //         onClick={onToggle}
        //         sx={{
        //           width: 40,
        //           height: 40,
        //           backgroundColor: "rgba(0,0,0,0.1)",
        //           color: "rgba(0,0,0,0.6)",
        //           "&:hover": {
        //             backgroundColor: "rgba(0,0,0,0.2)",
        //           },
        //         }}
        //       >
        //         <motion.div
        //           animate={{ rotate: 45 }}
        //           transition={{ duration: 0.3, ease: "easeInOut" }}
        //         >
        //           <AddIcon sx={{ fontSize: 20 }} />
        //         </motion.div>
        //       </Fab>
        //     </motion.div>

        //     {/* Prompt Evaluation Button */}
        //     <motion.div
        //       initial={{ x: -50, opacity: 0 }}
        //       animate={{ x: 0, opacity: 1 }}
        //       transition={{ duration: 0.2, delay: 0.05 }}
        //     >
        //       <Button
        //         variant="contained"
        //         size="large"
        //         onClick={onCreatePrompt}
        //         startIcon={<DescriptionIcon />}
        //         sx={{
        //           background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
        //           color: "white",
        //           px: 3,
        //           py: 1.5,
        //           borderRadius: 3,
        //           fontWeight: "bold",
        //           fontSize: "0.9rem",
        //           textTransform: "none",
        //           boxShadow: `0 8px 32px ${theme.palette.secondary.main}40`,
        //           minWidth: "180px",
        //           "&:hover": {
        //             background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
        //             transform: "translateY(-2px)",
        //             boxShadow: `0 12px 40px ${theme.palette.secondary.main}50`,
        //           },
        //           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        //         }}
        //       >
        //         <Box sx={{ textAlign: "left" }}>
        //           <Typography
        //             variant="body1"
        //             sx={{ fontWeight: "bold", color: "white" }}
        //           >
        //             Create Prompt
        //           </Typography>
        //         </Box>
        //       </Button>
        //     </motion.div>
        //   </motion.div>
        // </>
        null}
      </AnimatePresence>

      {/* Background ripple effect */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: `2px solid ${theme.palette.primary.main}`,
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default CentralFloatingButton;
