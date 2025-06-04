import { Analytics as DetailsIcon } from "@mui/icons-material";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useRagOverviewLogic } from "../../../hooks/evaluation";
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
import { DetailDialog } from "../../../components/evaluation/shared/Dialogs";
import { EVALUATION_CONSTANTS } from "../../../components/evaluation/shared/constants";
import type { TaskDto, EvaluationListItem } from "../../../models/rag-evaluation";

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
    handleRefresh,  } = useRagOverviewLogic({
    detailRoute: PAGE_CONFIG.routes.detail,
  });

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
                    task={{ id: '', name: '' }}
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
            )}

            {!tasksLoading && !tasksError && tasks.map((task: TaskDto) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={selectedTask === task.id}
                onClick={() => handleTaskSelect(task.id)}
                onHover={() => handleTaskHover(task.id)}
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
                <Button
                  variant="contained"
                  startIcon={<DetailsIcon />}
                  onClick={() => setShowDetailDialog(true)}
                >
                  查看详情
                </Button>
              }
            />

            {/* Evaluations List */}
            <Stack spacing={2}>
              {evaluationsLoading && (
                <>
                  {[1, 2].map((i) => (
                    <EvaluationCard
                      key={i}
                      evaluation={{ id: '', status: '' }}
                      onViewDetails={() => {}}
                      loading={true}
                    />
                  ))}
                </>
              )}

              {evaluationsError && (
                <Alert severity="error">
                  Failed to load evaluations: {(evaluationsError as Error).message}
                </Alert>
              )}

              {!evaluationsLoading && !evaluationsError && evaluations.length === 0 && (
                <EmptyState type="evaluations" />
              )}

              {!evaluationsLoading && !evaluationsError && evaluations.map((evaluation: EvaluationListItem) => (
                <EvaluationCard
                  key={evaluation.id}
                  evaluation={evaluation}
                  onViewDetails={() => handleViewDetails(evaluation.id)}
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