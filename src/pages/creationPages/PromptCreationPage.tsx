import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CreationFlow from "../../components/evaluation/CreationFlow";

const PromptCreationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/evaluation");
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <CreationFlow evaluationType="prompt" onClose={handleClose} />
    </Box>
  );
};

export { PromptCreationPage };
export default PromptCreationPage;
