import { SmileOutlined } from "@ant-design/icons";
import { Card, Button, Result } from "antd";
import { Link } from "react-router-dom";

const Step_4 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Finish",
    content: (
      <Card style={cardStyle}>
        <Result
          icon={<SmileOutlined />}
          title="RAG evaluation setup complete!"
          extra={
            <Link to="/rag-eval/review">
              <Button type="primary">Go to Review</Button>
            </Link>
          }
        />
      </Card>
    ),
  };
};

export default Step_4;
