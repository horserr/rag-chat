import { Alert, Stack } from "@mui/material";
import React from "react";
import { EVALUATION_CONSTANTS } from "../../shared/constants";
import { TaskCard, EmptyState } from "../../shared/components";
import type { TaskDto } from "../../../../models/rag-evaluation";

interface TasksListProps {
  tasks: TaskDto[];
  tasksLoading: boolean;
  tasksError: Error | null;
  selectedTask: string | number | null;
  handleTaskSelect: (taskId: string | number) => void;
  handleTaskHover: (taskId: string | number) => void;
  handleNavigateToEvaluation: () => void;
  handleTaskDelete: (taskId: string | number) => void;
  handleTaskRename: (taskId: string | number, newName: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  tasksLoading,
  tasksError,
  selectedTask,
  handleTaskSelect,
  handleTaskHover,
  handleNavigateToEvaluation,
  handleTaskDelete,
  handleTaskRename,
}) => {
  return (
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
          Failed to load tasks: {tasksError.message}
        </Alert>
      )}
      {!tasksLoading && !tasksError && tasks.length === 0 && (
        <EmptyState
          type="tasks"
          onAction={handleNavigateToEvaluation}
          actionLabel="创建新任务"
        />
      )}
      {!tasksLoading &&
        !tasksError &&
        tasks.map((task: TaskDto) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTask === task.id}
            onClick={() => handleTaskSelect(task.id)}
            onHover={() => handleTaskHover(task.id)}
            onDelete={handleTaskDelete}
            onRename={handleTaskRename}
          />
        ))}
    </Stack>
  );
};

export default TasksList;
