import { Route, Routes } from "react-router-dom";
import LayoutFactory from "../layouts/LayoutFactory";
import types from "../layouts/LayoutTypes";
import RAGEvaluationPanel from "../components/RAGEvaluationPanel/RAGEvaluationPanel";
import SetUpPanel from "../components/RAGEvaluationPanel/SetUpPanel/SetUpPanel";
import RAGEvaluationReviewPanel from "../components/RAGEvaluationPanel/RAGEvaluationReviewPanel";

const RAGEvaluation: React.FC = () => {
  return (
    <LayoutFactory
      breadcrumbs={["Home", "RAG Evaluation"]}
      layoutType={types.evalLayout}
    >
      <Routes>
        <Route path="/" element={<RAGEvaluationPanel />} />
        <Route path="/set-up/*" element={<SetUpPanel />} />
        <Route path="/review" element={<RAGEvaluationReviewPanel />} />
      </Routes>
    </LayoutFactory>
  );
};

export default RAGEvaluation;
