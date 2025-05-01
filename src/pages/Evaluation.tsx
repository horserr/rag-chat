import React from "react";
import { Layout, theme } from "antd";
import Breadcrumbs from "../components/Breadcrumbs";

const { Content } = Layout;

const Evaluation: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumbs items={["Home", "Evaluation"]} />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div>
      </Content>
    </Layout>
  );
};

export default Evaluation;
