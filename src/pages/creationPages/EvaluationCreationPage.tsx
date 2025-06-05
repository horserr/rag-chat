import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import CreationFlow from "../../components/evaluation/CreationFlow";

const EvaluationCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract evaluation type from the URL path
  const evaluationType = location.pathname.includes("/prompt/") ? "prompt" : "rag";

  const handleClose = () => {
    navigate("/evaluation");
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <CreationFlow evaluationType={evaluationType} onClose={handleClose} />
    </Box>
  );
};

export default EvaluationCreationPage;
