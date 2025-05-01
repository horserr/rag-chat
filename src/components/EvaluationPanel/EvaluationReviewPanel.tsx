import { Button } from "antd";
import ReactECharts from "echarts-for-react";
import { Link } from "react-router-dom";

const EvaluationReviewPanel = () => {
  // 配置 ECharts 的选项
  const chartOptions = {
    title: {
      text: "Evaluation Results",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Score",
        type: "line",
        data: [120, 200, 150, 80, 70, 110],
      },
    ],
  };

  return (
    <div>
      <h1>Evaluation Review Panel</h1>
      <p>This is the Evaluation Review Panel.</p>

      {/* ECharts 图表 */}
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
      />

      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/evaluation">Back to Evaluation</Link>
      </Button>
    </div>
  );
};

export default EvaluationReviewPanel;
