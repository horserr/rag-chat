import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface UseOverviewPageOptions {
  taskIdParamName?: string;
  baseRoute: string;
  detailRoute: string;
}

/**
 * Overview页面的通用逻辑hook
 */
export const useOverviewPage = <T extends string | number>({
  taskIdParamName = "taskId",
  baseRoute,
  detailRoute,
}: UseOverviewPageOptions) => {
  const navigate = useNavigate();
  const params = useParams();

  const taskIdFromParams = params[taskIdParamName];
  const [selectedTask, setSelectedTask] = useState<T | null>(
    taskIdFromParams
      ? (typeof taskIdFromParams === "string" && !isNaN(Number(taskIdFromParams))
          ? Number(taskIdFromParams) as T
          : taskIdFromParams as T)
      : null
  );

  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleTaskSelect = (taskId: T) => {
    setSelectedTask(taskId);
    navigate(`${baseRoute}/${taskId}`);
  };

  const handleViewDetails = (evaluationId: T) => {
    if (selectedTask) {
      navigate(`${detailRoute}/${selectedTask}/${evaluationId}`);
    }
  };

  const handleNavigateToEvaluation = () => {
    navigate("/evaluation");
  };

  return {
    selectedTask,
    setSelectedTask,
    showDetailDialog,
    setShowDetailDialog,
    handleTaskSelect,
    handleViewDetails,
    handleNavigateToEvaluation,
    isDetailView: !!selectedTask,
  };
};
