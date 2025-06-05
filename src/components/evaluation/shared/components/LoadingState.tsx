import {
  Box,
} from "@mui/material";
import React from "react";
import { TaskCard } from "./TaskCard";
import { EvaluationCard } from "./EvaluationCard";

/**
 * Props for the LoadingState component
 */
interface LoadingStateProps {
  /**
   * The type of items being loaded
   */
  type: "tasks" | "evaluations";
  /**
   * The number of skeleton placeholders to show
   */
  count?: number;
}

/**
 * LoadingState component displays skeleton placeholders while content is loading
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  count = 3,
}) => {
  return (
    <Box sx={{ opacity: 0.7 }}>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          {type === "tasks" ? (
            <TaskCard
              task={{ id: "", name: "" }}
              onClick={() => {}}
              loading={true}
            />
          ) : (
            <EvaluationCard
              evaluation={{ id: "", status: "" }}
              onViewDetails={() => {}}
              loading={true}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export { LoadingState };
