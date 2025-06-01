import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import EvaluationPage from "../pages/EvaluationPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { TokenService } from "../services/token.service";

// Route definitions
// todo change this
const AppRoutes: React.FC = () => {
  const [lastVisitedPage, setLastVisitedPage] = useState<string>("/chat");

  // Check local storage for last visited page
  useEffect(() => {
    const savedPage = localStorage.getItem("lastVisitedPage");
    if (savedPage) {
      setLastVisitedPage(savedPage);
    }
  }, []);

  // Save the last visited protected page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const pathname = window.location.pathname;
      if (pathname === "/chat" || pathname === "/evaluation") {
        localStorage.setItem("lastVisitedPage", pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluation"
        element={
          <ProtectedRoute>
            <EvaluationPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect based on auth status */}
      <Route
        path="*"
        element={
          TokenService.isTokenValid() ? (
            <Navigate to={lastVisitedPage} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
