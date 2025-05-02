import React from "react";
import { Card, Transfer } from "antd";
import type { TransferProps } from "antd";

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `Sample ${i + 1}`,
  description: `Sample data for RAG evaluation ${i + 1}`,
}));

const initialTargetKeys = mockData
  .filter((item) => Number(item.key) > 15)
  .map((item) => item.key);

// This is a factory function that returns an object with title and content
const Step_2 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Select Samples",
    content: (
      <Card title="Select Samples for Evaluation" style={cardStyle}>
        <TransferComponent />
      </Card>
    ),
  };
};

// This is the actual React component that uses hooks
const TransferComponent = () => {
  const [targetKeys, setTargetKeys] = React.useState<TransferProps["targetKeys"]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = React.useState<TransferProps["targetKeys"]>([]);

  const onChange: TransferProps["onChange"] = (
    nextTargetKeys,
    direction,
    moveKeys
  ) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps["onSelectChange"] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll: TransferProps["onScroll"] = (direction, e) => {
    console.log("direction:", direction);
    console.log("target:", e.target);
  };

  return (
    <Transfer
      dataSource={mockData}
      titles={["Available Samples", "Selected Samples"]}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      onScroll={onScroll}
      render={(item) => item.title}
      style={{ marginTop: "20px" }}
    />
  );
};

export default Step_2;
