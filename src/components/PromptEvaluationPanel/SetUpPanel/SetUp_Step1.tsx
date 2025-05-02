import { Card, Input } from "antd";
import React from "react";

const { TextArea } = Input;

const Step_1 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Prompt Input",
    content: (
      <Card title="Enter Your Prompt" style={cardStyle}>
        <TextArea
          placeholder="Please enter your prompt here.😉"
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ flexGrow: 1, width: "80%", marginTop: "10px" }}
        />
      </Card>
    ),
  };
};

export default Step_1;
