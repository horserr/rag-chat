import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import EvaluationPage from "../pages/EvaluationPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { TokenService } from "../services/auth/token.service";
import { createEvaluationRoutes, createCreationRoutes, type RouteConfig } from "./utils/routeConfig";

// Route definitions
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
    const handlePageHide = () => {
      const pathname = window.location.pathname;
      if (pathname === "/chat" || pathname === "/evaluation") {
        localStorage.setItem("lastVisitedPage", pathname);
      }
    };

    // Use pagehide instead of beforeunload to avoid conflicts
    // and to properly save on actual page navigation
    window.addEventListener("pagehide", handlePageHide);

    // Also save on visibility change (when tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const pathname = window.location.pathname;
        if (pathname === "/chat" || pathname === "/evaluation") {
          localStorage.setItem("lastVisitedPage", pathname);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (    <Routes>
      {/* Creation routes - these don't use MainLayout */}
      {createCreationRoutes().map((route: RouteConfig) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Main routes - these use MainLayout */}
      <Route path="/*" element={
        <MainLayout>
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

            {/* Dynamic evaluation routes (non-creation) */}
            {createEvaluationRoutes().map((route: RouteConfig) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

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
        </MainLayout>
      } />
    </Routes>
  );
};

export default AppRoutes;
