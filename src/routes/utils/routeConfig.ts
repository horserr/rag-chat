import React from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import {
  RagEvaluationOverviewPage,
  RagEvaluationDetailPage,
  PromptEvaluationOverviewPage,
  PromptEvaluationDetailPage,
} from "../../pages/evalPages";

// Route configuration types
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

// Helper function to create protected routes
const createProtectedRoute = (Component: React.ComponentType) =>
  React.createElement(ProtectedRoute, null, React.createElement(Component));

// Evaluation route configurations
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
      path: "/evaluation/rag/:taskId/details",
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
