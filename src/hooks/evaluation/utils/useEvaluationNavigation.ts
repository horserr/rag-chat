import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 评估导航辅助钩子
 * 提供各种评估页面的导航功能
 */
export const useEvaluationNavigation = () => {
  const navigate = useNavigate();

  // RAG Navigation
  const navigateToRagOverview = useCallback(
    (taskId?: string) => {
      const url = taskId ? `/evaluation/rag/${taskId}` : "/evaluation/rag";
      navigate(url);
    },
    [navigate]
  );

  const navigateToRagDetails = useCallback(
    (taskId: string, evaluationId?: string) => {
      const url = evaluationId
        ? `/evaluation/rag/${taskId}/eval/${evaluationId}`
        : `/evaluation/rag/${taskId}`;
      navigate(url);
    },
    [navigate]
  );

  const navigateToRagCreation = useCallback(() => {
    navigate("/evaluation/rag/create");
  }, [navigate]);

  // Prompt Navigation
  const navigateToPromptOverview = useCallback(
    (taskId?: number) => {
      const url = taskId
        ? `/evaluation/prompt/${taskId}`
        : "/evaluation/prompt";
      navigate(url);
    },
    [navigate]
  );

  const navigateToPromptDetails = useCallback(
    (taskId: number, evaluationId?: number) => {
      const url = evaluationId
        ? `/evaluation/prompt/${taskId}/eval/${evaluationId}`
        : `/evaluation/prompt/${taskId}/details`;
      navigate(url);
    },
    [navigate]
  );

  const navigateToPromptCreation = useCallback(() => {
    navigate("/evaluation/prompt/create");
  }, [navigate]);

  // Generic navigation helpers
  const navigateToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    // RAG navigation
    navigateToRagOverview,
    navigateToRagDetails,
    navigateToRagCreation,

    // Prompt navigation
    navigateToPromptOverview,
    navigateToPromptDetails,
    navigateToPromptCreation,

    // Generic navigation
    navigateToHome,
    navigateBack,

    // Direct access to navigate function
    navigate,
  };
};
