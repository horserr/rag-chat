import { Alert, Stack } from "@mui/material";
import React from "react";
import { EvaluationCard, EmptyState } from "../../shared/components";
import type { EvaluationListItem } from "../../../../models/rag-evaluation";

interface EvaluationsListProps {
  evaluations: EvaluationListItem[];
  evaluationsLoading: boolean;
  evaluationsError: Error | null;
  handleViewDetails: (evaluationId: string | number) => void;
}

const EvaluationsList: React.FC<EvaluationsListProps> = ({
  evaluations,
  evaluationsLoading,
  evaluationsError,
  handleViewDetails,
}) => {
  return (
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
          Failed to load evaluations: {evaluationsError.message}
        </Alert>
      )}

      {!evaluationsLoading && !evaluationsError && evaluations.length === 0 && (
        <EmptyState type="evaluations" />
      )}

      {!evaluationsLoading &&
        !evaluationsError &&
        evaluations.map((evaluation: EvaluationListItem) => (
          <EvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
            onViewDetails={() => handleViewDetails(evaluation.id)}
          />
        ))}
    </Stack>
  );
};

export default EvaluationsList;
