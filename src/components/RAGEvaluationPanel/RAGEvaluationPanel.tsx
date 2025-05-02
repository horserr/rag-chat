import { Button, Flex, Splitter, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title
      type="secondary"
      level={5}
      style={{ whiteSpace: "nowrap" }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

const RAGEvaluationPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Splitter
        style={{ height: 300, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel collapsible>
          <Desc text="RAG Tasks" />
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter layout="vertical">
            <Splitter.Panel>
              <Desc text="RAG Details" />
            </Splitter.Panel>
            <Splitter.Panel>
              <Desc text="Evaluation Results" />
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
      <Button
        type="primary"
        onClick={() => {
          navigate("set-up");
        }}
      >
        Create New RAG Evaluation
      </Button>
    </div>
  );
};

export default RAGEvaluationPanel;
