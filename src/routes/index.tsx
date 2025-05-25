import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import EvaluationPage from "../pages/EvaluationPage";
import CloudPage from "../pages/CloudPage";

// Route definitions
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/evaluation" element={<EvaluationPage />} />
      <Route path="/cloud" element={<CloudPage />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
