import { Route, Routes } from "react-router-dom";
import LayoutFactory from "../layouts/LayoutFactory";
import types from "../layouts/LayoutTypes";
import PromptEvaluationPanel from "../components/PromptEvaluationPanel/PromptEvaluationPanel";
import SetUpPanel from "../components/PromptEvaluationPanel/SetUpPanel/SetUpPanel";
import PromptEvaluationReviewPanel from "../components/PromptEvaluationPanel/PromptEvaluationReviewPanel";

const PromptEvaluation: React.FC = () => {
  return (
    <LayoutFactory
      breadcrumbs={["Home", "Prompt Evaluation"]}
      layoutType={types.evalLayout}
    >
      <Routes>
        <Route path="/" element={<PromptEvaluationPanel />} />
        <Route path="/set-up/*" element={<SetUpPanel />} />
        <Route path="/review" element={<PromptEvaluationReviewPanel />} />
      </Routes>
    </LayoutFactory>
  );
};

export default PromptEvaluation;
