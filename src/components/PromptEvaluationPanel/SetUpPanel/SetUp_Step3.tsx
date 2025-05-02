import type { DescriptionsProps } from "antd";
import { Card, Descriptions } from "antd";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Prompt Type",
    children: "Instruction",
  },
  {
    key: "2",
    label: "Evaluation Method",
    children: "Automated",
  },
  {
    key: "3",
    label: "Model",
    children: "GPT-4",
  },
  {
    key: "4",
    label: "Prompt Content",
    span: 2,
    children: "Write a summary of the following text...",
  },
];

const Step_3 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Review",
    content: (
      <Card title="Prompt Evaluation Details" style={cardStyle}>
        <Descriptions title="Configuration" layout="vertical" items={items} />;
      </Card>
    ),
  };
};

export default Step_3;
