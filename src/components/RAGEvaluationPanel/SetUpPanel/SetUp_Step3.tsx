import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Select } from "antd";

const { Option } = Select;

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Evaluation Type",
    children: "Single Turn",
  },
  {
    key: "2",
    label: "Number of Samples",
    children: "4",
  },
  {
    key: "3",
    label: "Created By",
    children: "User123",
  },
  {
    key: "4",
    label: "Description",
    span: 2,
    children: "Evaluating RAG system performance on factual queries",
  },
];

const Step_3 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Select Metrics",
    content: (
      <Card title="Configure Evaluation Metrics" style={cardStyle}>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '20px' }}
          placeholder="Select metrics for evaluation"
          defaultValue={['CONTEXT_RELEVANCE', 'FAITHFULNESS']}
        >
          <Option value="ASPECT_CRITIC">Aspect Critic</Option>
          <Option value="ANSWER_RELEVANCY">Answer Relevancy</Option>
          <Option value="CONTEXT_PRECISION">Context Precision</Option>
          <Option value="FAITHFULNESS">Faithfulness</Option>
          <Option value="CONTEXT_RELEVANCE">Context Relevance</Option>
          <Option value="FACTUAL_CORRECTNESS">Factual Correctness</Option>
        </Select>
        
        <Descriptions title="Evaluation Configuration" layout="vertical" items={items} />
      </Card>
    ),
  };
};

export default Step_3;
