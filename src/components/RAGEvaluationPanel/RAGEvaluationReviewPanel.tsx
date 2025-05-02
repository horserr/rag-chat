import React, { useEffect, useState } from "react";
import { Button, Card, Table, Typography, Breadcrumb, Tabs, Descriptions, Space } from "antd";
import ReactECharts from "echarts-for-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const RAGEvaluationReviewPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskId, setTaskId] = useState<string | null>(null);

  // Extract task ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    setTaskId(id);
  }, [location]);

  // Radar chart configuration
  const radarChartOptions = {
    title: {
      text: "Metric Performance",
    },
    tooltip: {
      trigger: "item",
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

  // Bar chart configuration
  const barChartOptions = {
    title: {
      text: "Metric Comparison",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Context Relevance", "Faithfulness", "Answer Relevancy", "Context Precision", "Factual Correctness"],
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: "value",
      max: 1
    },
    series: [
      {
        name: "Score",
        type: "bar",
        data: [0.85, 0.92, 0.79, 0.88, 0.76],
      },
    ],
  };

  // Sample data for the table
  const columns = [
    {
      title: "Sample ID",
      dataIndex: "id",
      key: "id",
      width: 100,
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
      width: 150,
    },
    {
      title: "Faithfulness",
      dataIndex: "faithfulness",
      key: "faithfulness",
      width: 120,
    },
    {
      title: "Overall Score",
      dataIndex: "overall",
      key: "overall",
      width: 120,
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

  // Sample data for demonstration - in a real app, this would be fetched from an API
  const sampleEvaluations = [
    {
      id: "eval-001-1",
      name: "Round 1 - Initial Model",
      date: "2023-06-15",
      type: "single_turn",
      metrics: ["CONTEXT_RELEVANCE", "FAITHFULNESS"],
      score: 0.72,
      taskId: "task-001",
      taskName: "Factual QA Evaluation",
      description: "Initial evaluation of RAG system on factual questions",
      roundNumber: 1,
      totalRounds: 3
    },
    {
      id: "eval-001-2",
      name: "Round 2 - Improved Retrieval",
      date: "2023-06-20",
      type: "single_turn",
      metrics: ["CONTEXT_RELEVANCE", "FAITHFULNESS"],
      score: 0.81,
      taskId: "task-001",
      taskName: "Factual QA Evaluation",
      description: "Evaluation after improving retrieval mechanism",
      roundNumber: 2,
      totalRounds: 3
    },
    {
      id: "eval-001-3",
      name: "Round 3 - Fine-tuned Model",
      date: "2023-06-25",
      type: "single_turn",
      metrics: ["CONTEXT_RELEVANCE", "FAITHFULNESS"],
      score: 0.87,
      taskId: "task-001",
      taskName: "Factual QA Evaluation",
      description: "Evaluation after fine-tuning the model",
      roundNumber: 3,
      totalRounds: 3
    }
  ];

  // Find the evaluation details based on the ID
  const evaluationDetails = sampleEvaluations.find(evaluation => evaluation.id === taskId) || sampleEvaluations[2];

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link to="/rag-eval">RAG Evaluation</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{evaluationDetails.taskName}</Breadcrumb.Item>
        <Breadcrumb.Item>Round {evaluationDetails.roundNumber} Results</Breadcrumb.Item>
      </Breadcrumb>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={2}>{evaluationDetails.name}</Title>
            <Text type="secondary">Part of task: {evaluationDetails.taskName}</Text>
          </div>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/rag-eval")}
          >
            Back to Tasks
          </Button>
        </div>

        <Card>
          <Descriptions title="Evaluation Information" bordered>
            <Descriptions.Item label="Evaluation ID" span={1}>{evaluationDetails.id}</Descriptions.Item>
            <Descriptions.Item label="Task ID" span={2}>{evaluationDetails.taskId}</Descriptions.Item>
            <Descriptions.Item label="Round" span={1}>{evaluationDetails.roundNumber} of {evaluationDetails.totalRounds}</Descriptions.Item>
            <Descriptions.Item label="Type" span={1}>{evaluationDetails.type}</Descriptions.Item>
            <Descriptions.Item label="Date" span={1}>{evaluationDetails.date}</Descriptions.Item>
            <Descriptions.Item label="Score" span={3}>{evaluationDetails.score.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>{evaluationDetails.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Overview" key="1">
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
                  <ReactECharts
                    option={radarChartOptions}
                    style={{ height: "400px", width: "100%" }}
                  />
                </div>
                <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
                  <ReactECharts
                    option={barChartOptions}
                    style={{ height: "400px", width: "100%" }}
                  />
                </div>
              </div>
            </Card>
          </TabPane>

          <TabPane tab="Progress Chart" key="2">
            <Card>
              <ReactECharts
                option={{
                  title: {
                    text: 'Evaluation Progress Across Rounds',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                      const evalIndex = params[0].dataIndex;
                      const evaluation = sampleEvaluations[evalIndex];
                      return `${evaluation.name}<br/>Date: ${evaluation.date}<br/>Score: ${evaluation.score.toFixed(2)}`;
                    }
                  },
                  xAxis: {
                    type: 'category',
                    data: sampleEvaluations.map(evaluation => `Round ${evaluation.roundNumber}`),
                    name: 'Round',
                    nameLocation: 'middle',
                    nameGap: 30
                  },
                  yAxis: {
                    type: 'value',
                    min: 0,
                    max: 1,
                    name: 'Score',
                    nameLocation: 'middle',
                    nameGap: 50
                  },
                  series: [
                    {
                      name: 'Score',
                      type: 'line',
                      data: sampleEvaluations.map(evaluation => evaluation.score),
                      markPoint: {
                        data: [
                          { type: 'max', name: 'Max' }
                        ]
                      },
                      markLine: {
                        data: [
                          { type: 'average', name: 'Avg' }
                        ]
                      },
                      lineStyle: {
                        width: 3
                      },
                      symbol: 'circle',
                      symbolSize: 10,
                      itemStyle: {
                        color: function(params) {
                          // Highlight the current evaluation
                          return params.dataIndex === evaluationDetails.roundNumber - 1 ? '#f5222d' : '#1890ff';
                        }
                      }
                    }
                  ]
                }}
                style={{ height: "400px", width: "100%" }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Sample Results" key="3">
            <Card>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 800 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Raw Data" key="4">
            <Card>
              <Paragraph>
                <pre style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px", overflow: "auto" }}>
                  {JSON.stringify({
                    evaluation_id: evaluationDetails.id,
                    task_id: evaluationDetails.taskId,
                    name: evaluationDetails.name,
                    round: evaluationDetails.roundNumber,
                    total_rounds: evaluationDetails.totalRounds,
                    metrics: {
                      context_relevance: 0.85,
                      faithfulness: 0.92,
                      answer_relevancy: 0.79,
                      context_precision: 0.88,
                      factual_correctness: 0.76
                    },
                    samples: data,
                    overall_score: evaluationDetails.score
                  }, null, 2)}
                </pre>
              </Paragraph>
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
};

export default RAGEvaluationReviewPanel;
