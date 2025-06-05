import React from "react";
import { Box, Alert, Button, Stack } from "@mui/material";
import { Add as AddIcon, Analytics as DetailsIcon } from "@mui/icons-material";
import { usePromptOverviewLogic } from "../../../hooks/evaluation";
import { usePromptOperations } from "../../../hooks/evaluation/operations/usePromptOperations";
import { useEvaluationNavigation } from "../../../hooks/evaluation/utils/useEvaluationNavigation";
import {
  TaskCard,
  EvaluationCard,
  EmptyState,
} from "../../../components/evaluation/shared/EvaluationComponents";
import {
  EvaluationPageHeader,
  PanelHeader,
} from "../../../components/evaluation/shared/Headers";
import {
  AnimatedPanel,
  DetailPanel,
  PlaceholderPanel,
} from "../../../components/evaluation/shared/Panels";
import {
  NewEvaluationDialog,
  DetailDialog,
} from "../../../components/evaluation/shared/Dialogs";
import { EVALUATION_CONSTANTS } from "../../../components/evaluation/shared/constants";
import type {
  PromptTask,
  PromptEvaluationResponse,
} from "../../../models/prompt-evaluation";

// 页面配置常量
const PAGE_CONFIG = {
  title: "Prompt 评估管理",
  subtitle: "管理和优化 Prompt 的质量评估",
  tasksPanelTitle: "Prompt 任务",
  evaluationsPanelTitle: "评估记录",
  placeholderTitle: "请选择一个 Prompt 任务",
  placeholderSubtitle: "从左侧列表中选择一个任务来查看其评估记录",
  newEvaluationDialog: {
    title: "新增 Prompt 评估",
    placeholder: "请输入要评估的 Prompt...",
    helpText: "提示: 评估将分析 Prompt 的质量、清晰度和效果等多个维度",
  },
} as const;

const PromptEvaluationOverviewPage: React.FC = () => {

  const {
    selectedTask,
    showDetailDialog,
    setShowDetailDialog,    handleTaskSelect,
    handleViewDetails,
    isDetailView,
    newPrompt,
    setNewPrompt,
    showNewEvaluationDialog,
    setShowNewEvaluationDialog,
    tasks,
    evaluations,
    tasksLoading,
    tasksError,
    evaluationsLoading,
    evaluationsError,
    createEvaluationMutation,
    handleTaskHover,
    handleRefresh,
    handleCreateEvaluation,
  } = usePromptOverviewLogic();  // Handle opening CreationFlow instead of navigation
  const handleNavigateToEvaluation = () => {
    navigateToPromptCreation();
  };
  // Add delete and rename operations
  const { deletePromptTask } = usePromptOperations();
  const { navigateToPromptDetails, navigateToPromptCreation } = useEvaluationNavigation();

  // Handle task delete
  const handleTaskDelete = async (taskId: string | number) => {
    try {
      await deletePromptTask(Number(taskId));
      // Note: Prompt tasks use number IDs, so we convert accordingly
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Handle task rename - Note: Prompt tasks don't currently support renaming in the backend
  // This is a placeholder for future implementation
  const handleTaskRename = async (taskId: string | number, newName: string) => {
    console.log(
      "Task rename not yet supported for prompt tasks:",
      taskId,
      newName
    );
    // TODO: Implement when backend supports prompt task updates
  };

  // Handle navigate to detail page
  const handleNavigateToDetails = () => {
    if (selectedTask) {
      navigateToPromptDetails(selectedTask);
    }
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
          />

          {/* Tasks List */}
          <Stack spacing={2}>
            {tasksLoading && (
              <>
                {EVALUATION_CONSTANTS.MOCK_LOADING_ITEMS.map((i) => (
                  <TaskCard
                    key={i}
                    task={{ id: "", name: "" }}
                    onClick={() => {}}
                    loading={true}
                  />
                ))}
              </>
            )}
            {tasksError && (
              <Alert severity="error">
                Failed to load tasks: {(tasksError as Error).message}
              </Alert>
            )}
            {!tasksLoading && !tasksError && tasks.length === 0 && (
              <EmptyState
                type="tasks"
                onAction={handleNavigateToEvaluation}
                actionLabel="创建新任务"
              />
            )}{" "}
            {!tasksLoading &&
              !tasksError &&
              tasks.map((task: PromptTask) => (
                <TaskCard
                  key={task.taskId}
                  task={{
                    id: task.taskId,
                    name: task.taskName,
                    description: `Task ID: ${task.taskId}`,
                  }}
                  isSelected={selectedTask === task.taskId}
                  onClick={() => handleTaskSelect(task.taskId)}
                  onHover={() => handleTaskHover(task.taskId)}
                  onDelete={handleTaskDelete}
                  onRename={handleTaskRename}
                />
              ))}
          </Stack>
        </AnimatedPanel>

        {/* Evaluation Details Panel */}
        {isDetailView ? (
          <DetailPanel>
            <PanelHeader
              title={PAGE_CONFIG.evaluationsPanelTitle}
              actions={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewEvaluationDialog(true)}
                    color="secondary"
                  >
                    新增评估
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    startIcon={<DetailsIcon />}
                    onClick={handleNavigateToDetails}
                  >
                    查看详情
                  </Button>
                </Box>
              }
            />

            {/* Evaluations List */}
            <Stack spacing={2}>
              {evaluationsLoading && (
                <>
                  {[1, 2].map((i) => (
                    <EvaluationCard
                      key={i}
                      evaluation={{ id: "", status: "" }}
                      onViewDetails={() => {}}
                      loading={true}
                    />
                  ))}
                </>
              )}

              {evaluationsError && (
                <Alert severity="error">
                  Failed to load evaluations:{" "}
                  {(evaluationsError as Error).message}
                </Alert>
              )}

              {!evaluationsLoading &&
                !evaluationsError &&
                evaluations.length === 0 && <EmptyState type="evaluations" />}

              {!evaluationsLoading &&
                !evaluationsError &&
                evaluations.map((evaluation: PromptEvaluationResponse) => (
                  <EvaluationCard
                    key={evaluation.evalId}
                    evaluation={{
                      id: evaluation.evalId,
                      status: "completed",
                      result: parseFloat(evaluation.promptScore),
                      name: `评估 #${evaluation.evalId}`,
                      created_at: new Date().toISOString(),
                    }}
                    onViewDetails={() => handleViewDetails(evaluation.evalId)}
                  />
                ))}
            </Stack>
          </DetailPanel>
        ) : (
          <PlaceholderPanel
            title={PAGE_CONFIG.placeholderTitle}
            subtitle={PAGE_CONFIG.placeholderSubtitle}
          />
        )}
      </Box>

      {/* New Evaluation Dialog */}
      <NewEvaluationDialog
        open={showNewEvaluationDialog}
        onClose={() => setShowNewEvaluationDialog(false)}
        onSubmit={handleCreateEvaluation}
        title={PAGE_CONFIG.newEvaluationDialog.title}
        promptValue={newPrompt}
        onPromptChange={setNewPrompt}
        placeholder={PAGE_CONFIG.newEvaluationDialog.placeholder}
        helpText={PAGE_CONFIG.newEvaluationDialog.helpText}
        isSubmitting={createEvaluationMutation.isPending}
        disabled={!newPrompt.trim()}
      />      {/* Detail Dialog */}
      <DetailDialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        title="任务详情"
      >
        {selectedTask && (
          <Box>
            任务ID: {selectedTask}
            {/* Add more detailed information here */}
          </Box>
        )}
      </DetailDialog>
    </Box>
  );
};

export default PromptEvaluationOverviewPage;
