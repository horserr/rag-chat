import React, { useEffect, useState } from "react";
import { Button, Card, Typography, Breadcrumb, Tabs, Descriptions, Space, Table, Divider } from "antd";
import ReactECharts from "echarts-for-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PromptEvaluationReviewPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskId, setTaskId] = useState<number | null>(null);

  // Extract task ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    setTaskId(id ? parseInt(id) : null);
  }, [location]);

  // Bar chart configuration
  const barChartOptions = {
    title: {
      text: "Metric Scores",
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
      name: "Score",
      nameLocation: "middle",
      nameGap: 40,
    },
    series: [
      {
        name: "Score",
        type: "bar",
        data: [8.5, 7.2, 9.0, 8.8, 8.4],
        itemStyle: {
          color: function(params) {
            const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
            return colorList[params.dataIndex];
          }
        }
      },
    ],
  };

  // Radar chart configuration
  const radarChartOptions = {
    title: {
      text: "Metric Comparison",
    },
    tooltip: {
      trigger: "item",
    },
    radar: {
      indicator: [
        { name: "Clarity", max: 10 },
        { name: "Effectiveness", max: 10 },
        { name: "Efficiency", max: 10 },
        { name: "Safety", max: 10 },
        { name: "Coherence", max: 10 },
      ],
    },
    series: [
      {
        name: "Prompt Performance",
        type: "radar",
        data: [
          {
            value: [8.5, 7.2, 9.0, 8.8, 7.9],
            name: "Evaluation Results",
            areaStyle: {
              color: 'rgba(84, 112, 198, 0.3)'
            },
            lineStyle: {
              color: '#5470c6'
            }
          },
        ],
      },
    ],
  };

  // Sample data for the table
  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    }
  ];

  const data = [
    {
      key: "1",
      metric: "Clarity",
      score: 8.5,
      description: "The prompt is clear and easy to understand, with well-defined instructions.",
    },
    {
      key: "2",
      metric: "Effectiveness",
      score: 7.2,
      description: "The prompt is moderately effective at achieving its intended purpose.",
    },
    {
      key: "3",
      metric: "Efficiency",
      score: 9.0,
      description: "The prompt is very efficient, requiring minimal tokens to convey its intent.",
    },
    {
      key: "4",
      metric: "Safety",
      score: 8.8,
      description: "The prompt has good safety measures and is unlikely to produce harmful content.",
    },
    {
      key: "5",
      metric: "Coherence",
      score: 7.9,
      description: "The prompt maintains good logical flow and consistency.",
    },
  ];

  // Sample data for demonstration - in a real app, this would be fetched from an API
  const sampleEvaluations = [
    {
      id: 101,
      name: "Round 1 - Basic Prompt",
      createdAt: "2023-05-10",
      prompt: "Summarize the following text in 3-5 sentences.",
      score: 6.8,
      metrics: ["Clarity", "Effectiveness", "Efficiency"],
      taskId: 1,
      taskName: "Text Summarization",
      description: "Initial basic prompt for text summarization",
      roundNumber: 1,
      totalRounds: 3
    },
    {
      id: 102,
      name: "Round 2 - Improved Prompt",
      createdAt: "2023-05-15",
      prompt: "Summarize the following text in 3-5 sentences, highlighting the main points and key takeaways.",
      score: 8.5,
      metrics: ["Clarity", "Effectiveness", "Efficiency"],
      taskId: 1,
      taskName: "Text Summarization",
      description: "Improved prompt with instructions to highlight main points",
      roundNumber: 2,
      totalRounds: 3
    },
    {
      id: 103,
      name: "Round 3 - Refined Prompt",
      createdAt: "2023-05-20",
      prompt: "Provide a concise summary of the following text in 3-5 sentences. Focus on the main arguments, key findings, and important conclusions. Ensure your summary captures the essence of the text while maintaining clarity and coherence.",
      score: 9.3,
      metrics: ["Clarity", "Effectiveness", "Efficiency", "Completeness"],
      taskId: 1,
      taskName: "Text Summarization",
      description: "Refined prompt with detailed instructions for comprehensive summarization",
      roundNumber: 3,
      totalRounds: 3
    }
  ];

  // Find the evaluation details based on the ID
  const evaluationDetails = taskId && sampleEvaluations.find(evaluation => evaluation.id === parseInt(taskId)) || sampleEvaluations[2];

  // Sample responses
  const sampleResponses = [
    {
      input: "The history of artificial intelligence (AI) began in antiquity, with myths, stories and rumors of artificial beings endowed with intelligence or consciousness by master craftsmen. The seeds of modern AI were planted by philosophers who attempted to describe the process of human thinking as the mechanical manipulation of symbols. This work culminated in the invention of the programmable digital computer in the 1940s, a machine based on the abstract essence of mathematical reasoning. This device and the ideas behind it inspired a handful of scientists to begin seriously discussing the possibility of building an electronic brain.",
      output: "The history of AI traces back to ancient myths of artificial beings with intelligence created by craftsmen. Philosophers laid the groundwork by describing human thinking as mechanical symbol manipulation. This intellectual foundation led to the invention of programmable digital computers in the 1940s, based on mathematical reasoning principles. These early computers and concepts inspired scientists to seriously consider the possibility of creating electronic brains, marking the beginning of modern AI research.",
      metrics: {
        clarity: 9.2,
        effectiveness: 8.5,
        efficiency: 8.8
      }
    },
    {
      input: "Climate change is the long-term alteration of temperature and typical weather patterns in a place. Climate change could refer to a particular location or the planet as a whole. Climate change may cause weather patterns to be less predictable. These unexpected weather patterns can make it difficult to maintain and grow crops in regions that rely on farming because expected temperature and rainfall levels can no longer be relied on. Climate change has also been connected with other damaging weather events such as more frequent and more intense hurricanes, floods, downpours, and winter storms.",
      output: "Climate change refers to long-term alterations in temperature and weather patterns, affecting specific locations or the entire planet. It creates unpredictable weather patterns that disrupt agriculture in farming regions by making temperature and rainfall levels unreliable. Additionally, climate change has been linked to increased frequency and intensity of extreme weather events like hurricanes, floods, heavy downpours, and winter storms.",
      metrics: {
        clarity: 8.7,
        effectiveness: 7.9,
        efficiency: 9.1
      }
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link to="/prompt-eval">Prompt Evaluation</Link>
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
            onClick={() => navigate("/prompt-eval")}
          >
            Back to Tasks
          </Button>
        </div>

        <Card>
          <Descriptions title="Evaluation Information" bordered>
            <Descriptions.Item label="Evaluation ID" span={1}>{evaluationDetails.id}</Descriptions.Item>
            <Descriptions.Item label="Task ID" span={2}>{evaluationDetails.taskId}</Descriptions.Item>
            <Descriptions.Item label="Round" span={1}>{evaluationDetails.roundNumber} of {evaluationDetails.totalRounds}</Descriptions.Item>
            <Descriptions.Item label="Created On" span={2}>{evaluationDetails.createdAt}</Descriptions.Item>
            <Descriptions.Item label="Score" span={3}>{evaluationDetails.score.toFixed(1)}</Descriptions.Item>
            <Descriptions.Item label="Prompt" span={3}>
              <Paragraph copyable style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                {evaluationDetails.prompt}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>{evaluationDetails.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Metrics" key="1">
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
                  <ReactECharts
                    option={barChartOptions}
                    style={{ height: "400px", width: "100%" }}
                  />
                </div>
                <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
                  <ReactECharts
                    option={radarChartOptions}
                    style={{ height: "400px", width: "100%" }}
                  />
                </div>
              </div>

              <Divider />

              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            </Card>
          </TabPane>

          <TabPane tab="Progress Chart" key="2">
            <Card>
              <ReactECharts
                option={{
                  title: {
                    text: 'Prompt Improvement Progress',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                      const evalIndex = params[0].dataIndex;
                      const evaluation = sampleEvaluations[evalIndex];
                      return `${evaluation.name}<br/>Date: ${evaluation.createdAt}<br/>Score: ${evaluation.score.toFixed(1)}`;
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
                    max: 10,
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
                        width: 3,
                        color: '#52c41a'
                      },
                      symbol: 'circle',
                      symbolSize: 10,
                      itemStyle: {
                        color: function(params) {
                          // Highlight the current evaluation
                          return params.dataIndex === evaluationDetails.roundNumber - 1 ? '#f5222d' : '#52c41a';
                        }
                      }
                    }
                  ]
                }}
                style={{ height: "400px", width: "100%" }}
              />

              <Divider />

              <Title level={4}>Prompt Comparison</Title>
              <Table
                dataSource={sampleEvaluations.map(evaluation => ({
                  key: evaluation.id,
                  round: evaluation.roundNumber,
                  name: evaluation.name,
                  prompt: evaluation.prompt,
                  score: evaluation.score
                }))}
                columns={[
                  { title: 'Round', dataIndex: 'round', key: 'round', width: 80 },
                  { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
                  {
                    title: 'Prompt',
                    dataIndex: 'prompt',
                    key: 'prompt',
                    render: (text, record) => (
                      <div style={{
                        backgroundColor: record.key === evaluationDetails.id ? '#f6ffed' : '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                        border: record.key === evaluationDetails.id ? '1px solid #b7eb8f' : 'none'
                      }}>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: 'Score',
                    dataIndex: 'score',
                    key: 'score',
                    width: 80,
                    render: (score) => score.toFixed(1)
                  }
                ]}
                pagination={false}
              />
            </Card>
          </TabPane>

          <TabPane tab="Sample Responses" key="3">
            <Card>
              {sampleResponses.map((sample, index) => (
                <div key={index} style={{ marginBottom: index < sampleResponses.length - 1 ? 24 : 0 }}>
                  <Title level={4}>Sample {index + 1}</Title>

                  <Card title="Input" style={{ marginBottom: 16 }}>
                    <Paragraph>{sample.input}</Paragraph>
                  </Card>

                  <Card title="Output" style={{ marginBottom: 16 }}>
                    <Paragraph>{sample.output}</Paragraph>
                  </Card>

                  <Card title="Metrics">
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {Object.entries(sample.metrics).map(([key, value]) => (
                        <div key={key} style={{ margin: "0 24px 16px 0" }}>
                          <Text strong style={{ textTransform: "capitalize" }}>{key}: </Text>
                          <Text>{value}</Text>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {index < sampleResponses.length - 1 && <Divider />}
                </div>
              ))}
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
                    prompt: evaluationDetails.prompt,
                    metrics: {
                      clarity: 8.5,
                      effectiveness: 7.2,
                      efficiency: 9.0,
                      safety: 8.8,
                      coherence: 7.9
                    },
                    samples: sampleResponses,
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

export default PromptEvaluationReviewPanel;
