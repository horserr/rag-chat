import { Analytics as DetailsIcon } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { DetailDialog } from "../../../components/evaluation/shared/Dialogs";
import {
  EvaluationPageHeader,
  PanelHeader,
} from "../../../components/evaluation/shared/Headers";
import {
  AnimatedPanel,
  DetailPanel,
  PlaceholderPanel,
} from "../../../components/evaluation/shared/Panels";
import { useRagOverviewLogic } from "../../../hooks/evaluation";
import { useRagOperations } from "../../../hooks/evaluation/operations/useRagOperations";
import { useEvaluationNavigation } from "../../../hooks/evaluation/utils/useEvaluationNavigation";
import { TasksList, EvaluationsList } from "../../../components/evaluation/OverView/components";

// 页面配置常量
const PAGE_CONFIG = {
  title: "RAG 评估管理",
  subtitle: "管理和监控 RAG 系统的评估任务",
  tasksPanelTitle: "评估任务",
  evaluationsPanelTitle: "评估记录",
  placeholderTitle: "请选择一个评估任务",
  placeholderSubtitle: "从左侧列表中选择一个任务来查看其评估记录",
  routes: {
    base: "/evaluation/rag",
    detail: "/evaluation/rag",
  },
} as const;

const RagEvaluationOverviewPage: React.FC = () => {
  const {
    selectedTask,
    setSelectedTask,
    tasks,
    evaluations,
    showDetailDialog,
    setShowDetailDialog,
    tasksLoading,
    tasksError,
    evaluationsLoading,
    evaluationsError,
    isDetailView,
    handleTaskSelect,
    handleTaskHover,
    handleViewDetails,
    handleNavigateToEvaluation,
    handleRefresh,
  } = useRagOverviewLogic({
    detailRoute: PAGE_CONFIG.routes.detail,
  });

  // Add delete and rename operations
  const { deleteRagTask, updateRagTask } = useRagOperations();
  const { navigateToRagDetails } = useEvaluationNavigation();

  // Handle task delete
  const handleTaskDelete = async (taskId: string | number) => {
    try {
      await deleteRagTask(String(taskId));
      // If the deleted task was selected, clear selection
      if (selectedTask === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Handle task rename
  const handleTaskRename = async (taskId: string | number, newName: string) => {
    try {
      // Find the current task to preserve description
      const currentTask = tasks.find((t) => t.id === taskId);
      await updateRagTask({
        taskId: String(taskId),
        formData: {
          taskName: newName,
          description: currentTask?.description || "",
          evaluationType: "single_turn", // Required by the type, but not used for updates
          isTaskCreated: true, // Required by the type, but not used for updates
        },
      });
    } catch (error) {
      console.error("Failed to rename task:", error);
    }
  };

  // Handle navigate to detail page
  const handleNavigateToDetails = () => {
    if (selectedTask) {
      navigateToRagDetails(selectedTask);
    }
  };

  // Create adapter functions to handle type conversions
  const handleTaskSelectAdapter = (taskId: string | number) => {
    handleTaskSelect(String(taskId));
  };

  const handleTaskHoverAdapter = (taskId: string | number) => {
    handleTaskHover(String(taskId));
  };

  const handleViewDetailsAdapter = (evaluationId: string | number) => {
    handleViewDetails(String(evaluationId));
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <EvaluationPageHeader
        title={PAGE_CONFIG.title}
        subtitle={PAGE_CONFIG.subtitle}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Task List Panel */}
        <AnimatedPanel isExpanded={isDetailView} borderRight={isDetailView}>
          <PanelHeader
            title={PAGE_CONFIG.tasksPanelTitle}
            onRefresh={handleRefresh}
            isRefreshing={tasksLoading}
          />          {/* Tasks List */}          <TasksList
            tasks={tasks}
            selectedTask={selectedTask}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
            handleTaskSelect={handleTaskSelectAdapter}
            handleTaskHover={handleTaskHoverAdapter}
            handleTaskDelete={handleTaskDelete}
            handleTaskRename={handleTaskRename}
            handleNavigateToEvaluation={handleNavigateToEvaluation}
          />
        </AnimatedPanel>

        {/* Evaluation Details Panel */}
        {isDetailView ? (
          <DetailPanel>
            <PanelHeader
              title={PAGE_CONFIG.evaluationsPanelTitle}
              actions={
                <Button
                  variant="contained"
                  startIcon={<DetailsIcon />}
                  onClick={handleNavigateToDetails}
                >
                  view details
                </Button>
              }
            />            {/* Evaluations List */}            <EvaluationsList
              evaluations={evaluations}
              evaluationsLoading={evaluationsLoading}
              evaluationsError={evaluationsError}
              handleViewDetails={handleViewDetailsAdapter}
            />
          </DetailPanel>
        ) : (
          <PlaceholderPanel
            title={PAGE_CONFIG.placeholderTitle}
            subtitle={PAGE_CONFIG.placeholderSubtitle}
          />
        )}
      </Box>

      {/* Detail Dialog */}
      <DetailDialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        title="任务详情"
      >
        {selectedTask && (
          <Typography>
            任务ID: {selectedTask}
            {/* Add more detailed information here */}
          </Typography>
        )}
      </DetailDialog>
    </Box>
  );
};

export default RagEvaluationOverviewPage;
