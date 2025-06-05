import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CreationFlow from "../../components/evaluation/CreationFlow";

const RagCreationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/evaluation");
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <CreationFlow evaluationType="rag" onClose={handleClose} />
    </Box>
  );
};

export { RagCreationPage };
export default RagCreationPage;
