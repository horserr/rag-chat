import { Button, message, Steps } from "antd";
import { useState } from "react";
import Step_1 from "./SetUp_Step1";
import Step_2 from "./SetUp_Step2";
import Step_3 from "./SetUp_Step3";
import Step_4 from "./SetUp_Step4";
import { useNavigate } from "react-router-dom";

const defaultCardStyle: React.CSSProperties = {
  width: "80%",
  margin: "0 auto",
  height: "40vh",
};

const steps = [Step_1, Step_2, Step_3, Step_4].map((Step) =>
  Step({ cardStyle: defaultCardStyle })
);

const SetUpPanel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps
        current={current}
        items={steps.map((step) => ({ key: step.title, title: step.title }))}
        labelPlacement="vertical"
      />

      {/* Render content dynamically */}
      <div style={{ marginTop: 16 }}>{steps[current].content}</div>

      {/* Navigation buttons */}
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              message.success("RAG evaluation setup complete!");
              navigate("/rag-eval");
            }}
          >
            Return to RAG Evaluation
          </Button>
        )}
        {current > 0 && current != steps.length - 1 && (
          <Button style={{ margin: "0 8px" }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default SetUpPanel;
