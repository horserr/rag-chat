import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import {
  RagEvaluationOverviewPage,
  RagEvaluationDetailPage,
  PromptEvaluationOverviewPage,
  PromptEvaluationDetailPage,
} from "../../pages/evalPages";
import EvaluationCreationPage from "../../pages/creationPages/EvaluationCreationPage";
import ChatPage from "../../pages/ChatPage";
import EvaluationPage from "../../pages/EvaluationPage";
import KnowledgePage from "../../pages/KnowledgePage";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import { TokenService } from "../../services/auth/token.service";

// Route configuration types
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

// Helper function to create protected routes
const createProtectedRoute = (Component: React.ComponentType) =>
  React.createElement(ProtectedRoute, null, React.createElement(Component));

// Creation routes - these use their own layout (CreationLayout)
export const createCreationRoutes = (): RouteConfig[] => {
  return [
    {
      path: "/evaluation/rag/create",
      element: createProtectedRoute(() =>
        React.createElement(EvaluationCreationPage, { key: "rag" })
      ),
    },
    {
      path: "/evaluation/prompt/create",
      element: createProtectedRoute(() =>
        React.createElement(EvaluationCreationPage, { key: "prompt" })
      ),
    },
  ];
};

// Evaluation route configurations (non-creation routes)
export const createEvaluationRoutes = (): RouteConfig[] => {
  const ragRoutes: RouteConfig[] = [
    {
      path: "/evaluation/rag",
      element: createProtectedRoute(RagEvaluationOverviewPage),
    },
    {
      path: "/evaluation/rag/:taskId",
      element: createProtectedRoute(RagEvaluationDetailPage),
    },
    {
      path: "/evaluation/rag/:taskId/eval/:evaluationId",
      element: createProtectedRoute(RagEvaluationDetailPage),
    },
  ];

  const promptRoutes: RouteConfig[] = [
    {
      path: "/evaluation/prompt",
      element: createProtectedRoute(PromptEvaluationOverviewPage),
    },
    {
      path: "/evaluation/prompt/:taskId",
      element: createProtectedRoute(PromptEvaluationDetailPage),
    },
    {
      path: "/evaluation/prompt/:taskId/details",
      element: createProtectedRoute(PromptEvaluationDetailPage),
    },
    {
      path: "/evaluation/prompt/:taskId/eval/:evaluationId",
      element: createProtectedRoute(PromptEvaluationDetailPage),
    },
  ];

  return [...ragRoutes, ...promptRoutes];
};

// Main routes configuration (routes that use MainLayout)
export const createMainRoutes = (): RouteConfig[] => {
  return [
    {
      path: "/",
      element: React.createElement(HomePage),
    },
    {
      path: "/login",
      element: React.createElement(LoginPage),
    },
    {
      path: "/chat",
      element: createProtectedRoute(ChatPage),
    },
    {
      path: "/knowledge",
      element: createProtectedRoute(KnowledgePage),
    },
    {
      path: "/evaluation",
      element: createProtectedRoute(EvaluationPage),
    },
  ];
};

// Default redirect route based on auth status
export const createRedirectRoute = (lastVisitedPage: string): RouteConfig => {
  return {
    path: "*",
    element: TokenService.isTokenValid()
      ? React.createElement(Navigate, { to: lastVisitedPage })
      : React.createElement(Navigate, { to: "/" }),
  };
};
