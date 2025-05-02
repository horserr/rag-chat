import { Button } from "antd";
import ReactECharts from "echarts-for-react";
import { Link } from "react-router-dom";

const PromptEvaluationReviewPanel = () => {
  // 配置 ECharts 的选项
  const chartOptions = {
    title: {
      text: "Prompt Evaluation Results",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Clarity", "Effectiveness", "Efficiency", "Safety", "Overall"],
    },
    yAxis: {
      type: "value",
      max: 10,
    },
    series: [
      {
        name: "Score",
        type: "bar",
        data: [8.5, 7.2, 9.0, 8.8, 8.4],
      },
    ],
  };

  return (
    <div>
      <h1>Prompt Evaluation Results</h1>
      <p>Review the performance of your prompt across different metrics.</p>

      {/* ECharts 图表 */}
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
      />

      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/prompt-eval">Back to Prompt Evaluation</Link>
      </Button>
    </div>
  );
};

export default PromptEvaluationReviewPanel;
