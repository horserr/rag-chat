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

const EvaluationPanel: React.FC = () => {
  const navigate = useNavigate(); // 定义 navigate

  return (
    <div>
      <Splitter
        style={{ height: 300, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel collapsible>
          <Desc text="Left" />
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter layout="vertical">
            <Splitter.Panel>
              <Desc text="Top" />
            </Splitter.Panel>
            <Splitter.Panel>
              <Desc text="Bottom" />
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
      <Button
        type="primary"
        onClick={() => {
          navigate("set-up"); // 使用 Navigate 进行路由跳转
        }}
      >
        Go to Set Up Panel
      </Button>
    </div>
  );
};

export default EvaluationPanel;
