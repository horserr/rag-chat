import { useState, useCallback, useEffect } from "react";
import type { ActiveTasks } from "../../../models/evaluation-hooks";

// Constants
const CLEANUP_WARNING_MESSAGE =
  "您有正在进行的评估任务，关闭页面将导致这些任务被删除。您确定要离开吗？";

/**
 * 管理任务清理逻辑的钩子
 * 处理页面卸载时的任务清理和 beacon 发送
 */
export const useTaskCleanup = () => {
  const [activeTasks, setActiveTasks] = useState<ActiveTasks>({
    rag: [],
    prompt: [],
  });
  // 添加任务到活跃列表
  const addActiveTask = useCallback((type: keyof ActiveTasks, taskId: string | number) => {
    setActiveTasks((prev: ActiveTasks) => ({
      ...prev,
      [type]: [...prev[type], taskId],
    }));
  }, []);

  // 从活跃列表移除任务
  const removeActiveTask = useCallback((type: keyof ActiveTasks, taskId: string | number) => {
    setActiveTasks((prev: ActiveTasks) => ({
      ...prev,
      [type]: prev[type].filter((id: string | number) => id !== taskId),
    }));
  }, []);
  // 清空所有活跃任务
  const clearActiveTasks = useCallback(() => {
    setActiveTasks({ rag: [], prompt: [] });
  }, []);

  // 设置活跃任务（用于初始化）
  const setActiveTasksState = useCallback((tasks: ActiveTasks) => {
    setActiveTasks(tasks);
  }, []);

  // 异步清理任务（用于正常清理流程）
  const cleanupActiveTasks = useCallback(async () => {
    console.log("cleanupActiveTasks called, current activeTasks:", activeTasks);

    try {
      // 这里可以注入清理服务
      const deletePromises: Promise<void>[] = [];
        // Delete RAG tasks
      activeTasks.rag.forEach((taskId: string) => {
        deletePromises.push(
          fetch(`/api/rag/task/${taskId}`, { method: 'DELETE' })
            .then(() => {})
            .catch((error) => console.error(`Failed to delete RAG task ${taskId}:`, error))
        );
      });

      // Delete Prompt tasks
      activeTasks.prompt.forEach((taskId: number) => {
        deletePromises.push(
          fetch(`/api/prompt/task/${taskId}`, { method: 'DELETE' })
            .then(() => {})
            .catch((error) => console.error(`Failed to delete Prompt task ${taskId}:`, error))
        );
      });

      await Promise.allSettled(deletePromises);
      clearActiveTasks();
    } catch (error) {
      console.error("Failed to cleanup tasks:", error);
    }
  }, [activeTasks, clearActiveTasks]);

  // Beacon-based cleanup for reliable page unload cleanup
  const cleanupActiveTasksWithBeacon = useCallback(() => {
    console.log(
      "cleanupActiveTasksWithBeacon called, current activeTasks:",
      activeTasks
    );

    // Check if navigator.sendBeacon is available
    if (!navigator.sendBeacon) {
      console.warn(
        "navigator.sendBeacon not available, falling back to async cleanup"
      );
      cleanupActiveTasks();
      return;
    }    activeTasks.rag.forEach((taskId: string) => {
      try {
        const deletePayload = JSON.stringify({
          method: "DELETE",
        });
        navigator.sendBeacon(`/api/rag/task/${taskId}`, deletePayload);
      } catch (error) {
        console.error(`Failed to send beacon for RAG task ${taskId}:`, error);
      }
    });

    activeTasks.prompt.forEach((taskId: number) => {
      try {
        const deletePayload = JSON.stringify({
          method: "DELETE",
        });
        navigator.sendBeacon(`/api/prompt/task/${taskId}`, deletePayload);
      } catch (error) {
        console.error(
          `Failed to send beacon for Prompt task ${taskId}:`,
          error
        );
      }
    });
  }, [activeTasks, cleanupActiveTasks]);

  // Setup cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (activeTasks.rag.length > 0 || activeTasks.prompt.length > 0) {
        event.preventDefault();
        return CLEANUP_WARNING_MESSAGE;
      }
    };

    const handleUnload = () => {
      // Use beacon-based cleanup for reliable unload cleanup
      cleanupActiveTasksWithBeacon();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [activeTasks, cleanupActiveTasksWithBeacon]);
  return {
    activeTasks,
    addActiveTask,
    removeActiveTask,
    clearActiveTasks,
    setActiveTasks: setActiveTasksState,
    cleanupActiveTasks,
    cleanupActiveTasksWithBeacon,
  };
};
