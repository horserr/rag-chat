import { Card, Input, Select, Space } from "antd";
import React from "react";

const { TextArea } = Input;
const { Option } = Select;

const Step_1 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Evaluation Type",
    content: (
      <Card title="Select RAG Evaluation Type" style={cardStyle}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            defaultValue="single_turn"
            style={{ width: 200 }}
          >
            <Option value="single_turn">Single Turn</Option>
            <Option value="custom">Custom</Option>
            <Option value="multi_turn">Multi Turn</Option>
          </Select>
          
          <TextArea
            placeholder="Enter your evaluation description here..."
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ width: "80%", marginTop: "20px" }}
          />
        </Space>
      </Card>
    ),
  };
};

export default Step_1;
