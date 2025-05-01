import React from "react";
import { Layout, theme } from "antd";
import Breadcrumbs from "../components/Breadcrumbs";

const { Content } = Layout;

interface PageLayoutProps {
  breadcrumbs?: string[]; // 将 breadcrumbs 设置为可选
  children: React.ReactNode; // 页面内容
}

const NormalLayout: React.FC<PageLayoutProps> = ({ breadcrumbs, children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ padding: "0 48px" }}>
        {/* 条件渲染 Breadcrumbs */}
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default NormalLayout;
