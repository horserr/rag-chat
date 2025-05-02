import React, { useState, useEffect } from "react";
import { Button, Layout, Typography, List, Card, Tag, Empty, Statistic, Row, Col, Collapse, Divider, Space, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, FormOutlined, LineChartOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { PromptEvalService } from "../../services/prompt_eval_service";
import { Task, Eval } from "../../models/prompt_eval";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Initialize the prompt evaluation service
const promptEvalService = new PromptEvalService();

// Interface for our enhanced task data structure
interface EnhancedTask extends Task {
  evaluations: EnhancedEvaluation[];
}

// Interface for our enhanced evaluation data structure
interface EnhancedEvaluation extends Eval {
  name?: string;
  score?: number;
  metrics?: string[];
  roundNumber?: number;
  totalRounds?: number;
}

// Helper function to calculate a score based on prompt length and complexity
// This is just a placeholder since the API doesn't provide scores
const calculateScore = (prompt: string): number => {
  // Simple scoring based on prompt length and complexity
  const length = prompt.length;
  const complexity = (prompt.match(/[.!?]/g) || []).length; // Count sentences

  // Normalize to a 0-10 scale
  return Math.min(Math.max((length / 100 + complexity) / 2, 0), 10);
};

const PromptEvaluationPanel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<EnhancedTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<number | null>(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch task evaluations when a task is selected
  useEffect(() => {
    if (selectedTask) {
      fetchTaskEvaluations(selectedTask);
    }
  }, [selectedTask]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await promptEvalService.getAllTasks();

      if (response.code === 0 && response.data) {
        // Initialize tasks with empty evaluations array
        const enhancedTasks: EnhancedTask[] = response.data.map(task => ({
          ...task,
          evaluations: []
        }));

        setTasks(enhancedTasks);

        // If there are tasks, select the first one
        if (enhancedTasks.length > 0) {
          setSelectedTask(enhancedTasks[0].id);
        } else {
          setLoading(false);
        }
      } else {
        message.error("Failed to fetch tasks: " + response.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      message.error("Failed to fetch tasks");
      setLoading(false);
    }
  };

  // Fetch evaluations for a specific task
  const fetchTaskEvaluations = async (taskId: number) => {
    try {
      setLoading(true);
      const response = await promptEvalService.getTaskEvals(taskId);

      if (response.code === 0 && response.data) {
        // Get task details
        const taskResponse = await promptEvalService.getTask(taskId);

        if (taskResponse.code === 0 && taskResponse.data) {
          const taskDetail = taskResponse.data;

          // Enhance evaluations with additional properties
          const enhancedEvaluations: EnhancedEvaluation[] = response.data.map((evaluation, index) => {
            // Calculate a score based on the prompt (since API doesn't provide scores)
            const score = calculateScore(evaluation.prompt);

            return {
              ...evaluation,
              name: `Round ${index + 1} - Prompt Evaluation`,
              score,
              metrics: ["Clarity", "Effectiveness", "Efficiency"],
              roundNumber: index + 1,
              totalRounds: response.data.length
            };
          });

          // Sort evaluations by date
          enhancedEvaluations.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Update the task with evaluations
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId
                ? { ...task, evaluations: enhancedEvaluations }
                : task
            )
          );

          // Select the latest evaluation if available
          if (enhancedEvaluations.length > 0) {
            setSelectedEvaluation(enhancedEvaluations[enhancedEvaluations.length - 1].id);
          }
        }
      } else {
        message.error("Failed to fetch evaluations: " + response.message);
      }

      setLoading(false);
    } catch (error) {
      console.error(`Error fetching evaluations for task ${taskId}:`, error);
      message.error("Failed to fetch evaluations");
      setLoading(false);
    }
  };

  // Find the selected task details
  const taskDetails = selectedTask
    ? tasks.find(task => task.id === selectedTask)
    : null;

  // Find the selected evaluation details
  const evaluationDetails = taskDetails && selectedEvaluation
    ? taskDetails.evaluations.find(evaluation => evaluation.id === selectedEvaluation)
    : null;

  // Generate line chart options for task progress
  const getProgressChartOptions = (task: EnhancedTask) => {
    // Format dates for display
    const dates = task.evaluations.map(evaluation =>
      new Date(evaluation.createdAt).toLocaleDateString()
    );

    const scores = task.evaluations.map(evaluation => evaluation.score || 0);
    const rounds = task.evaluations.map((_, index) => `Round ${index + 1}`);

    return {
      title: {
        text: 'Prompt Improvement Progress',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const evalIndex = params[0].dataIndex;
          const evaluation = task.evaluations[evalIndex];
          return `${rounds[evalIndex]}<br/>Date: ${dates[evalIndex]}<br/>Score: ${(evaluation.score || 0).toFixed(1)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: rounds,
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
          data: scores,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' }
            ]
          },
          lineStyle: {
            width: 3,
            color: '#52c41a'
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };
  };

  return (
    <Layout style={{ height: "calc(100vh - 120px)", background: "#fff" }}>
      <Sider width={300} theme="light" style={{ borderRight: "1px solid #f0f0f0", overflow: "auto" }}>
        <div style={{ padding: "16px 16px 0" }}>
          <Title level={4}>Prompt Evaluation Tasks</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: "100%", marginBottom: 16 }}
            onClick={() => navigate("set-up")}
          >
            Create New Task
          </Button>
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <Spin tip="Loading tasks..." />
          </div>
        ) : (
          <List
            dataSource={tasks}
            renderItem={task => (
              <List.Item
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedTask === task.id ? "#e6f7ff" : "transparent",
                  padding: "12px 16px"
                }}
                onClick={() => {
                  setSelectedTask(task.id);
                  if (task.evaluations.length > 0) {
                    setSelectedEvaluation(task.evaluations[task.evaluations.length - 1].id); // Select the latest evaluation
                  }
                }}
              >
                <List.Item.Meta
                  avatar={<FormOutlined style={{ fontSize: 24 }} />}
                  title={task.name}
                  description={
                    <>
                      <Text type="secondary">{new Date(task.createdAt).toLocaleDateString()}</Text>
                      <br />
                      <Tag color="green">{task.evaluations.length} Rounds</Tag>
                    </>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: 'No tasks found' }}
          />
        )}
      </Sider>

      <Content style={{ padding: 24, overflow: "auto" }}>
        {loading ? (
          <div style={{ padding: 100, textAlign: 'center' }}>
            <Spin tip="Loading evaluation data..." size="large" />
          </div>
        ) : taskDetails ? (
          <>
            <Title level={3}>{taskDetails.name}</Title>
            <Paragraph>{taskDetails.description || 'No description available'}</Paragraph>

            {taskDetails.evaluations.length > 0 ? (
              <Card style={{ marginBottom: 16 }}>
                <ReactECharts
                  option={getProgressChartOptions(taskDetails)}
                  style={{ height: 300 }}
                />
              </Card>
            ) : (
              <Card style={{ marginBottom: 16, textAlign: 'center', padding: 20 }}>
                <Text type="secondary">No evaluations available for this task yet.</Text>
              </Card>
            )}

            <Divider orientation="left">Evaluation Rounds</Divider>

            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
              <Button
                type="dashed"
                icon={<PlusCircleOutlined />}
                onClick={() => navigate("set-up", { state: { taskId: taskDetails.id } })}
                style={{ width: '100%' }}
              >
                Add New Evaluation Round
              </Button>

              {taskDetails.evaluations.length > 0 ? (
                <Collapse
                  defaultActiveKey={[selectedEvaluation]}
                  onChange={(key) => {
                    if (Array.isArray(key) && key.length > 0) {
                      setSelectedEvaluation(parseInt(key[key.length - 1].toString()));
                    }
                  }}
                >
                  {taskDetails.evaluations.map(evaluation => (
                    <Panel
                      header={
                        <Space>
                          <Text strong>{evaluation.name || `Evaluation ${evaluation.id}`}</Text>
                          {evaluation.score !== undefined && (
                            <Tag color="green">Score: {evaluation.score.toFixed(1)}</Tag>
                          )}
                        </Space>
                      }
                      key={evaluation.id}
                      extra={
                        <Button
                          type="link"
                          icon={<LineChartOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/prompt-eval/review?id=${evaluation.id}&taskId=${taskDetails.id}`);
                          }}
                        >
                          Details
                        </Button>
                      }
                    >
                      <Card>
                        <Row gutter={16}>
                          {evaluation.score !== undefined && (
                            <Col span={8}>
                              <Statistic title="Score" value={evaluation.score} precision={1} />
                            </Col>
                          )}
                          <Col span={16}>
                            <Statistic title="Date" value={new Date(evaluation.createdAt).toLocaleDateString()} />
                          </Col>
                        </Row>

                        <Divider />

                        <Title level={5}>Prompt</Title>
                        <Paragraph copyable style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                          {evaluation.prompt}
                        </Paragraph>

                        {evaluation.metrics && (
                          <>
                            <Divider />
                            <Title level={5}>Metrics</Title>
                            <Row gutter={[16, 16]}>
                              {evaluation.metrics.map(metric => (
                                <Col key={metric} span={8}>
                                  <Tag color="blue" style={{ padding: '4px 8px' }}>{metric}</Tag>
                                </Col>
                              ))}
                            </Row>
                          </>
                        )}
                      </Card>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Empty description="No evaluations found for this task" />
              )}
            </Space>
          </>
        ) : (
          <Empty
            description="Select a task to view details"
            style={{ marginTop: 100 }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default PromptEvaluationPanel;
