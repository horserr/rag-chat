import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import type {
  EvaluationDetails,
  SingleTurnEvaluationDetails,
  CustomEvaluationDetails,
  MultiTurnEvaluationDetails,
  SingleTurnSample,
  CustomSample,
  MultiTurnSample
} from "../../../models/rag-evaluation";

interface RagSampleContentProps {
  evaluation: EvaluationDetails | null;
}

export const RagSampleContent: React.FC<RagSampleContentProps> = ({ evaluation }) => {
  if (!evaluation || !evaluation.samples) return null;

  const renderSingleTurnSample = (samples: SingleTurnSample) => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          用户输入
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2">{samples.user_input}</Typography>
        </Paper>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          系统响应
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2">{samples.response}</Typography>
        </Paper>
      </Box>
    </>
  );

  const renderCustomSample = (samples: CustomSample) => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          用户输入
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2">{samples.user_input}</Typography>
        </Paper>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          系统响应
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2">{samples.response}</Typography>
        </Paper>
      </Box>
    </>
  );

  const renderMultiTurnSample = (samples: MultiTurnSample) => (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        对话内容
      </Typography>
      {Array.isArray(samples.user_input) && samples.user_input.map((item, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: item.type === "human" ? "grey.50" : "primary.light",
            color: item.type === "human" ? "text.primary" : "white"
          }}
        >
          <Typography variant="body2">
            {item.type === "human" ? "用户: " : "AI: "}
            {item.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );

  switch (evaluation.eval_type) {
    case "single_turn":
      return renderSingleTurnSample((evaluation as SingleTurnEvaluationDetails).samples as SingleTurnSample);
    case "custom":
      return renderCustomSample((evaluation as CustomEvaluationDetails).samples as CustomSample);
    case "multi_turn":
      return renderMultiTurnSample((evaluation as MultiTurnEvaluationDetails).samples as MultiTurnSample);
    default:
      return <Typography>No sample data available</Typography>;
  }
};
