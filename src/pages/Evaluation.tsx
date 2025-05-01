import { Route, Routes } from "react-router-dom"; // 引入路由组件
import EvaluationPanel from "../components/EvaluationPanel/EvaluationPanel";
import EvaluationReviewPanel from "../components/EvaluationPanel/EvaluationReviewPanel"; // 引入子页面组件
import SetUpPanel from "../components/EvaluationPanel/SetUpPanel/SetUpPanel"; // 引入子页面组件
import LayoutFactory from "../layouts/LayoutFactory";
import types from "../layouts/LayoutTypes"; // 引入布局类型枚举

const Evaluation: React.FC = () => {
  return (
    <LayoutFactory
      breadcrumbs={["Home", "Evaluation"]}
      layoutType={types.evalLayout}
    >
      <Routes>
        <Route path="/" element={<EvaluationPanel />} />
        <Route path="/set-up/*" element={<SetUpPanel />} />
        <Route path="/review" element={<EvaluationReviewPanel />} />
        {/* todo do not find then return to evaluation page */}
      </Routes>
    </LayoutFactory>
  );
};

export default Evaluation;
