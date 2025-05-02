import React, { useState, useEffect } from "react";
import { Button, Layout, Typography, List, Card, Tag, Empty, Statistic, Row, Col, Collapse, Divider, Space, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, FileTextOutlined, LineChartOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { RagEvalService } from "../../services/rag_eval_service";
import { TaskBasic, EvalBasic, EvalStatusResponse } from "../../models/rag_eval";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Initialize the RAG evaluation service
const ragEvalService = new RagEvalService();

// Interface for our enhanced task data structure
interface EnhancedTask extends TaskBasic {
  description?: string;
  date?: string;
  evaluations: EnhancedEvaluation[];
}

// Interface for our enhanced evaluation data structure
interface EnhancedEvaluation extends EvalBasic {
  score?: number;
  date?: string;
  taskId?: string;
  taskName?: string;
  roundNumber?: number;
  totalRounds?: number;
}

// Helper function to get metric name from the metric string
const getMetricName = (metric: string): string => {
  // Convert from backend format (e.g., "CONTEXT_RELEVANCE") to display format (e.g., "Context Relevance")
  return metric
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const RAGEvaluationPanel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<EnhancedTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

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
      const response = await ragEvalService.getAllTasks();

      // Initialize tasks with empty evaluations array
      const enhancedTasks: EnhancedTask[] = response.tasks.map(task => ({
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
    } catch (error) {
      console.error("Error fetching tasks:", error);
      message.error("Failed to fetch tasks");
      setLoading(false);
    }
  };

  // Fetch evaluations for a specific task
  const fetchTaskEvaluations = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await ragEvalService.getTaskEvaluations(taskId);

      // Get task details
      const taskResponse = await ragEvalService.getTaskDetails(taskId);
      const taskDetail = taskResponse.task;

      // Fetch evaluation details and scores for each evaluation
      const enhancedEvaluations: EnhancedEvaluation[] = [];

      for (const evaluation of response.evaluations) {
        try {
          // Get evaluation status to get the score
          const statusResponse = await ragEvalService.checkEvaluationStatus(taskId, evaluation.id);

          // Only add completed evaluations with scores
          if (statusResponse.status === 'completed') {
            let score = 0;

            // Extract score based on evaluation type
            if ('result' in statusResponse) {
              if (statusResponse.eval_type === 'multi_turn') {
                score = statusResponse.average;
              } else {
                score = statusResponse.result.value;
              }
            }

            enhancedEvaluations.push({
              ...evaluation,
              score,
              date: new Date().toISOString().split('T')[0], // Use current date as fallback
              taskId,
              taskName: taskDetail.name
            });
          }
        } catch (error) {
          console.error(`Error fetching evaluation ${evaluation.id} details:`, error);
        }
      }

      // Sort evaluations by date (assuming newer evaluations have higher IDs)
      enhancedEvaluations.sort((a, b) => a.id.localeCompare(b.id));

      // Add round numbers
      enhancedEvaluations.forEach((evaluation, index) => {
        evaluation.roundNumber = index + 1;
        evaluation.totalRounds = enhancedEvaluations.length;
      });

      // Update the task with evaluations
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, evaluations: enhancedEvaluations, description: (taskDetail as any).description || '' }
            : task
        )
      );

      // Select the latest evaluation if available
      if (enhancedEvaluations.length > 0) {
        setSelectedEvaluation(enhancedEvaluations[enhancedEvaluations.length - 1].id);
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
    // Use evaluation IDs as labels if dates are not available
    const labels = task.evaluations.map((evaluation, index) =>
      `Round ${index + 1}`
    );

    const scores = task.evaluations.map(evaluation => evaluation.score || 0);

    return {
      title: {
        text: 'Evaluation Progress',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const evalIndex = params[0].dataIndex;
          const evaluation = task.evaluations[evalIndex];
          return `${evaluation.name}<br/>Round: ${evalIndex + 1}<br/>Score: ${(evaluation.score || 0).toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: labels,
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
          data: scores,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' }
            ]
          },
          lineStyle: {
            width: 3
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
          <Title level={4}>RAG Evaluation Tasks</Title>
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
                  avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                  title={task.name}
                  description={
                    <>
                      <Text type="secondary">{task.date || 'No date'}</Text>
                      <br />
                      <Tag color="blue">{task.evaluations.length} Rounds</Tag>
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
            <Paragraph>{taskDetails.description}</Paragraph>

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
                      setSelectedEvaluation(key[key.length - 1].toString());
                    }
                  }}
                >
                  {taskDetails.evaluations.map(evaluation => (
                    <Panel
                      header={
                        <Space>
                          <Text strong>{evaluation.name}</Text>
                          {evaluation.score !== undefined && (
                            <Tag color="green">Score: {evaluation.score.toFixed(2)}</Tag>
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
                            navigate(`/rag-eval/review?id=${evaluation.id}&taskId=${taskDetails.id}`);
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
                              <Statistic title="Score" value={evaluation.score} precision={2} />
                            </Col>
                          )}
                          <Col span={8}>
                            <Statistic title="Type" value={evaluation.eval_type} />
                          </Col>
                          <Col span={8}>
                            <Statistic title="Status" value={evaluation.status} />
                          </Col>
                        </Row>
                        <Divider />
                        <Title level={5}>Metric</Title>
                        <Text>{getMetricName(evaluation.metric)}</Text>
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

export default RAGEvaluationPanel;
