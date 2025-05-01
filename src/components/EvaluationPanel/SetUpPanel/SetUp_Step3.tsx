import type { DescriptionsProps } from "antd";
import { Card, Descriptions } from "antd";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "UserName",
    children: "Zhou Maomao",
  },
  {
    key: "2",
    label: "Telephone",
    children: "1810000000",
  },
  {
    key: "3",
    label: "Live",
    children: "Hangzhou, Zhejiang",
  },
  {
    key: "4",
    label: "Address",
    span: 2,
    children: "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
  },
  {
    key: "5",
    label: "Remark",
    children: "empty",
  },
];

const Step_3 = ({ cardStyle }: { cardStyle: React.CSSProperties }) => {
  return {
    title: "Review",
    content: (
      <Card title="Here is the detail" style={cardStyle}>
        <Descriptions title="User Info" layout="vertical" items={items} />;
      </Card>
    ),
  };
};

export default Step_3;
