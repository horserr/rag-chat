import { Button, Card, Table } from "antd";
import ReactECharts from "echarts-for-react";
import { Link } from "react-router-dom";

const RAGEvaluationReviewPanel = () => {
  // 配置 ECharts 的选项
  const chartOptions = {
    title: {
      text: "RAG Evaluation Results",
    },
    tooltip: {
      trigger: "axis",
    },
    radar: {
      indicator: [
        { name: "Context Relevance", max: 1 },
        { name: "Faithfulness", max: 1 },
        { name: "Answer Relevancy", max: 1 },
        { name: "Context Precision", max: 1 },
        { name: "Factual Correctness", max: 1 },
      ],
    },
    series: [
      {
        name: "RAG Performance",
        type: "radar",
        data: [
          {
            value: [0.85, 0.92, 0.79, 0.88, 0.76],
            name: "Evaluation Results",
          },
        ],
      },
    ],
  };

  // Sample data for the table
  const columns = [
    {
      title: "Sample ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Query",
      dataIndex: "query",
      key: "query",
      ellipsis: true,
    },
    {
      title: "Context Relevance",
      dataIndex: "contextRelevance",
      key: "contextRelevance",
    },
    {
      title: "Faithfulness",
      dataIndex: "faithfulness",
      key: "faithfulness",
    },
    {
      title: "Overall Score",
      dataIndex: "overall",
      key: "overall",
    },
  ];

  const data = [
    {
      key: "1",
      id: "S001",
      query: "What are the main components of a RAG system?",
      contextRelevance: 0.92,
      faithfulness: 0.88,
      overall: 0.90,
    },
    {
      key: "2",
      id: "S002",
      query: "How does retrieval augmented generation improve LLM outputs?",
      contextRelevance: 0.85,
      faithfulness: 0.95,
      overall: 0.87,
    },
    {
      key: "3",
      id: "S003",
      query: "What are the challenges in implementing RAG systems?",
      contextRelevance: 0.78,
      faithfulness: 0.93,
      overall: 0.82,
    },
    {
      key: "4",
      id: "S004",
      query: "Compare vector databases for RAG applications",
      contextRelevance: 0.88,
      faithfulness: 0.91,
      overall: 0.89,
    },
  ];

  return (
    <div>
      <h1>RAG Evaluation Results</h1>
      <p>Review the performance of your RAG system across different metrics.</p>

      <Card title="Overall Performance" style={{ marginBottom: 20 }}>
        <ReactECharts
          option={chartOptions}
          style={{ height: "400px", width: "100%" }}
        />
      </Card>

      <Card title="Sample-level Results">
        <Table columns={columns} dataSource={data} />
      </Card>

      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/rag-eval">Back to RAG Evaluation</Link>
      </Button>
    </div>
  );
};

export default RAGEvaluationReviewPanel;
